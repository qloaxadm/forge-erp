import express from "express";
import cors from "cors";
import "./config/db"; // 🔥 THIS LINE IS MANDATORY
import { db } from "./config/db";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  res.json({ status: "ok" });
});

// Test database connection
app.get("/test-db", async (_req, res) => {
  try {
    const result = await db.query('SELECT NOW() as now');
    res.json({ 
      status: "Database connection successful",
      timestamp: result.rows[0].now
    });
  } catch (error) {
    console.error('Database connection error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ 
      status: "Database connection failed",
      error: errorMessage
    });
  }
});

// Test SQL Query Endpoint
app.get("/test-query", async (req, res) => {
  const { query } = req.query;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ 
      status: "error",
      message: "Query parameter 'query' is required and must be a string"
    });
  }

  try {
    console.log('Executing query:', query);
    const result = await db.query(query);
    
    res.json({
      status: "success",
      rowCount: result.rowCount,
      rows: result.rows
    });
  } catch (error) {
    console.error('Query execution error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ 
      status: "error",
      message: "Query execution failed",
      error: errorMessage
    });
  }
});

export default app;
