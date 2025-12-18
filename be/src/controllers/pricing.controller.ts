// pricing.controller.ts
import { Request, Response } from "express";
import { db } from "../config/db";

// GET /api/pricing/price-lists
// src/controllers/pricing.controller.ts
// GET /api/pricing/price-lists
export const getPriceLists = async (req: Request, res: Response) => {
  try {
    // Get query parameters for filtering
    const { name, currency, is_active, customer_type_id } = req.query;

    let query = 'SELECT * FROM price_lists WHERE 1=1';
    const queryParams = [];
    let paramIndex = 1;

    if (name) {
      query += ` AND name ILIKE $${paramIndex++}`;
      queryParams.push(`%${name}%`);
    }
    if (currency) {
      query += ` AND currency = $${paramIndex++}`;
      queryParams.push(currency);
    }
    if (is_active !== undefined) {
      query += ` AND is_active = $${paramIndex++}`;
      queryParams.push(is_active === 'true');
    }
    if (customer_type_id) {
      query += ` AND customer_type_id = $${paramIndex++}`;
      queryParams.push(parseInt(customer_type_id as string));
    }

    const result = await db.query(query, queryParams);
    
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Error fetching price lists:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch price lists",
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
};

// Add to pricing.controller.ts
export const addPriceListItem = async (req: Request, res: Response) => {
  try {
    const { price_list_id, product_id, price, min_quantity = 1, is_active = true } = req.body;
    const { id } = req.params; // This gets the price list ID from the URL parameter

    if (!price_list_id || !product_id || price === undefined) {
      return res.status(400).json({
        success: false,
        error: "price_list_id, product_id, and price are required"
      });
    }

    const result = await db.query(
      `INSERT INTO price_list_items 
       (price_list_id, product_id, price, min_quantity, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [price_list_id, product_id, price, min_quantity, is_active]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Error adding price list item:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ 
      success: false,
      error: "Failed to add item to price list",
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
};

// In pricing.controller.ts
// In pricing.controller.ts
export const createPriceList = async (req: Request, res: Response) => {
  try {
    console.log('Request body:', req.body);
    
    const { 
      name,
      is_active = true,  // Default to true if not provided
      customer_type_id = null  // Default to null if not provided
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Name is required"
      });
    }

    const result = await db.query(
      `INSERT INTO price_lists 
       (name, is_active, customer_type_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, is_active, customer_type_id]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Error creating price list:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ 
      success: false,
      error: "Failed to create price list",
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
};