import bcrypt from 'bcryptjs';
import { User, Patient, Prescription, PrescriptionStatus } from './types';
import { randomUUID } from 'crypto';

// In-memory data (replace with DB later)
const users: User[] = [];
const patients: Patient[] = [];
const prescriptions: Prescription[] = [];

function seed() {
  // Reseed if empty OR legacy credentials still present
  if (users.length && users.some(u => u.email === 'doc@gmail.com' || u.email === 'pharm@gmail.com')) return;
  if (users.length && users.some(u => u.email.endsWith('@example.com'))) {
    users.splice(0, users.length);
    prescriptions.splice(0, prescriptions.length);
    patients.splice(0, patients.length);
  }
  if (users.length) return; // after possible reset
  const doctorPass = bcrypt.hashSync('doctor123', 10);
  const pharmPass = bcrypt.hashSync('pharm123', 10);
  users.push(
    { id: randomUUID(), role: 'doctor', email: 'doc@gmail.com', name: 'Dr. Alice Carter', passwordHash: doctorPass },
    { id: randomUUID(), role: 'pharmacist', email: 'pharm@gmail.com', name: 'Pharm Bob Lee', passwordHash: pharmPass },
  );
  // Patients
  patients.push(
    { id: randomUUID(), name: 'John Doe', dob: '1980-05-01' },
    { id: randomUUID(), name: 'Maria Gomez', dob: '1975-11-20' },
  );
  // Sample prescription
  prescriptions.push({
    id: randomUUID(),
    patientId: patients[0].id,
    doctorId: users[0].id,
    drug: 'Amoxicillin 500mg',
    dosage: '500mg',
    quantity: 30,
    instructions: 'Take one capsule every 8 hours for 10 days',
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}
seed();

export function findUserByEmail(email: string) { return users.find(u => u.email === email); }
export function getUser(id: string) { return users.find(u => u.id === id); }
export function listPatients() { return [...patients]; }
export function listPrescriptions() { return [...prescriptions]; }
export function listPrescriptionsForPharmacist() { return [...prescriptions]; }
export function listPrescriptionsForDoctor(doctorId: string) { return prescriptions.filter(p => p.doctorId === doctorId); }
export function createPrescription(data: Omit<Prescription,'id'|'status'|'createdAt'|'updatedAt'>) {
  const p: Prescription = { ...data, id: randomUUID(), status: 'new', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  prescriptions.unshift(p); return p;
}
export function updatePrescription(id: string, patch: Partial<Omit<Prescription,'id'|'doctorId'|'patientId'|'createdAt'>>) {
  const idx = prescriptions.findIndex(p => p.id === id); if (idx === -1) return undefined;
  const cur = prescriptions[idx];
  const next = { ...cur, ...patch, updatedAt: new Date().toISOString() } as Prescription;
  prescriptions[idx] = next; return next;
}
export function deletePrescription(id: string) {
  const idx = prescriptions.findIndex(p => p.id === id); if (idx === -1) return false; prescriptions.splice(idx,1); return true;
}
export function changePrescriptionStatus(id: string, status: PrescriptionStatus) {
  return updatePrescription(id, { status });
}
