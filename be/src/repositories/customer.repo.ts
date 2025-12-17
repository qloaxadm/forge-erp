import { db } from "../config/db";
import { CreateCustomerInput, UpdateCustomerInput } from "../validators/customers.schema";

export const CustomerRepo = {
  async create(data: CreateCustomerInput) {
    const { rows } = await db.query(
      `INSERT INTO customers (
        name, code, contact_person, email, phone, address, 
        tax_number, payment_terms, credit_limit, currency, 
        price_list_id, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
        data.credit_limit || 0,
        data.currency || 'USD',
        data.price_list_id || null,
        data.is_active
      ]
    );
    return rows[0];
  },

  async findById(id: number) {
    const { rows } = await db.query(
      `SELECT * FROM customers WHERE id = $1`,
      [id]
    );
    return rows[0];
  },

  async findAll() {
    const { rows } = await db.query(
      `SELECT * FROM customers ORDER BY name`
    );
    return rows;
  },

  async update(id: number, data: UpdateCustomerInput) {
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
      `UPDATE customers SET ${updates.join(', ')} 
       WHERE id = $1 
       RETURNING *`,
      values
    );

    return rows[0];
  },

// In customer.repo.ts, update the delete method:
async delete(id: number) {
  const result = await db.query<{ id: number }>(
    `DELETE FROM customers WHERE id = $1`,
    [id]
  );
  return result.rowCount ? result.rowCount > 0 : false;
},

  async findByCode(code: string) {
    const { rows } = await db.query(
      `SELECT * FROM customers WHERE code = $1`,
      [code]
    );
    return rows[0];
  },
};