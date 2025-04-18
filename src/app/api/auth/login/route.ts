import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const res = new NextResponse(JSON.stringify({ message: 'Login successful', user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    res.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
