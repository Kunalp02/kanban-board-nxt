import DashboardClient from '@/components/DashboardClient';
import { cookies } from 'next/headers';
import { getUserFromTokenString } from '@/lib/auth';
import type { DecodedUser } from '@/lib/auth';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const decoded = token ? getUserFromTokenString(token) : null;

  const user: DecodedUser | null = decoded && typeof decoded === 'object' && 'id' in decoded
    ? {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      }
    : null;

  return <DashboardClient user={user} />;
}
