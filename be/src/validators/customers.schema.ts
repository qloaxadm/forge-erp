import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  contact_person: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  tax_number: z.string().optional(),
  payment_terms: z.number().int("Payment terms must be an integer").optional(),
  credit_limit: z.number().min(0, "Credit limit cannot be negative").optional(),
  currency: z.string().length(3, "Currency must be 3 characters").optional(),
  price_list_id: z.number().int("Price list ID must be an integer").optional(),
  is_active: z.boolean().default(true)
});

export const updateCustomerSchema = createCustomerSchema.partial();

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
