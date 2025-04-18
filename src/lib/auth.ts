import { NextRequest } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface DecodedUser extends JwtPayload {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export async function getUserFromToken(req: NextRequest): Promise<DecodedUser | null> {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as DecodedUser;
    return decoded;
  } catch (err) {
    console.error('Token error:', err);
    return null;
  }
}



export function getUserFromTokenString(token: string): DecodedUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'object' && 'id' in decoded && 'role' in decoded) {
      return decoded as DecodedUser;
    }
    return null;
  } catch (error) {
    console.error('Token string decode error:', error);
    return null;
  }
}
