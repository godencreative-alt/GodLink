import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const totalLinks = await prisma.link.count();
  return NextResponse.json({ totalLinks });
}
