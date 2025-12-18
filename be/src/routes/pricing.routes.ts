// src/routes/pricing.routes.ts
import { Router } from "express";
import { 
  createPriceList, 
  addPriceListItem, 
  getPriceLists 
} from "../controllers/pricing.controller";

const router = Router();

// GET /api/pricing/price-lists - Get all price lists (with optional query params)
router.get("/price-lists", getPriceLists);

// POST /api/pricing/price-lists - Create a new price list
router.post("/price-lists", createPriceList);

// POST /api/pricing/lists/:id/items - Add item to price list
router.post("/lists/:id/items", addPriceListItem);

export default router;