import { Router } from "express";
import { addPriceListItem } from "../controllers/pricing.controller";

const router = Router();

router.post("/price-lists/:id/items", addPriceListItem);

export default router;
