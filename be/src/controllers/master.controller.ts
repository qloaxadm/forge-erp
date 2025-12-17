import { Request, Response } from "express";
import { MaterialService } from "../services/material.service";
import { createMaterialSchema } from "../validators/materials.schema";

export const createMaterial = async (req: Request, res: Response) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Request body is empty' });
    }

    const parsed = createMaterialSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: parsed.error.issues
      });
    }

    const result = await MaterialService.createMaterial(parsed.data);
    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Error creating material:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export const getMaterials = async (_req: Request, res: Response) => {
  const materials = await MaterialService.listMaterials();
  res.json(materials);
};


