import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { createProductSchema, updateProductSchema } from "../validators/products.schema";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const parsed = createProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: parsed.error.issues
      });
    }

    const product = await ProductService.createProduct(parsed.data);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const product = await ProductService.getProduct(id);
    res.json(product);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const listProducts = async (_req: Request, res: Response) => {
  try {
    const products = await ProductService.listProducts();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const parsed = updateProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: parsed.error.issues
      });
    }

    const updatedProduct = await ProductService.updateProduct(id, parsed.data);
    res.json(updatedProduct);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    await ProductService.deleteProduct(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getProductByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const product = await ProductService.getProductByCode(code);
    res.json(product);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
