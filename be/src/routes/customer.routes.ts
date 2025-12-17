import { Router } from "express";
import { 
  createCustomer, 
  getCustomer, 
  listCustomers, 
  updateCustomer, 
  deleteCustomer,
  getCustomerByCode
} from "../controllers/customer.controller";

const router = Router();

// Create a new customer
router.post("/", createCustomer);

// Get all customers
router.get("/", listCustomers);

// Get a single customer by ID
router.get("/:id", getCustomer);

// Get a single customer by code
router.get("/code/:code", getCustomerByCode);

// Update a customer
router.put("/:id", updateCustomer);

// Delete a customer
router.delete("/:id", deleteCustomer);

export default router;