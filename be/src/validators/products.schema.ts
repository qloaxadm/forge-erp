import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  category_id: z.number().int("Category ID must be an integer"),
  uom_id: z.number().int("Unit of Measure ID must be an integer"),
  is_active: z.boolean().default(true),
  type: z.enum(['product', 'service']).default('product'),
  sales_price: z.number().min(0, "Sales price cannot be negative").optional(),
  purchase_price: z.number().min(0, "Purchase price cannot be negative").optional(),
  tax_id: z.number().int("Tax ID must be an integer").optional(),
  barcode: z.string().optional()
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
