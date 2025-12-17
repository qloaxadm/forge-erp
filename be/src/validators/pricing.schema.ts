import { z } from "zod";

export const createPriceListItemSchema = z.object({
  product_id: z.number().int(),
  rate: z.number().positive()
});
