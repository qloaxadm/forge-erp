import { db } from "../config/db";

export const MaterialRepo = {
  async create(data: {
    name: string;
    code: string;
    category_id: number;
    uom_id: number;
    min_stock?: number;
  }) {
    const { rows } = await db.query(
      `
      INSERT INTO materials (name, code, category_id, uom_id, min_stock)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        data.name,
        data.code,
        data.category_id,
        data.uom_id,
        data.min_stock ?? 0
      ]
    );

    return rows[0];
  },

  async findAll() {
    const { rows } = await db.query(
      `SELECT * FROM materials ORDER BY id DESC`
    );
    return rows;
  }
};
