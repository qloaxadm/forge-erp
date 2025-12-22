import { Router } from 'express';
import { db } from '../config/db';
import { sql } from 'drizzle-orm';
import * as grnController from '../controllers/grn.controller';

const router = Router();

// GRN Routes
// Current route in inventory.routes.ts
router.get('/grn', grnController.getGRNs);
router.post('/grn', grnController.createGRN);

// Get Raw Material Ledger
router.get('/inventory/rm-ledger', async (_, res) => {
  try {
    const result = await db.execute(sql`SELECT * FROM vw_rm_stock_ledger`);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching RM ledger:', error);
    res.status(500).json({ error: 'Failed to fetch RM ledger' });
  }
});

export default router;