import { Router } from "express";
import { 
  createMaterial, 
  getMaterials, 
  getMaterialById, 
  updateMaterial, 
  deleteMaterial 
} from "../controllers/master.controller";

const router = Router();

// Material routes
router.route("/materials")
  .get(getMaterials)           // GET /api/materials
  .post(createMaterial);       // POST /api/materials

router.route("/materials/:id")
  .get(getMaterialById)        // GET /api/materials/:id
  .patch(updateMaterial)       // PATCH /api/materials/:id
  .delete(deleteMaterial);     // DELETE /api/materials/:id

export default router;
