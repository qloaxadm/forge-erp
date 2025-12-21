import { db } from "../config/db";
import { CreateSupplierInput, UpdateSupplierInput } from "../validators/suppliers.schema";
import { suppliers } from "../schemas/suppliers.schema";
import { eq, asc } from "drizzle-orm";
export const SupplierRepo = {
  async create(data: CreateSupplierInput) {
    const [supplier] = await db
      .insert(suppliers)
      .values({
        name: data.name,
        code: data.code,
        contact_person: data.contact_person || null,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        tax_number: data.tax_number || null,
        payment_terms: data.payment_terms || null,
        currency: data.currency || 'USD',
        is_active: data.is_active !== undefined ? data.is_active : true,
      })
      .returning();
    
    return supplier;
  },

  async findById(id: number) {
    const [supplier] = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.id, id));
    return supplier;
  },

  async findAll() {
    const result = await db
      .select()
      .from(suppliers)
      .orderBy(asc(suppliers.name));
    return result;
  },

  async update(id: number, data: UpdateSupplierInput) {
    const [supplier] = await db
      .update(suppliers)
      .set({
        ...data,
        updated_at: new Date()
      })
      .where(eq(suppliers.id, id))
      .returning();
    
    return supplier;
  },

  async delete(id: number) {
    const [deleted] = await db
      .delete(suppliers)
      .where(eq(suppliers.id, id))
      .returning({ id: suppliers.id });
    
    return deleted !== undefined;
  },

  async findByCode(code: string) {
    const [supplier] = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.code, code));
    return supplier;
  },
};