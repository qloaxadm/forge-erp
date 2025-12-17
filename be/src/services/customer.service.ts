import { CustomerRepo } from "../repositories/customer.repo";
import { CreateCustomerInput, UpdateCustomerInput } from "../validators/customers.schema";

export const CustomerService = {
  async createCustomer(data: CreateCustomerInput) {
    // Check if customer with same code already exists
    const existingCustomer = await CustomerRepo.findByCode(data.code);
    if (existingCustomer) {
      throw new Error('Customer with this code already exists');
    }

    return CustomerRepo.create(data);
  },

  async getCustomer(id: number) {
    const customer = await CustomerRepo.findById(id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer;
  },

  async listCustomers() {
    return CustomerRepo.findAll();
  },

  async updateCustomer(id: number, data: UpdateCustomerInput) {
    // Check if customer exists
    const customer = await CustomerRepo.findById(id);
    if (!customer) {
      throw new Error('Customer not found');
    }

    // If code is being updated, check for duplicates
    if (data.code && data.code !== customer.code) {
      const existingCustomer = await CustomerRepo.findByCode(data.code);
      if (existingCustomer) {
        throw new Error('Another customer with this code already exists');
      }
    }

    return CustomerRepo.update(id, data);
  },

  async deleteCustomer(id: number) {
    // Check if customer exists
    const customer = await CustomerRepo.findById(id);
    if (!customer) {
      throw new Error('Customer not found');
    }

    // TODO: Add checks for existing references (e.g., in sales orders, invoices, etc.)
    
    return CustomerRepo.delete(id);
  },

  async getCustomerByCode(code: string) {
    const customer = await CustomerRepo.findByCode(code);
    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer;
  },
};