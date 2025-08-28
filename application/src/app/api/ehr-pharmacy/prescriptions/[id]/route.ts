import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyToken } from '@/features/ehr-pharmacy-integration/auth/jwt';
import { updatePrescription, deletePrescription, changePrescriptionStatus } from '@/features/ehr-pharmacy-integration/auth/store';

function session(req: NextRequest) {
  const token = req.cookies.get('ehrpharmacy_session')?.value; if (!token) return null; return verifyToken(token);
}

const updateSchema = z.object({ drug: z.string().optional(), dosage: z.string().optional(), quantity: z.number().min(1).optional(), instructions: z.string().min(3).optional() });
const statusSchema = z.object({ status: z.enum(['dispensed','cancelled']) });

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const s = session(req); if (!s) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const json = await req.json();
  if (s.role === 'doctor') {
    const parsed = updateSchema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    const updated = updatePrescription(params.id, parsed.data);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ prescription: updated });
  }
  if (s.role === 'pharmacist') {
    const parsed = statusSchema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    const updated = changePrescriptionStatus(params.id, parsed.data.status === 'dispensed' ? 'dispensed' : 'cancelled');
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ prescription: updated });
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const s = session(req); if (!s || s.role !== 'doctor') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const ok = deletePrescription(params.id);
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
