import { pgTable } from "drizzle-orm/pg-core";
import * as authSchema from "../validators/auth.schema";
import * as customerSchema from "../validators/customer.schema";
import * as grnSchema from "../validators/grn.schema";
import * as materialSchema from "../validators/materials.schema";
import * as productSchema from "../validators/products.schema";
import * as supplierSchema from "../validators/suppliers.schema";

// Combine all table schemas
export const allSchemas = {
  ...authSchema,
  ...customerSchema,
  ...grnSchema,
  ...materialSchema,
  ...productSchema,
  ...supplierSchema,
};

// Type for the database schema
export type DatabaseSchema = typeof allSchemas;

// Type for the Drizzle database instance
export type Database = ReturnType<typeof createDb>;

// Create the database instance with proper typing
export function createDb() {
  return {
    // Add any database methods you want to expose
  };
}
