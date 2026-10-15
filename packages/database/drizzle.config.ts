import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    // drizzle-kit usa la no-pooled para migraciones
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? ""
  }
});
