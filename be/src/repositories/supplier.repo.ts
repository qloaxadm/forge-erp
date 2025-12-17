import { db } from "../config/db";
import { CreateSupplierInput, UpdateSupplierInput } from "../validators/suppliers.schema";

export const SupplierRepo = {
  async create(data: CreateSupplierInput) {
    const { rows } = await db.query(
      `INSERT INTO suppliers (
        name, code, contact_person, email, phone, 
        address, tax_number, payment_terms, currency, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        data.name,
        data.code,
        data.contact_person || null,
        data.email || null,
        data.phone || null,
        data.address || null,
        data.tax_number || null,
        data.payment_terms || null,
        data.currency || 'USD',
        data.is_active
      ]
    );
    return rows[0];
  },

  async findById(id: number) {
    const { rows } = await db.query(
      `SELECT * FROM suppliers WHERE id = $1`,
      [id]
    );
    return rows[0];
  },

  async findAll() {
    const { rows } = await db.query(
      `SELECT * FROM suppliers ORDER BY name`
    );
    return rows;
  },

  async update(id: number, data: UpdateSupplierInput) {
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
      `UPDATE suppliers SET ${updates.join(', ')} 
       WHERE id = $1 
       RETURNING *`,
      values
    );

    return rows[0];
  },

// In supplier.repo.ts, update the delete method:
async delete(id: number) {
  const result = await db.query<{ id: number }>(
    `DELETE FROM suppliers WHERE id = $1`,
    [id]
  );
  return result.rowCount ? result.rowCount > 0 : false;
},

  async findByCode(code: string) {
    const { rows } = await db.query(
      `SELECT * FROM suppliers WHERE code = $1`,
      [code]
    );
    return rows[0];
  },
};