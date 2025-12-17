import { Router } from "express";
import { 
  createProduct, 
  getProduct, 
  listProducts, 
  updateProduct, 
  deleteProduct,
  getProductByCode
} from "../controllers/product.controller";

const router = Router();

// Create a new product
router.post("/", createProduct);

// Get all products
router.get("/", listProducts);

// Get a single product by ID
router.get("/:id", getProduct);

// Get a single product by code
router.get("/code/:code", getProductByCode);

// Update a product
router.put("/:id", updateProduct);

// Delete a product
router.delete("/:id", deleteProduct);

export default router;
