import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticate } from '@/features/ehr-pharmacy-integration/auth/jwt';

const bodySchema = z.object({ email: z.string().email(), password: z.string().min(6) });

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  const token = await authenticate(parsed.data.email, parsed.data.password);
  if (!token) {
    // Differentiate probable causes for easier dev debugging (not leaking specifics in prod)
    const base = process.env.NODE_ENV==='production' ? 'Invalid credentials' : 'Invalid credentials or session sign failed';
    return NextResponse.json({ error: base }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === 'production';
  res.cookies.set('ehrpharmacy_session', token, { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: 3600 });
  return res;
}
