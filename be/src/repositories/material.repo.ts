import { db } from "../config/db";
import { materials } from "../db/schema/materials";
import { eq } from "drizzle-orm";

export const MaterialRepo = {
  async create(data: {
    name: string;
    code: string;
    category_id: number;
    uom_id: number;
    min_stock?: number;
  }) {
    try {
      const [material] = await db
        .insert(materials)
        .values({
          name: data.name,
          code: data.code,
          category_id: data.category_id,
          uom_id: data.uom_id,
          min_stock: data.min_stock ?? 0,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning();

      return material;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to create material');
    }
  },

  async findAll() {
    try {
      return await db
        .select()
        .from(materials)
        .orderBy(materials.id);
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch materials');
    }
  },

  async findById(id: number) {
    try {
      const [material] = await db
        .select()
        .from(materials)
        .where(eq(materials.id, id))
        .limit(1);
      return material || null;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to find material');
    }
  },

  async findByCode(code: string) {
    try {
      const [material] = await db
        .select()
        .from(materials)
        .where(eq(materials.code, code))
        .limit(1);
      return material || null;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to find material by code');
    }
  },

  async update(id: number, data: {
    name?: string;
    code?: string;
    category_id?: number;
    uom_id?: number;
    min_stock?: number;
    is_active?: boolean;
  }) {
    try {
      const [material] = await db
        .update(materials)
        .set({
          ...(data.name !== undefined && { name: data.name }),
          ...(data.code !== undefined && { code: data.code }),
          ...(data.category_id !== undefined && { category_id: data.category_id }),
          ...(data.uom_id !== undefined && { uom_id: data.uom_id }),
          ...(data.min_stock !== undefined && { min_stock: data.min_stock }),
          ...(data.is_active !== undefined && { is_active: data.is_active }),
          updated_at: new Date()
        })
        .where(eq(materials.id, id))
        .returning();

      return material || null;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to update material');
    }
  },

  async delete(id: number) {
    try {
      const [material] = await db
        .delete(materials)
        .where(eq(materials.id, id))
        .returning();
      return material || null;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to delete material');
    }
  }
};
