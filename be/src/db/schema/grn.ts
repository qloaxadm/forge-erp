import {
  pgTable,
  serial,
  integer,
  varchar,
  numeric,
  date,
  timestamp
} from "drizzle-orm/pg-core";

export const grn = pgTable("grn", {
  id: serial("id").primaryKey(),

  supplier_id: integer("supplier_id").notNull(),

  supplier_invoice_no: varchar("supplier_invoice_no", { length: 100 }),
  supplier_invoice_date: date("supplier_invoice_date"),

  transport_cost: numeric("transport_cost", { precision: 12, scale: 2 }).default("0"),
  loading_cost: numeric("loading_cost", { precision: 12, scale: 2 }).default("0"),
  misc_cost: numeric("misc_cost", { precision: 12, scale: 2 }).default("0"),

  total_material_cost: numeric("total_material_cost", { precision: 14, scale: 2 }),
  total_cost: numeric("total_cost", { precision: 14, scale: 2 }),

  status: varchar("status", { length: 20 }).default("CREATED"),

  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});
