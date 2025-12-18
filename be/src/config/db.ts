import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../types/db.types";
import { env } from "./env";
import fs from "fs";
import path from "path";

const sslConfig = env.db.ssl
  ? {
      rejectUnauthorized: true,
      ca: fs.readFileSync(path.join(__dirname, "../../db/aiven-ca.pem")).toString(),
    }
  : false;

// Create the connection pool
const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.name,
  user: env.db.user,
  password: env.db.password,
  ssl: sslConfig,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Log connection events
pool.on("connect", () => {
  console.log("✅ PostgreSQL connected (Aiven)");
});

pool.on("error", (err: Error) => {
  console.error("❌ PostgreSQL error", err);
  process.exit(1);
});

// Graceful shutdown
const shutdown = async () => {
  console.log("Shutting down database connection...");
  await pool.end();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

// Export the Drizzle instance with proper typing
export const db = drizzle(pool, { schema });