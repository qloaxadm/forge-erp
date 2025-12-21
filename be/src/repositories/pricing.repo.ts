// src/repositories/pricing.repo.ts
import { db } from "../config/db";
import { priceLists } from "../db/schema/price-lists";
import { eq } from "drizzle-orm";

export const PricingRepo = {
  async createPriceList(data: {
    name: string;
    description?: string;
    currency: string;
    is_active: boolean;
    customer_type_id: number;
    effective_from: Date;
  }) {
    try {
      const [priceList] = await db
        .insert(priceLists)
        .values({
          name: data.name,
          description: data.description || null,
          currency: data.currency,
          is_active: data.is_active,
          customer_type_id: data.customer_type_id,
          effective_from: data.effective_from,
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning();

      return priceList;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to create price list');
    }
  },

  async getPriceLists() {
    try {
      return await db
        .select()
        .from(priceLists)
        .orderBy(priceLists.id);
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch price lists');
    }
  },

  async getPriceListById(id: number) {
    try {
      const [priceList] = await db
        .select()
        .from(priceLists)
        .where(eq(priceLists.id, id))
        .limit(1);
      return priceList || null;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch price list');
    }
  },

  async updatePriceList(
    id: number,
    data: {
      name?: string;
      description?: string;
      currency?: string;
      is_active?: boolean;
      customer_type_id?: number;
      effective_from?: Date;
    }
  ) {
    try {
      const [priceList] = await db
        .update(priceLists)
        .set({
          ...(data.name !== undefined && { name: data.name }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.currency !== undefined && { currency: data.currency }),
          ...(data.is_active !== undefined && { is_active: data.is_active }),
          ...(data.customer_type_id !== undefined && { customer_type_id: data.customer_type_id }),
          ...(data.effective_from !== undefined && { effective_from: data.effective_from }),
          updated_at: new Date()
        })
        .where(eq(priceLists.id, id))
        .returning();

      return priceList || null;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to update price list');
    }
  },

  async deletePriceList(id: number) {
    try {
      const [priceList] = await db
        .delete(priceLists)
        .where(eq(priceLists.id, id))
        .returning();
      return priceList || null;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to delete price list');
    }
  }
};