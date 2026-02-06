'use server';

import { cookies } from 'next/headers';
import crypto from 'crypto';

export interface AuthResponse {
  success: boolean;
  message: string;
}

const TOKEN_NAME = 'admin_token';
const TOKEN_MAX_AGE = 60 * 60 * 24; // 24 hours

function generateToken(): string {
  const secret = process.env.ADMIN_PASSWORD || 'fallback';
  const payload = `admin:${Date.now()}:${crypto.randomBytes(16).toString('hex')}`;
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  // token = base64(payload:hmac)
  return Buffer.from(`${payload}:${hmac}`).toString('base64');
}

function verifyToken(token: string): boolean {
  try {
    const secret = process.env.ADMIN_PASSWORD || 'fallback';
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length < 4) return false;
    const hmac = parts.pop()!;
    const payload = parts.join(':');
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<AuthResponse> {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    return {
      success: false,
      message: 'Admin credentials not configured on server',
    };
  }

  if (username === adminUsername && password === adminPassword) {
    // Set auth cookie
    const token = generateToken();
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: TOKEN_MAX_AGE,
      path: '/',
    });

    return {
      success: true,
      message: 'Authenticated successfully',
    };
  }

  return {
    success: false,
    message: 'Invalid username or password',
  };
}

export async function checkAdminSession(): Promise<AuthResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;

  if (!token) {
    return { success: false, message: 'No session found' };
  }

  if (verifyToken(token)) {
    return { success: true, message: 'Session valid' };
  }

  return { success: false, message: 'Invalid or expired session' };
}

export async function logoutAdmin(): Promise<AuthResponse> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
  return { success: true, message: 'Logged out' };
}
