import express from "express";
import cors from "cors";
import { db } from "./config/db";
import masterRoutes from "./routes/master.routes";
import pricingRoutes from "./routes/pricing.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

// Enable CORS with specific options if needed
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

app.use("/api", masterRoutes);
app.use("/api", pricingRoutes);

app.use(errorMiddleware);
/**
 * Health check (no DB)
 */
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

/**
 * DB connectivity check
 */
app.get("/test-db", async (_req, res) => {
  try {
    const result = await db.query("SELECT NOW() as now");
    res.json({
      status: "Database connection successful",
      timestamp: result.rows[0].now
    });
  } catch (error) {
    console.error("Database connection error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    res.status(500).json({
      status: "Database connection failed",
      error: errorMessage
    });
  }
});

export default app;
