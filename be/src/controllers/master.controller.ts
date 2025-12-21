import { Request, Response } from "express";
import { MaterialService } from "../services/material.service";
import { createMaterialSchema, updateMaterialSchema } from "../validators/materials.schema";

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
    res.status(201).json(result);
  } catch (error: any) {
    console.error('Error creating material:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
};

export const getMaterials = async (_req: Request, res: Response) => {
  try {
    const materials = await MaterialService.listMaterials();
    res.json(materials);
  } catch (error: any) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch materials' 
    });
  }
};

export const getMaterialById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid material ID' });
    }

    const material = await MaterialService.getMaterial(id);
    if (!material) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    res.json(material);
  } catch (error: any) {
    console.error('Error fetching material:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch material' 
    });
  }
};

export const updateMaterial = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid material ID' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Request body is empty' });
    }

    const parsed = updateMaterialSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: parsed.error.issues
      });
    }

    const updatedMaterial = await MaterialService.updateMaterial(id, parsed.data);
    if (!updatedMaterial) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    res.json(updatedMaterial);
  } catch (error: any) {
    console.error('Error updating material:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to update material' 
    });
  }
};

export const deleteMaterial = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid material ID' });
    }

    const deleted = await MaterialService.deleteMaterial(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting material:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to delete material' 
    });
  }
};


