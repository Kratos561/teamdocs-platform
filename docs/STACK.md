# Stack — versiones, licencias, costes y hosting (verificado 2026-10-15)

Comando de verificación:
```bash
corepack pnpm view next version
corepack pnpm view @tiptap/core version
corepack pnpm view yjs version
corepack pnpm view @hocuspocus/server version
corepack pnpm view drizzle-orm version
```
Resultado: next 16.4.1, @tiptap/* 3.32.0, yjs 13.6.33, @hocuspocus/* 4.7.1, drizzle-orm 0.45.4,
react 19.3.1, tailwindcss 4.3.3, better-auth 1.7.8, @neondatabase/serverless 1.2.0.

## Licencias
- Next.js MIT, React MIT, Tiptap core MIT, Yjs MIT, Hocuspocus MIT, Drizzle MIT,
  Better Auth MIT, Tailwind MIT. Todas permiten uso comercial self-host sin pago.
- Excepción: Tiptap Cloud (Collab/AI) es SaaS de pago ($49 Start). No lo usamos;
  colaboramos con Hocuspocus propio (MIT).

## Costes (orientativo, verificar en webs oficiales antes de producción)
- Neon Free: dev/prototipo útil, PG17, autosuspende; escalar a Launch/Scale según uso.
- Vercel Hobby gratis solo no-comercial; Pro $20/miembro + uso. App Next.js aquí.
- Render/Railway para WS persistente (Vercel no mantiene WS largo):
  Render free se duerme, Railway free crédito ~$1. Producción = instancia paga pequeña.
- Separar web y collab permite escalar y reiniciar sin tumbar la otra.

## Requisitos hosting
- Web: Node 22-26, HTTPS, envs (DATABASE_URL, BETTER_AUTH_SECRET, NEXT_PUBLIC_COLLAB_URL).
- Collab: Node persistente, puerto WS abierto, sticky si hay réplicas, Redis solo al escalar.
- DB: Neon pooled para web, unpooled para migraciones; backups y point-in-time según plan.

## Neon usado
- Org `Cyber name` (id redactado en docs), proyecto `kawai-anime` (PG17, aws-us-east-2),
  branch `main`. DATABASE_URL se copia de Neon Console, no se guarda en repo.
