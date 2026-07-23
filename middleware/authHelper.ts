import { jwtVerify } from 'jose';

const AUTH_COOKIE_NAME = 'auth-token';

/**
 * Edge-compatible JWT verification.
 * Used by root middleware.ts which runs in the Edge Runtime.
 * Returns true if the token is valid, false otherwise.
 */
export async function verifyAuthToken(token: string): Promise<boolean> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return false;
  try {
    const key = new TextEncoder().encode(secret);
    await jwtVerify(token, key);
    return true;
  } catch {
    return false;
  }
}

export { AUTH_COOKIE_NAME };
