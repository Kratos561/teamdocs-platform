import { NextResponse } from "next/server";

// Criterio Fase 1: leer y escribir NeonDB desde el servidor.
// Sin DATABASE_URL -> 503 explícito, no 500 ambiguo.
export async function GET() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return NextResponse.json(
      { ok: false, db: "missing DATABASE_URL (copiar .env.example a .env)" },
      { status: 503 }
    );
  }
  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(url);
    const rows = await sql`select 1 as ok`;
    return NextResponse.json({ ok: rows[0]?.ok === 1, db: "neon reachable" });
  } catch (e) {
    const msg = e instanceof Error ? e.message.slice(0, 200) : "db error";
    return NextResponse.json({ ok: false, db: msg }, { status: 503 });
  }
}
