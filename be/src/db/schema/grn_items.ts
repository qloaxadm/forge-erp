import {
  pgTable,
  serial,
  integer,
  numeric,
  timestamp
} from "drizzle-orm/pg-core";

export const grn_items = pgTable("grn_items", {
  id: serial("id").primaryKey(),

  grn_id: integer("grn_id").notNull(),
  material_id: integer("material_id").notNull(),

  quantity: numeric("quantity", { precision: 12, scale: 2 }).notNull(),
  unit_rate: numeric("unit_rate", { precision: 12, scale: 2 }).notNull(),

  line_cost: numeric("line_cost", { precision: 14, scale: 2 }).notNull(),

  created_at: timestamp("created_at").defaultNow()
});
