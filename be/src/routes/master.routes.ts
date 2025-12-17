import { Router } from "express";
import { createMaterial, getMaterials } from "../controllers/master.controller";

const router = Router();

/* GET */
router.get("/materials", getMaterials);

/* POST */
router.post("/materials", createMaterial);

export default router;
