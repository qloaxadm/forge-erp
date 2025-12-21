// src/routes/pricing.routes.ts
import { Router } from 'express';
import { getPriceLists, createPriceList } from '../controllers/pricing.controller';

const router = Router();

// GET /api/pricing - Get all price lists
router.get('/', getPriceLists);

// POST /api/pricing - Create a new price list
router.post('/', createPriceList);

export default router;