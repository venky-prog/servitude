import { logger } from '@servitude/logger';
import { jwtVerify, SignJWT } from 'jose';

export type Payload = {
    userId: string;
} | null;

export async function generateToken(userId: string): Promise<string> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('12h')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret'));
  return token;
}

export async function verifyToken(
  token: string,
): Promise<Payload> {
  try {
    const { payload } = await jwtVerify<Payload>(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret'),
    );
    return payload;
  } catch (error) {
    logger.error('Token verification failed:', error);
    return null;
  }
}
