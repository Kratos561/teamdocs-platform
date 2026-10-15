"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";

// Prueba vertical Fase 3: Tiptap + Yjs + Hocuspocus, sala por documento.
// Sin animaciones en el tecleo (emil: acciones frecuentes no animan).
export default function CollabEditor({ documentId }: { documentId: string }) {
  const [status, setStatus] = useState("desconectado");
  const [saveState, setSaveState] = useState("local");

  const editor = useEditor(
    {
      extensions: [StarterKit],
      content: "<h1>Documento de prueba</h1><p>Edita desde dos pestañas para verificar sincronía.</p>",
      editorProps: { attributes: { class: "prose max-w-none focus:outline-none min-h-[40dvh]" } }
    },
    [documentId]
  );

  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new HocuspocusProvider({
      url: process.env.NEXT_PUBLIC_COLLAB_URL ?? "ws://localhost:1234",
      name: `doc:${documentId}`,
      document: ydoc,
      token: process.env.NEXT_PUBLIC_COLLAB_TOKEN ?? ""
    });
    provider.on("status", ({ status: s }: { status: string }) => setStatus(s));
    provider.on("synced", () => setSaveState("sincronizado"));
    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, [documentId]);

  return (
    <section className="rounded-xl border border-slate-200/50 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200/50 px-4 py-2 font-mono text-xs text-zinc-600">
        <span data-testid="conn-status">WS: {status}</span>
        <span data-testid="save-status">Guardado: {saveState}</span>
      </div>
      <div className="p-6">
        <EditorContent editor={editor} />
      </div>
    </section>
  );
}
