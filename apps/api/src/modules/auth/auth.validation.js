import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  role: z.enum(['institution', 'officer', 'admin']).optional(),
});

export const registerInstitutionSchema = z.object({
  aicteId: z.string().regex(/^1-\d{9,11}$/, 'Invalid AICTE ID format'),
  name: z.string().min(3),
  state: z.string().min(2),
  contactPerson: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(6),
});
