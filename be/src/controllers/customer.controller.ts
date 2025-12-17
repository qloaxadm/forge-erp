import { Request, Response } from "express";
import { CustomerService } from "../services/customer.service";
import { createCustomerSchema, updateCustomerSchema } from "../validators/customers.schema";

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const parsed = createCustomerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: parsed.error.issues
      });
    }

    const customer = await CustomerService.createCustomer(parsed.data);
    res.status(201).json(customer);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getCustomer = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid customer ID' });
    }

    const customer = await CustomerService.getCustomer(id);
    res.json(customer);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const listCustomers = async (_req: Request, res: Response) => {
  try {
    const customers = await CustomerService.listCustomers();
    res.json(customers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid customer ID' });
    }

    const parsed = updateCustomerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: parsed.error.issues
      });
    }

    const updatedCustomer = await CustomerService.updateCustomer(id, parsed.data);
    res.json(updatedCustomer);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid customer ID' });
    }

    await CustomerService.deleteCustomer(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getCustomerByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const customer = await CustomerService.getCustomerByCode(code);
    res.json(customer);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};