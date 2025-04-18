import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'));
  res.cookies.set('token', '', { path: '/', expires: new Date(0) }); // clear token
  return res;
}
