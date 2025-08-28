import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  // Clear cookie (expires in past)
  res.cookies.set('ehrpharmacy_session', '', { httpOnly: true, secure: process.env.NODE_ENV==='production', sameSite: 'lax', path: '/', maxAge: 0 });
  return res;
}
