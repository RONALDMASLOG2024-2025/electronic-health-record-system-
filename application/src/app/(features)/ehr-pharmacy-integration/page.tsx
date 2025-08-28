import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '@/features/ehr-pharmacy-integration/auth/jwt';

export default async function EHRPharmacyIntegrationEntry() {
  const c = await cookies();
  const token = c.get('ehrpharmacy_session')?.value;
  if (!token || !verifyToken(token)) {
    redirect('/ehr-pharmacy-integration/login');
  }
  redirect('/ehr-pharmacy-integration/dashboard');
}
