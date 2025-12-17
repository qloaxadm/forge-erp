import { z } from "zod";

export const createSupplierSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  contact_person: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  tax_number: z.string().optional(),
  payment_terms: z.number().int("Payment terms must be an integer").optional(),
  currency: z.string().length(3, "Currency must be 3 characters").optional(),
  is_active: z.boolean().default(true)
});

export const updateSupplierSchema = createSupplierSchema.partial();

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
