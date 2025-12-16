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

// Simple test endpoint to demonstrate database connectivity
app.get('/test-data', async (req, res) => {
  try {
    // Create test table if it doesn't exist
    await db.query(`
      CREATE TABLE IF NOT EXISTS test_connection (
        id SERIAL PRIMARY KEY,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )`);

    // Insert a test message if the table is empty
    const { rowCount } = await db.query('SELECT 1 FROM test_connection LIMIT 1');
    if (rowCount === 0) {
      await db.query(
        'INSERT INTO test_connection (message) VALUES ($1), ($2), ($3)',
        ['First test message', 'Hello from Aiven!', 'Database connection works!']
      );
    }

    // Query the test data
    const result = await db.query('SELECT * FROM test_connection ORDER BY created_at DESC');
    
    res.json({
      status: 'success',
      message: 'Database connection is working!',
      data: result.rows
    });
  } catch (error) {
    console.error('Test data error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch test data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default app;
