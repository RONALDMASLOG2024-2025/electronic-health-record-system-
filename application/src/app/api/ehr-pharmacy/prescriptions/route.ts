import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyToken } from '@/features/ehr-pharmacy-integration/auth/jwt';
import { createPrescription, listPrescriptionsForDoctor, listPrescriptionsForPharmacist, listPatients } from '@/features/ehr-pharmacy-integration/auth/store';

function session(req: NextRequest) {
  const token = req.cookies.get('ehrpharmacy_session')?.value; if (!token) return null; return verifyToken(token);
}

export async function GET(req: NextRequest) {
  const s = session(req); if (!s) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const prescriptions = s.role === 'doctor' ? listPrescriptionsForDoctor(s.userId) : listPrescriptionsForPharmacist();
  return NextResponse.json({ prescriptions, patients: listPatients(), role: s.role });
}

const createSchema = z.object({ patientId: z.string(), drug: z.string(), dosage: z.string(), quantity: z.number().min(1), instructions: z.string().min(3) });
export async function POST(req: NextRequest) {
  const s = session(req); if (!s || s.role !== 'doctor') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const json = await req.json();
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  const p = createPrescription({ ...parsed.data, doctorId: s.userId });
  return NextResponse.json({ prescription: p });
}
