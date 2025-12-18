import {
  pgTable,
  serial,
  integer,
  varchar,
  numeric,
  date,
  timestamp
} from "drizzle-orm/pg-core";

export const material_lots = pgTable("material_lots", {
  id: serial("id").primaryKey(),

  material_id: integer("material_id").notNull(),
  grn_id: integer("grn_id"),
  grn_item_id: integer("grn_item_id"),

  lot_no: varchar("lot_no", { length: 100 }).notNull(),

  batch_no: varchar("batch_no", { length: 100 }),
  expiry_date: date("expiry_date"),

  qty_received: numeric("qty_received", { precision: 12, scale: 2 }).notNull(),
  qty_available: numeric("qty_available", { precision: 12, scale: 2 }).notNull(),

  unit_cost: numeric("unit_cost", { precision: 12, scale: 2 }).notNull(),
  landed_cost: numeric("landed_cost", { precision: 12, scale: 2 }),

  created_at: timestamp("created_at").defaultNow()
});
