import { Router } from "express";
import { 
  createSupplier, 
  getSupplier, 
  listSuppliers, 
  updateSupplier, 
  deleteSupplier,
  getSupplierByCode
} from "../controllers/supplier.controller";

const router = Router();

// Create a new supplier
router.post("/", createSupplier);

// Get all suppliers
router.get("/", listSuppliers);

// Get a single supplier by ID
router.get("/:id", getSupplier);

// Get a single supplier by code
router.get("/code/:code", getSupplierByCode);

// Update a supplier
router.put("/:id", updateSupplier);

// Delete a supplier
router.delete("/:id", deleteSupplier);

export default router;