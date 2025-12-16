import app from "./app";
import { env } from "./config/env";

const server = app.listen(env.port, () => {
  console.log(`🚀 Server running on port ${env.port}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down...");
  server.close(() => process.exit(0));
});
