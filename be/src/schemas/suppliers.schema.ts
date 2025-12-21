import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const suppliers = pgTable('suppliers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  contact_person: text('contact_person'),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  tax_number: text('tax_number'),
  payment_terms: integer('payment_terms'),
  currency: text('currency'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export type Supplier = typeof suppliers.$inferSelect;
export type NewSupplier = typeof suppliers.$inferInsert;
