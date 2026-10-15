// Sincroniza .env desde Neon sin exponer secretos en chats/logs.
// Uso (PowerShell, en tu terminal, NO en el agente):
//   $env:NEON_API_KEY="napi_..."; $env:NEON_ORG_ID="org-..."; $env:NEON_PROJECT_ID="young-union-02500187"
//   node scripts/sync-neon-env.mjs
// Lee .env.example como plantilla y escribe .env (gitignored) con DATABASE_URL pooled/unpooled.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const KEY = process.env.NEON_API_KEY;
const ORG = process.env.NEON_ORG_ID ?? "org-gentle-mud-24366370";
const PID = process.env.NEON_PROJECT_ID ?? "young-union-02500187";
const BID = process.env.NEON_BRANCH_ID ?? "br-spring-union-b5vmbkas";
const DB = process.env.NEON_DB ?? "neondb";
const ROLE = process.env.NEON_ROLE ?? "neondb_owner";
if (!KEY) {
  console.error("Falta NEON_API_KEY en env. Exportala solo en tu terminal local.");
  process.exit(2);
}
async function uri(pooled) {
  const u = `https://console.neon.tech/api/v2/projects/${PID}/connection_uri?org_id=${ORG}&branch_id=${BID}&database_name=${DB}&role_name=${ROLE}&pooled=${pooled}`;
  const r = await fetch(u, { headers: { Authorization: `Bearer ${KEY}`, Accept: "application/json" } });
  if (!r.ok) throw new Error(`Neon ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const j = await r.json();
  return j.uri;
}
const pooledUri = await uri(true);
const directUri = await uri(false);
let template = readFileSync(new URL("../.env.example", import.meta.url), "utf8");
const out = template
  .replace(/^DATABASE_URL=".*"/m, `DATABASE_URL="${pooledUri}"`)
  .replace(/^DATABASE_URL_UNPOOLED=".*"/m, `DATABASE_URL_UNPOOLED="${directUri}"`);
if (existsSync(new URL("../.env", import.meta.url)) && !process.argv.includes("--force")) {
  console.error(".env ya existe. Re-ejecuta con --force para sobrescribir.");
  process.exit(3);
}
writeFileSync(new URL("../.env", import.meta.url), out);
console.log("OK .env escrito desde Neon (pooled + direct). No lo commitees.");
