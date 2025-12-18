import express from "express";
import cors from "cors";
import { db } from "./config/db";
import { sql } from "drizzle-orm";
import masterRoutes from "./routes/master.routes";
import pricingRoutes from "./routes/pricing.routes";
import productRoutes from "./routes/product.routes";
import supplierRoutes from "./routes/supplier.routes";
import customerRoutes from "./routes/customer.routes";
import inventoryRoutes from "./routes/inventory.routes";
import { errorMiddleware } from "./middleware/error.middleware";

// ... (other imports remain the same)

const app = express();

// CORS and body parsing middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware for development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request body:', req.body);
  }
  next();
});

// API Routes
app.use("/api", masterRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api", inventoryRoutes);

// Health check endpoints
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/test-db", async (_req, res, next) => {
  try {
    const result = await db.execute(sql`SELECT NOW() as now`);
    res.json({
      status: "Database connection successful",
      timestamp: result.rows[0].now
    });
  } catch (error) {
    next(error); // Pass errors to the error handling middleware
  }
});

// Error handling middleware - must be after all other app.use() and routes
app.use(errorMiddleware);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Not Found" });
});

export default app;