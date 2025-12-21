// src/db/schema/price-lists.ts
import { pgTable, serial, varchar, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { date } from "drizzle-orm/mysql-core";


export const priceLists = pgTable("price_lists", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  currency: varchar("currency", { length: 3 }).notNull().default('USD'),
  is_active: boolean("is_active").default(true),
  customer_type_id: integer("customer_type_id").references(() => customerTypes.id),
  effective_from: timestamp("effective_from", { withTimezone: true }).defaultNow(),
  effective_to: timestamp("effective_to", { withTimezone: true }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow()
});
export const priceListRelations = relations(priceLists, ({ many }) => ({
  priceListItems: many(priceListItems)
}));

// If customer types table doesn't exist, you'll need to create that too
export const customerTypes = pgTable("customer_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  description: text("description")
});

// Price list items schema
export const priceListItems = pgTable("price_list_items", {
  id: serial("id").primaryKey(),
  price_list_id: integer("price_list_id").references(() => priceLists.id, { onDelete: "cascade" }).notNull(),
  product_id: integer("product_id").references(() => products.id).notNull(),
  price: integer("price").notNull(),
  min_quantity: integer("min_quantity").default(1),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

export const priceListItemRelations = relations(priceListItems, ({ one }) => ({
  priceList: one(priceLists, {
    fields: [priceListItems.price_list_id],
    references: [priceLists.id]
  }),
  product: one(products, {
    fields: [priceListItems.product_id],
    references: [products.id]
  })
}));

// If products table doesn't exist, you'll need to create that too
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  sku: varchar("sku", { length: 50 }).unique(),
  description: text("description"),
  base_price: integer("base_price").notNull(),
  is_active: boolean("is_active").default(true)
});