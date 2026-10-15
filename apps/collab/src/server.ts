import { Server } from "@hocuspocus/server";

// Sala = 1 por documento (`doc:<uuid>`). Auth mínima Fase 1:
// el cliente debe enviar token interno o de sesión; la autorización fina
// (workspace/document roles) vive en apps/web y se valida aquí vía hook.
const PORT = Number(process.env.COLLAB_PORT ?? 1234);

const server = new Server({
  async onAuthenticate({ token }) {
    // MVP local: aceptar si hay token configurado igual en ambos lados.
    // Endurecer en Fase 4: validar sesión Better Auth + permiso del documento.
    const expected = process.env.COLLAB_INTERNAL_TOKEN;
    if (expected && token !== expected) throw new Error("unauthorized");
  },
  async onLoadDocument({ documentName }) {
    if (!documentName.startsWith("doc:")) throw new Error("sala inválida");
    // Fase 3: cargar yjsStateBase64 desde NeonDB (document_states) y aplicarlo.
    // Fase 1: arrancar vacío; el guardado llega por onStoreDocument.
  },
  async onStoreDocument({ documentName }) {
    // Fase 3: serializar Y.Doc a base64 y upsert en document_states.
    // Se deja el hook cableado para no reconstruir el núcleo después.
    void documentName;
  }
});

server.listen(PORT).then(() => {
  console.log(`[collab] Hocuspocus en puerto ${PORT}`);
});
