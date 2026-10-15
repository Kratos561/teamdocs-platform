# PRODUCT.md — TeamDocs Platform

Modo impeccable: **Operate** (el visitante completa una tarea: crear, compartir y co-editar documentos).
La landing/docs es persuasiva, pero el editor es herramienta: escaneabilidad y consistencia por encima de expresión.

## Qué es
Plataforma web de edición colaborativa tipo Google Docs: equipos, documentos en tiempo real,
guardado automático, permisos y versiones. Núcleo fiable primero, funciones después.

## Usuario y éxito
- Equipo pequeño (2-10) que crea un doc, lo comparte y lo edita a la vez sin perder datos ni filtrar accesos.
- Éxito = dos sesiones ven cambios del otro <1s, recarga restaura, sin permiso = 403 aunque conozca el ID.

## Alcance MVP (Fase 5)
Editor: texto enriquecido, H1/H2, bold/italic/link, listas, guardado auto, presencia/cursores.
Gestión: crear/abrir/renombrar, listar/buscar, por equipo, compartir, permisos, archivar.
UX: responsive, indicador conexión, estado guardado, errores claros, reconexión.

## Fuera de MVP (Fase 10)
Comentarios por selección, historial/restauración UI, export PDF/DOCX, carpetas avanzadas,
full-text search, notificaciones, offline, plantillas, admin ampliado.

## Principios
1. Fiabilidad y seguridad antes que amplitud y refinamiento visual.
2. NeonDB = persistente; Hocuspocus = conexiones; Yjs = merge. Salas = 1 por documento.
3. Permisos se validan en backend + WS, nunca solo en frontend.
4. Versiones = snapshots explícitos, no cada guardado.

## Métricas beta (Fase 9)
Sincronización fiable, latencia editor p95, reconexión, errores permiso, p95 DB, coste hosting, UX issues.
