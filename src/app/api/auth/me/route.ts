import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
  try {
    const token = (await cookies()).get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      name: string;
      email: string;
      role: string;
    };

    return NextResponse.json(decoded);
  } catch (err) {
    console.error('Error verifying token:', err);
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}
