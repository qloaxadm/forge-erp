import { Request, Response } from "express";
import { SupplierService } from "../services/supplier.service";
import { createSupplierSchema, updateSupplierSchema } from "../validators/suppliers.schema";

export const createSupplier = async (req: Request, res: Response) => {
  try {
    const parsed = createSupplierSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: parsed.error.issues
      });
    }

    const supplier = await SupplierService.createSupplier(parsed.data);
    res.status(201).json(supplier);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getSupplier = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid supplier ID' });
    }

    const supplier = await SupplierService.getSupplier(id);
    res.json(supplier);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const listSuppliers = async (_req: Request, res: Response) => {
  try {
    const suppliers = await SupplierService.listSuppliers();
    res.json(suppliers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid supplier ID' });
    }

    const parsed = updateSupplierSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: parsed.error.issues
      });
    }

    const updatedSupplier = await SupplierService.updateSupplier(id, parsed.data);
    res.json(updatedSupplier);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid supplier ID' });
    }

    await SupplierService.deleteSupplier(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getSupplierByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const supplier = await SupplierService.getSupplierByCode(code);
    res.json(supplier);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};