import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, verifyToken } from '@/lib/auth';
import type { TokenPayload } from '@/types';

/**
 * Server-only utility to get the authenticated user from the request cookies.
 * This is primarily used in API routes and Server Components.
 */
export async function getAuthUser(): Promise<TokenPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return await verifyToken(token);
}
