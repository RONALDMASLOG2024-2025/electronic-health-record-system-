import { z } from 'zod';

export const roleSchema = z.enum(['doctor','pharmacist']);
export type UserRole = z.infer<typeof roleSchema>;

export const userSchema = z.object({
  id: z.string(),
  role: roleSchema,
  email: z.string().email(),
  name: z.string(),
  passwordHash: z.string(),
});
export type User = z.infer<typeof userSchema>;

export interface Session {
  userId: string;
  role: UserRole;
  exp?: number; // added by JWT verify
}

export const patientSchema = z.object({ id: z.string(), name: z.string(), dob: z.string() });
export type Patient = z.infer<typeof patientSchema>;

export const prescriptionStatusSchema = z.enum(['new','dispensed','cancelled']);
export type PrescriptionStatus = z.infer<typeof prescriptionStatusSchema>;

export const prescriptionSchema = z.object({
  id: z.string(),
  patientId: z.string(),
  doctorId: z.string(),
  drug: z.string(),
  dosage: z.string(),
  quantity: z.number(),
  instructions: z.string(),
  status: prescriptionStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Prescription = z.infer<typeof prescriptionSchema>;
