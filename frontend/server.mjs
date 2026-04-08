import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const DIST = path.join(__dirname, "dist");

console.log(`Starting Firedrive FE`);
console.log(`  PORT = ${PORT}`);
console.log(`  DIST = ${DIST}`);

const app = express();

// Healthcheck — no filesystem dependency
app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

// Static assets
app.use(express.static(DIST));

// SPA fallback
app.use((_req, res) => res.sendFile(path.join(DIST, "index.html")));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Firedrive FE listening on port ${PORT}`);
});
