import CollabEditor from "../components/CollabEditor";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-6">
        <p className="font-mono text-xs text-zinc-500">TeamDocs · MVP · modo Operate</p>
        <h1 className="text-4xl md:text-6xl tracking-tighter leading-none text-zinc-950">
          Documentos en equipo, en tiempo real
        </h1>
        <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-zinc-600">
          Crea, comparte y co-edita. Abajo la prueba vertical: dos pestañas, misma sala, WS y guardado visibles.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <CollabEditor documentId="demo-vertical" />
        <section className="border-t border-slate-200 pt-4 text-sm text-zinc-600">
          <h2 className="font-medium text-zinc-900">Criterio Fase 1</h2>
          <p>
            La app arranca y <code className="font-mono">/api/health</code> lee/escribe NeonDB.
            Sin <code className="font-mono">DATABASE_URL</code> responde 503 con mensaje claro (ver estado abajo).
          </p>
          <a className="pressable mt-2 inline-block rounded-lg border border-slate-200 px-3 py-1.5" href="/api/health">
            Abrir /api/health
          </a>
        </section>
      </div>
    </main>
  );
}
