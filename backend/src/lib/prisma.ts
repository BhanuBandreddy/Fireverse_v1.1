import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool, type PoolConfig } from "pg";

function poolConfig(): PoolConfig {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required.");
  }
  const config: PoolConfig = { connectionString };
  // Set DATABASE_SSL=true in Railway if Postgres requires TLS (public proxy / some regions)
  if (process.env.DATABASE_SSL === "true") {
    config.ssl = { rejectUnauthorized: false };
  }
  return config;
}

const pool = new Pool(poolConfig());
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
