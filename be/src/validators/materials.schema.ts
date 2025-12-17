import { z } from "zod";

export const createMaterialSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  category_id: z.number().int(),
  uom_id: z.number().int(),
  min_stock: z.number().optional()
});
