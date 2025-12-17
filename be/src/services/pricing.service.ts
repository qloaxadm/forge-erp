import { PricingRepo } from "../repositories/pricing.repo";

export const PricingService = {
  addPriceListItem(data: any) {
    return PricingRepo.addItem(data);
  }
};
