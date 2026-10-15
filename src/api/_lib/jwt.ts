import crypto from 'crypto';

export interface JWTPayload {
  sub: string;
  email: string;
  company_name?: string;
  jti: string;
  iat: number;
  exp: number;
  v: number;
}

const TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined on server environment.');
  }
  return secret;
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Signs a new secure JWT with HMAC-SHA256
 */
export function signToken(
  data: { sub: string; email: string; company_name?: string; v?: number },
  expiresInSeconds: number = TOKEN_MAX_AGE_SECONDS
): string {
  const secret = getJwtSecret();
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);

  const payload: JWTPayload = {
    sub: data.sub,
    email: data.email,
    company_name: data.company_name || '',
    jti: crypto.randomBytes(16).toString('hex'),
    iat: now,
    exp: now + expiresInSeconds,
    v: data.v ?? 1,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verifies the JWT signature and expiration.
 * Returns null if invalid, expired, or tampered.
 */
export function verifyToken(token: string): JWTPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const secret = getJwtSecret();

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payloadStr = base64UrlDecode(encodedPayload);
    const payload: JWTPayload = JSON.parse(payloadStr);

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }

    if (!payload.sub || !payload.email) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Renews/rotates a token if it is valid.
 * Generates a fresh unique token ID (jti) and increments rotation sequence.
 */
export function renewToken(payload: JWTPayload): string {
  return signToken({
    sub: payload.sub,
    email: payload.email,
    company_name: payload.company_name,
    v: (payload.v || 1) + 1,
  });
}

/**
 * Parses cookies from raw request Cookie header
 */
export function parseCookies(cookieHeader?: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const key = parts[0]?.trim();
    if (key) {
      const val = parts.slice(1).join('=').trim();
      try {
        list[key] = decodeURIComponent(val);
      } catch {
        list[key] = val;
      }
    }
  });

  return list;
}

export const AUTH_COOKIE_NAME = 'novasats_auth';

/**
 * Creates HttpOnly, Secure, SameSite=Lax cookie header string
 */
export function createAuthCookie(token: string, maxAgeSeconds: number = TOKEN_MAX_AGE_SECONDS): string {
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  const secure = isProd ? '; Secure' : '';
  return `${AUTH_COOKIE_NAME}=${token}; Path=/; Max-Age=${maxAgeSeconds}; HttpOnly; SameSite=Lax${secure}`;
}

/**
 * Creates cookie header string to clear/revoke the authentication cookie
 */
export function createClearAuthCookie(): string {
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  const secure = isProd ? '; Secure' : '';
  return `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax${secure}`;
}
