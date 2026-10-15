import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";

export function getDb(url = process.env.DATABASE_URL) {
  if (!url) throw new Error("DATABASE_URL no configurada (copiar .env.example a .env)");
  const sql = neon(url);
  return drizzle(sql, { schema });
}

export * from "./schema.js";
