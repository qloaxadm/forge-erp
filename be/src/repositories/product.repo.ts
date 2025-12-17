import { db } from "../config/db";
import { CreateProductInput, UpdateProductInput } from "../validators/products.schema";

export const ProductRepo = {
  async create(data: CreateProductInput) {
    const { rows } = await db.query(
      `INSERT INTO products (
        name, code, description, category_id, uom_id, 
        is_active, type, sales_price, purchase_price, tax_id, barcode
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        data.name,
        data.code,
        data.description || null,
        data.category_id,
        data.uom_id,
        data.is_active,
        data.type,
        data.sales_price || null,
        data.purchase_price || null,
        data.tax_id || null,
        data.barcode || null
      ]
    );
    return rows[0];
  },

  async findById(id: number) {
    const { rows } = await db.query(
      `SELECT * FROM products WHERE id = $1`,
      [id]
    );
    return rows[0];
  },

  async findAll() {
    const { rows } = await db.query(
      `SELECT * FROM products ORDER BY name`
    );
    return rows;
  },

  async update(id: number, data: UpdateProductInput) {
    const updates: string[] = [];
    const values: any[] = [id];
    let paramCount = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = $${++paramCount}`);
        values.push(value);
      }
    });

    if (updates.length === 0) {
      return this.findById(id);
    }

    const { rows } = await db.query(
      `UPDATE products SET ${updates.join(', ')} 
       WHERE id = $1 
       RETURNING *`,
      values
    );

    return rows[0];
  },

  async delete(id: number) {
    const result = await db.query<{ id: number }>(
      `DELETE FROM products WHERE id = $1`,
      [id]
    );
    return result.rowCount ? result.rowCount > 0 : false;
  },

  async findByCode(code: string) {
    const { rows } = await db.query(
      `SELECT * FROM products WHERE code = $1`,
      [code]
    );
    return rows[0];
  },
};