import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(users);
  } catch (err) {
    console.error('Failed to fetch users:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}