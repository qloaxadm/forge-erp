import { MaterialRepo } from "../repositories/material.repo";

export const MaterialService = {
  async createMaterial(data: any) {
    return MaterialRepo.create(data);
  },

  async listMaterials() {
    return MaterialRepo.findAll();
  },

  async getMaterial(id: number) {
    return MaterialRepo.findById(id);
  },

  async updateMaterial(id: number, data: any) {
    const material = await MaterialRepo.findById(id);
    if (!material) {
      throw new Error('Material not found');
    }
    
    // Check if code is being updated and if it's already in use
    if (data.code && data.code !== material.code) {
      const existing = await MaterialRepo.findByCode(data.code);
      if (existing) {
        throw new Error('Material with this code already exists');
      }
    }

    return MaterialRepo.update(id, data);
  },

  async deleteMaterial(id: number) {
    const material = await MaterialRepo.findById(id);
    if (!material) {
      throw new Error('Material not found');
    }

    // TODO: Add checks for any dependent records before deleting
    
    return MaterialRepo.delete(id);
  }
};
