import dotenv from "dotenv";
dotenv.config();

function parsePort(): number {
  const raw = process.env.PORT;
  if (raw === undefined || raw === "") return 3001;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 3001;
}

export const env = {
  port: parsePort(),
  nodeEnv: process.env.NODE_ENV ?? "development",
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret-firedrive-min-32-chars!!11",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? "dev-refresh-firedrive-min-32-chars!!",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  uploadDir: process.env.UPLOAD_DIR ?? "./uploads",
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB ?? "10"),
};
