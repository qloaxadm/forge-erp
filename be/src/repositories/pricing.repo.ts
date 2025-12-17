import { db } from "../config/db";

export const PricingRepo = {
  async addItem(data: {
    price_list_id: number;
    product_id: number;
    rate: number;
  }) {
    const { rows } = await db.query(
      `
      INSERT INTO price_list_items (price_list_id, product_id, rate)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [data.price_list_id, data.product_id, data.rate]
    );

    return rows[0];
  }
};
