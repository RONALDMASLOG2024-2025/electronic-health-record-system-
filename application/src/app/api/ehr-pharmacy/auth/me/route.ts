import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/features/ehr-pharmacy-integration/auth/jwt';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('ehrpharmacy_session')?.value;
  if(!token) return NextResponse.json({ user: null });
  const session = verifyToken(token);
  return NextResponse.json({ user: session });
}
