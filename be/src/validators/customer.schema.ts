import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().optional(),
  address: z.string().optional(),
  gstin: z.string().optional(),
  pan: z.string().optional(),
  state: z.string().optional(),
  stateCode: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type CustomerInput = z.infer<typeof customerSchema>;