import { Request, Response } from "express";
import { PricingService } from "../services/pricing.service";
import { createPriceListItemSchema } from "../validators/pricing.schema";

export const addPriceListItem = async (req: Request, res: Response) => {
  const parsed = createPriceListItemSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }

  const item = await PricingService.addPriceListItem({
    price_list_id: Number(req.params.id),
    ...parsed.data
  });

  res.json(item[0]);
};
