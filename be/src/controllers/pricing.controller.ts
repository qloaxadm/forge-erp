// pricing.controller.ts
import { Request, Response } from "express";
import { db } from "../config/db";
import { and, eq, like } from "drizzle-orm";
import { priceLists, priceListItems } from "../db/schema/price-lists";

// GET /api/pricing/price-lists
// src/controllers/pricing.controller.ts
// GET /api/pricing/price-lists
export const getPriceLists = async (req: Request, res: Response) => {
  try {
    // Get query parameters for filtering
    const { name, currency, is_active, customer_type_id } = req.query;

    // Build conditions array based on query parameters
    const conditions = [];
    
    if (name) {
      conditions.push(like(priceLists.name, `%${name}%`));
    }
    if (currency) {
      conditions.push(eq(priceLists.currency, currency as string));
    }
    if (is_active !== undefined) {
      conditions.push(eq(priceLists.is_active, is_active === 'true'));
    }
    if (customer_type_id) {
      conditions.push(eq(priceLists.customer_type_id, parseInt(customer_type_id as string)));
    }
    
    // Build and execute the query in a single chain
    const result = await db
      .select()
      .from(priceLists)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    
    res.status(200).json({
      success: true,
      data: result
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
    const { price_list_id, product_id, price, min_quantity = 1 } = req.body;
    const { id } = req.params; // This gets the price list ID from the URL parameter

    if (!price_list_id || !product_id || price === undefined) {
      return res.status(400).json({
        success: false,
        error: "price_list_id, product_id, and price are required"
      });
    }

    const [newItem] = await db
      .insert(priceListItems)
      .values({
        price_list_id,
        product_id,
        price,
        min_quantity
      })
      .returning();

    res.status(201).json({
      success: true,
      data: newItem
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

    const [newPriceList] = await db.insert(priceLists)
      .values({
        name,
        is_active,
        customer_type_id,
        currency: 'USD'  // Explicitly set currency
      })
      .returning();

    res.status(201).json({
      success: true,
      data: newPriceList
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