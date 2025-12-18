import { z } from "zod";

export const grnSchema = z.object({
  supplier_id: z.number().int(),

  supplier_invoice_no: z.string().optional(),
  supplier_invoice_date: z.string().optional(),

  transport_cost: z.number().nonnegative().default(0),
  loading_cost: z.number().nonnegative().default(0),
  misc_cost: z.number().nonnegative().default(0),

  items: z.array(
    z.object({
      material_id: z.number().int(),
      quantity: z.number().positive(),
      unit_rate: z.number().positive(),
      batch_no: z.string().optional(),
      expiry_date: z.string().optional()
    })
  ).min(1)
});
