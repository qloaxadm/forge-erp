import { MaterialRepo } from "../repositories/material.repo";

export const MaterialService = {
  async createMaterial(data: any) {
    return MaterialRepo.create(data);
  },

  async listMaterials() {
    return MaterialRepo.findAll();
  }
};
