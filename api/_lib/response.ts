import { verifyToken, renewToken, parseCookies, createAuthCookie, AUTH_COOKIE_NAME, JWTPayload } from './jwt';

export interface ApiContext {
  req: any;
  res: any;
  supplier: JWTPayload | null;
  newAuthCookie?: string;
}

/**
 * Extracts and verifies the JWT token from HttpOnly cookie or Authorization Bearer header.
 * If the token is valid, creates a renewed rotation token so the session automatically slides.
 */
export function authenticateRequest(req: any): { supplier: JWTPayload | null; renewedCookie?: string } {
  const cookieHeader = req.headers?.cookie || req.headers?.Cookie;
  const cookies = parseCookies(cookieHeader);
  let token = cookies[AUTH_COOKIE_NAME];

  if (!token) {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) {
    return { supplier: null };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return { supplier: null };
  }

  // Token rotation / sliding session:
  // If token has lived more than 1 hour, issue a renewed token
  const now = Math.floor(Date.now() / 1000);
  const tokenAge = now - payload.iat;
  let renewedCookie: string | undefined;

  if (tokenAge > 3600) {
    const newToken = renewToken(payload);
    renewedCookie = createAuthCookie(newToken);
  }

  return { supplier: payload, renewedCookie };
}

/**
 * Standard JSON response helper with optional caching & cookie headers
 */
export function sendJson(
  res: any,
  statusCode: number,
  data: any,
  options?: {
    cache?: 'no-store' | 'short' | 'public-edge' | 'immutable';
    cookie?: string;
  }
) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // Performance headers for slow / unstable connections
  if (options?.cache === 'public-edge') {
    // Vercel Edge Cache: Serves in ~20ms globally, background revalidation for fast repeat visits
    res.setHeader(
      'Cache-Control',
      'public, max-age=30, s-maxage=120, stale-while-revalidate=600'
    );
  } else if (options?.cache === 'short') {
    res.setHeader(
      'Cache-Control',
      'public, max-age=10, s-maxage=30, stale-while-revalidate=120'
    );
  } else if (options?.cache === 'immutable') {
    res.setHeader(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  } else {
    // Default for private / authenticated / mutating requests
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
  }

  if (options?.cookie) {
    res.setHeader('Set-Cookie', options.cookie);
  }

  res.end(JSON.stringify(data));
}

/**
 * Parse JSON body from incoming stream if not already parsed
 */
export async function parseBody(req: any): Promise<any> {
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
    return req.body;
  }

  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk: any) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => {
      resolve({});
    });
  });
}
