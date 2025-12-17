// pricing.controller.ts
import { Request, Response } from "express";
import { db } from "../config/db";

// GET /api/pricing/price-lists
export const getPriceLists = async (req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM price_lists');
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching price lists:", error);
    res.status(500).json({ error: "Failed to fetch price lists" });
  }
};

// POST /api/pricing/lists
export const createPriceList = async (req: Request, res: Response) => {
  try {
    const { name, description, currency, isActive = true } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required for creating a price list" });
    }

    const result = await db.query(
      `INSERT INTO price_lists 
       (name, description, currency, is_active)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description, currency || 'USD', isActive]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating price list:", error);
    res.status(500).json({ error: "Failed to create price list" });
  }
};

// POST /api/pricing/lists/:id/items
export const addPriceListItem = async (req: Request, res: Response) => {
  try {
    const { priceListId } = req.params;
    const { productId, price, currency, effectiveDate } = req.body;

    if (!productId || !price) {
      return res.status(400).json({ error: "productId and price are required" });
    }

    const result = await db.query(
      `INSERT INTO price_list_items 
       (price_list_id, product_id, price, currency, effective_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [priceListId, productId, price, currency || 'USD', effectiveDate || new Date()]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding price list item:", error);
    res.status(500).json({ error: "Failed to add item to price list" });
  }
};