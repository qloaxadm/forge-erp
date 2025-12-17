import app from "./app";
import { env } from "./config/env";

const PORT = env.port || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/**
 * Graceful shutdown
 */
const shutdown = () => {
  console.log("🛑 Shutdown signal received. Closing server...");
  server.close(() => {
    console.log("✅ HTTP server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

