import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  timestamp
} from "drizzle-orm/pg-core";

export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),

  name: varchar("name", { length: 150 }).notNull(),
  code: varchar("code", { length: 50 }).notNull(),

  category_id: integer("category_id"),
  uom_id: integer("uom_id"),
  min_stock: integer("min_stock").default(0),
  
  is_active: boolean("is_active").default(true),

  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});
