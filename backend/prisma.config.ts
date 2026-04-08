import path from "node:path";
import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    // Fallback allows `prisma generate` to succeed at Docker build time
    // (no connection is made during generate — only at runtime)
    url: process.env.DATABASE_URL ?? "postgresql://build:build@localhost:5432/build",
  },
  migrate: {
    adapter: () => {
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      return new PrismaPg(pool);
    },
  },
});
