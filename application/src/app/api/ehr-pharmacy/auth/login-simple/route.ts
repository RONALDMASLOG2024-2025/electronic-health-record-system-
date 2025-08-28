import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { issueDevSession } from '@/features/ehr-pharmacy-integration/auth/jwt';

const schema = z.object({ role: z.enum(['doctor','pharmacist']) });

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Disabled in production' }, { status: 403 });
  }
  const json = await req.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  const token = issueDevSession(parsed.data.role);
  if (!token) return NextResponse.json({ error: 'Failed to issue session' }, { status: 500 });
  const res = NextResponse.json({ ok: true });
  const secure = (process.env.NODE_ENV as string) === 'production';
  res.cookies.set('ehrpharmacy_session', token, { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: 3600 });
  return res;
}
