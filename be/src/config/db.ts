import { Pool } from "pg";
import { env } from "./env";
import fs from "fs";
import path from "path";

const sslConfig = env.db.ssl
  ? {
      rejectUnauthorized: true,
      ca: fs.readFileSync(path.join(__dirname, "../../db/aiven-ca.pem")).toString(),
    }
  : false;

export const db = new Pool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.name,
  user: env.db.user,
  password: env.db.password,
  ssl: sslConfig,
  max: 20, // Connection pool size
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

db.on("connect", () => {
  console.log("✅ PostgreSQL connected (Aiven)");
});

db.on("error", (err) => {
  console.error("❌ PostgreSQL error", err);
  process.exit(1);
});

process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received. Closing DB pool...");
  await db.end();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received. Closing DB pool...");
  await db.end();
  process.exit(0);
});

