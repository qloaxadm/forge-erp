import { pgTable, serial, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const suppliers = pgTable('suppliers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 150 }).notNull(),
  contact_person: varchar('contact_person', { length: 100 }),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 100 }),
  gst_number: varchar('gst_number', { length: 20 }),
  address: text('address'),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export type Supplier = typeof suppliers.$inferSelect;
export type NewSupplier = typeof suppliers.$inferInsert;
