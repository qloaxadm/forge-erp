import { SupplierRepo } from "../repositories/supplier.repo";
import { CreateSupplierInput, UpdateSupplierInput } from "../validators/suppliers.schema";

export const SupplierService = {
  async createSupplier(data: CreateSupplierInput) {
    // Check if supplier with same code already exists
    const existingSupplier = await SupplierRepo.findByCode(data.code);
    if (existingSupplier) {
      throw new Error('Supplier with this code already exists');
    }

    return SupplierRepo.create(data);
  },

  async getSupplier(id: number) {
    const supplier = await SupplierRepo.findById(id);
    if (!supplier) {
      throw new Error('Supplier not found');
    }
    return supplier;
  },

  async listSuppliers() {
    return SupplierRepo.findAll();
  },

  async updateSupplier(id: number, data: UpdateSupplierInput) {
    // Check if supplier exists
    const supplier = await SupplierRepo.findById(id);
    if (!supplier) {
      throw new Error('Supplier not found');
    }

    // If code is being updated, check for duplicates
    if (data.code && data.code !== supplier.code) {
      const existingSupplier = await SupplierRepo.findByCode(data.code);
      if (existingSupplier) {
        throw new Error('Another supplier with this code already exists');
      }
    }

    return SupplierRepo.update(id, data);
  },

  async deleteSupplier(id: number) {
    // Check if supplier exists
    const supplier = await SupplierRepo.findById(id);
    if (!supplier) {
      throw new Error('Supplier not found');
    }

    // TODO: Add checks for existing references (e.g., in purchase orders, etc.)
    
    return SupplierRepo.delete(id);
  },

  async getSupplierByCode(code: string) {
    const supplier = await SupplierRepo.findByCode(code);
    if (!supplier) {
      throw new Error('Supplier not found');
    }
    return supplier;
  },
};