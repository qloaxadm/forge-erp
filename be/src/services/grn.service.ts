import { db } from "../config/db";
import { sql, eq } from "drizzle-orm";

import { grn as grnTable } from "../db/schema/grn";
import { grn_items as grnItems } from "../db/schema/grn_items";
import { material_lots as materialLots } from "../db/schema/material_lots";
import { materials } from "../db/schema/materials";

import { generateRMLotNo } from "../utils/lot.generator";

export async function createGRN(payload: any) {
  return db.transaction(async (tx) => {

    // 1️⃣ Create GRN header
    const [grn] = await tx.insert(grnTable).values({
      supplier_id: payload.supplier_id,
      supplier_invoice_no: payload.supplier_invoice_no,
      supplier_invoice_date: payload.supplier_invoice_date,
      transport_cost: payload.transport_cost,
      loading_cost: payload.loading_cost,
      misc_cost: payload.misc_cost,
      status: "CREATED"
    }).returning();

    // 2️⃣ Insert GRN items
    let totalMaterialCost = 0;

    for (const item of payload.items) {
      const lineCost = item.quantity * item.unit_rate;
      totalMaterialCost += lineCost;

      await tx.insert(grnItems).values({
  grn_id: grn.id,
  material_id: item.material_id,
  quantity: item.quantity.toString(), // Convert to string
  unit_rate: item.unit_rate.toString(), // Convert to string
  line_cost: lineCost.toString() // Convert to string
});
    }

    // 3️⃣ Calculate overhead
    const overhead =
      payload.transport_cost +
      payload.loading_cost +
      payload.misc_cost;

    // 4️⃣ Create lots
    for (const item of payload.items) {

      const material = await tx
        .select()
        .from(materials)
        .where(eq(materials.id, item.material_id))
        .then(r => r[0]);

      if (!material) throw new Error("Material not found");

      const baseValue = item.quantity * item.unit_rate;
      const share = baseValue / totalMaterialCost;

      const landedUnitCost =
        item.unit_rate + (share * overhead) / item.quantity;

      const seq = await tx.execute(
        sql`SELECT COUNT(*) FROM material_lots WHERE material_id = ${item.material_id}`
      );

      const lotNo = generateRMLotNo(
        material.code,
        Number(seq.rows[0].count) + 1
      );

      await tx.insert(materialLots).values({
        material_id: item.material_id,
        grn_id: grn.id,
        lot_no: lotNo,
        batch_no: item.batch_no,
        expiry_date: item.expiry_date,
        qty_received: item.quantity,
        qty_available: item.quantity,
        unit_cost: item.unit_rate,
        landed_cost: landedUnitCost
      });
    }

    // 5️⃣ Finalize GRN
    await tx.update(grnTable)
      .set({
        total_material_cost: sql`${totalMaterialCost}`,
total_cost: sql`${totalMaterialCost + overhead}`,
        status: "POSTED"
      })
      .where(eq(grnTable.id, grn.id));

    return grn.id;
  });
}
