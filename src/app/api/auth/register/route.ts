import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validators/schemas';
import { sendVerificationEmail } from '@/lib/email';
import { randomBytes } from 'crypto';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(ip + ':register', { windowMs: 3600000, max: 5 });

    if (!limit.success) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { name, email, password, planId } = parsed.data;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    let selectedPlanId: string | null = null;
    if (planId) {
      const plan = await prisma.plan.findFirst({ where: { id: planId, active: true }, select: { id: true } });
      if (!plan) {
        return NextResponse.json({ error: 'Selected plan is not available' }, { status: 400 });
      }
      selectedPlanId = plan.id;
    }

    if (!selectedPlanId) {
      const starterPlan = await prisma.plan.findFirst({
        where: { active: true },
        orderBy: [{ price: 'asc' }, { sortOrder: 'asc' }],
        select: { id: true }
      });
      selectedPlanId = starterPlan?.id || null;
    }

    const hashed = await hash(password, 12);
    const autoVerify = !process.env.RESEND_API_KEY;
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        planId: selectedPlanId,
        emailVerified: autoVerify ? new Date() : null
      }
    });

    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires
      }
    });

    if (process.env.RESEND_API_KEY) {
      try {
        await sendVerificationEmail(email, token);
      } catch (error) {
        console.error('Failed to send verification email:', error);
      }
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      planId: user.planId,
      message: 'Account created. Please check your email to verify your account.'
    }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}