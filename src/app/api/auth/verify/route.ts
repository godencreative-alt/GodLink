import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    });

    if (!verificationToken) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { token } });
      return NextResponse.json({ error: 'Token has expired' }, { status: 400 });
    }

    // Mark user as verified
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() }
    });

    // Delete the token
    await prisma.verificationToken.delete({ where: { token } });

    return NextResponse.json({ success: true, message: 'Email verified' });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}