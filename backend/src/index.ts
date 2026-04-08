import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/error.middleware";

import authRoutes from "./modules/auth/auth.routes";
import fireAdminRoutes from "./modules/fire-admin/fire-admin.routes";
import nocRoutes from "./modules/noc/noc.routes";
import fireInspectionRoutes from "./modules/fire-inspection/fire-inspection.routes";
import renewalRoutes from "./modules/renewal/renewal.routes";
import equipmentRoutes from "./modules/equipment/equipment.routes";
import vehicleGpsRoutes from "./modules/vehicle-gps/vehicle-gps.routes";
import incidentRoutes from "./modules/incident/incident.routes";
import trainingRoutes from "./modules/training/training.routes";
import mockDrillRoutes from "./modules/mock-drill/mock-drill.routes";
import auditRoutes from "./modules/audit/audit.routes";
import intelligenceRoutes from "./modules/intelligence/intelligence.router";

const app = express();

app.use(helmet());

// origin:true mirrors the request Origin back — allows any origin while
// still supporting credentials (unlike '*' which breaks credentials)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Serve frontend build (production) — copied into dist/public during build
const frontendDist = path.join(__dirname, "public");
app.use(express.static(frontendDist));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/fire-admin", fireAdminRoutes);
app.use("/api/noc", nocRoutes);
app.use("/api/fire-inspection", fireInspectionRoutes);
app.use("/api/renewal", renewalRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/vehicle-gps", vehicleGpsRoutes);
app.use("/api/incident", incidentRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/mock-drill", mockDrillRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/intelligence", intelligenceRoutes);

const healthPayload = {
  status: "ok",
  version: "1.1.0",
  service: "Firedrive Backend",
};
app.get("/health", (_req, res) => {
  res.json(healthPayload);
});
app.get("/api/health", (_req, res) => {
  res.json(healthPayload);
});

app.use(errorHandler);

// SPA fallback — must be after all API routes
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Bind all interfaces — required for Docker / Railway healthchecks
app.listen(env.port, "0.0.0.0", () => {
  logger.info(`🔥 Firedrive backend running on port ${env.port}`);
  logger.info(`   Environment: ${env.nodeEnv}`);
  logger.info(`   Frontend URL: ${env.frontendUrl}`);
});

export default app;
