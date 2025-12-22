import { db } from "../config/db";
import { sql, eq, and, desc } from "drizzle-orm";

import { grn as grnTable } from "../db/schema/grn";
import { grn_items as grnItems } from "../db/schema/grn_items";
import { material_lots as materialLots } from "../db/schema/material_lots";
import { materials } from "../db/schema/materials";


import { generateRMLotNo } from "../utils/lot.generator";

export async function getGRNs() {
  try {
    console.log('Executing GRN query...');
    const result = await db.execute(sql`
      SELECT 
        g.*,
        s.name as supplier_name,
        COALESCE(
          json_agg(
            json_build_object(
              'id', gi.id,
              'grn_id', gi.grn_id,
              'material_id', gi.material_id,
              'material_name', m.name,
              'material_code', m.code,
              'uom_id', m.uom_id,
              'quantity', gi.quantity,
              'rate', gi.unit_rate,
              'line_cost', (gi.quantity * gi.unit_rate)::numeric,
              'created_at', gi.created_at
            )
            ORDER BY gi.id
          ) FILTER (WHERE gi.id IS NOT NULL),
          '[]'::json
        ) as items
      FROM grn g
      LEFT JOIN public.suppliers s ON g.supplier_id = s.id
      LEFT JOIN public.grn_items gi ON g.id = gi.grn_id
      LEFT JOIN public.materials m ON gi.material_id = m.id
      GROUP BY g.id, s.id
      ORDER BY g.created_at DESC
    `);
    
    console.log('GRN query executed successfully');
    return result.rows;
  } catch (error) {
    console.error('Error in getGRNs service:', error);
    throw error; // Re-throw to be handled by the controller
  }
}

export async function createGRN(payload: any) {
  return db.transaction(async (tx) => {
    // Calculate total material cost from items
    const totalMaterialCost = payload.items.reduce((sum: number, item: any) => {
      return sum + (Number(item.quantity) * Number(item.unit_rate));
    }, 0);

    // Calculate total cost including additional costs
    const totalCost = totalMaterialCost + 
      Number(payload.transport_cost || 0) + 
      Number(payload.loading_cost || 0) + 
      Number(payload.misc_cost || 0);

    // 1️⃣ Create GRN header
  // 1️⃣ Create GRN header
const [grn] = await tx.insert(grnTable).values({
  supplier_id: payload.supplier_id,
  supplier_invoice_no: payload.supplier_invoice_no,
  supplier_invoice_date: payload.supplier_invoice_date ? 
    new Date(payload.supplier_invoice_date).toISOString().split('T')[0] : 
    null,
  transport_cost: payload.transport_cost || 0,
  loading_cost: payload.loading_cost || 0,
  misc_cost: payload.misc_cost || 0,
  total_material_cost: totalMaterialCost,
  total_cost: totalCost,
  status: "CREATED"
}).returning();

    // 2️⃣ Insert GRN items
    for (const item of payload.items) {
      const quantity = Number(item.quantity);
      const unitRate = Number(item.unit_rate);
      const lineCost = quantity * unitRate;

      await tx.insert(grnItems).values({
        grn_id: grn.id,
        material_id: item.material_id,
        quantity: quantity.toFixed(2),
        unit_rate: unitRate.toFixed(2),
        line_cost: lineCost.toFixed(2)
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
