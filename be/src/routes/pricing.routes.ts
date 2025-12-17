import { Router } from "express";
import { createPriceList, addPriceListItem, getPriceLists } from "../controllers/pricing.controller";

const router = Router();

// GET /api/pricing/price-lists
// Check if these endpoints exist in your pricing.routes.ts
router.get("/price-lists", getPriceLists);
router.post("/lists", createPriceList);
router.post("/lists/:id/items", addPriceListItem);

export default router;