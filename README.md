# TeamDocs Platform

Edición colaborativa en tiempo real (Next.js + Tiptap + Yjs + Hocuspocus + NeonDB).

## Stack verificado (oct-2026)
| Paquete | Versión | Licencia | Coste |
|---|---|---|---|
| next | 16.4.1 | MIT | Vercel Hobby gratis (no comercial), Pro $20/miembro |
| react / react-dom | 19.3.1 | MIT | — |
| @tiptap/core @tiptap/react @tiptap/starter-kit | 3.32.0 | MIT (core) | Editor gratis self-host; Tiptap Cloud Collab Start $49/mes solo si usas su nube (nosotros usamos Hocuspocus propio) |
| yjs | 13.6.33 | MIT | — |
| y-prosemirror | 1.3.7 | MIT | — |
| @hocuspocus/server @hocuspocus/provider | 4.7.1 | MIT | Self-host gratis en Render/Railway; Render free se duerme ~15min, Railway free ~$1 crédito |
| drizzle-orm | 0.45.4 / kit 0.31.11 | MIT | — |
| @neondatabase/serverless | 1.2.0 | MIT | Neon Free útil para dev/prototipo, PG17 en aws-us-east-2 |
| better-auth | 1.7.8 | MIT | — |
| tailwindcss | 4.3.3 | MIT | — |

Principio: NeonDB persistente, Hocuspocus conexiones WS, Yjs merge. Sala = 1 por documento.

## Estructura
```text
teamdocs-platform/
├── apps/web/          # Next.js (editor + gestión)
├── apps/collab/       # Hocuspocus WS persistente
├── packages/database/ # Drizzle schema + migraciones (Neon)
├── packages/shared/   # tipos y permisos compartidos
├── .github/workflows/ # CI
├── docs/              # arquitectura y despliegue
├── .env.example
└── README.md
```

## Instalación y ejecución
```bash
cp .env.example .env
# Rellenar DATABASE_URL desde Neon Console (proyecto kawai-anime, branch main)
# Generar: openssl rand -base64 48  -> BETTER_AUTH_SECRET
#          openssl rand -hex 32     -> COLLAB_INTERNAL_TOKEN

corepack pnpm install
corepack pnpm --filter @teamdocs/database generate
corepack pnpm --filter @teamdocs/database migrate
corepack pnpm dev            # web en http://localhost:3000
corepack pnpm dev:collab     # ws en ws://localhost:1234 (otra terminal)
```

Criterio Fase 1: `apps/web` arranca y `/api/health` lee/escribe NeonDB.

## Seguridad
- Sin secretos en git. `.env` gitignored, solo `.env.example` con placeholders.
- Permisos en backend + WS. Tokens de invitación impredecibles con expiración.
- Si una key se pegó en un chat/log, rotarla en Neon/GitHub inmediatamente.

## Diseño
Ver `PRODUCT.md` (modo Operate) y `DESIGN.md` (baseline 2/2/8, Emerald único, Geist, denso sin cards).
