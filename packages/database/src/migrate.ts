// Stub Fase 1: `drizzle-kit generate` crea ./drizzle/*.sql, este script los aplica.
// Requiere DATABASE_URL_UNPOOLED (o DATABASE_URL) en .env. No imprime la URL.
import { readFileSync, readdirSync } from "node:fs";

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  console.error("Falta DATABASE_URL_UNPOOLED/DATABASE_URL en .env (ver .env.example)");
  process.exit(2);
}
const { neon } = await import("@neondatabase/serverless");
const sql = neon(url);
let files: string[] = [];
try {
  files = readdirSync(new URL("./drizzle", import.meta.url)).filter((f: string) => f.endsWith(".sql")).sort();
} catch {
  console.log("Sin migraciones generadas aún: ejecuta `pnpm db:generate` primero.");
  process.exit(0);
}
for (const f of files) {
  const content = readFileSync(new URL(`./drizzle/${f}`, import.meta.url), "utf8");
  // Separación simple por statement; suficiente para MVP (drizzle genera DDL simple).
  for (const stmt of content.split("--> statement-breakpoint")) {
    const s = stmt.trim();
    if (s) await sql.query(s);
  }
  console.log(`aplicada ${f}`);
}
