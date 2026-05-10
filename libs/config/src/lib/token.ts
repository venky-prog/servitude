import { logger } from '@servitude/logger';
import { jwtVerify, SignJWT, errors } from 'jose';
import { TokenExpiredError } from './errors';

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
): Promise<Payload | undefined> {
  try {
    const { payload } = await jwtVerify<Payload>(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret'),
    );
    return payload;
  } catch (error) {
    if( error instanceof errors.JWTExpired) {
      logger.warn('Token has expired:', error);
      throw new TokenExpiredError('Token has expired');
    }
    else if(error instanceof errors.JWTInvalid) {
      logger.error('Token verification failed:', error);
      throw new TokenExpiredError('Token is invalid or has expired');
    }
  }
}
