# DESIGN.md — TeamDocs (Operate + taste baseline 2/2/8)

Baseline taste: DESIGN_VARIANCE=2 (predecible), MOTION_INTENSITY=2 (estático, solo hover/active),
VISUAL_DENSITY=8 (cockpit: denso, sin cards genéricas, `border-t`/`divide-y`, mono para números).

## Tipografía (determinista, sin Inter, sin serif en dashboard)
- Display: `text-4xl md:text-6xl tracking-tighter leading-none`, Geist/Satoshi/Cabinet Grotesk.
- UI técnica: sans + mono (`Geist Mono`/`JetBrains Mono`) para latencias, contadores, estados.
- Cuerpo: `text-base text-zinc-600 leading-relaxed max-w-[65ch]`.

## Color (1 acento, sat <80%, sin lila neón, sin negro puro)
- Base: Zinc/Slate neutros, fondo `#f9fafb`, superficies blancas `border-slate-200/50`.
- Acento único: Emerald profundo (ej. `emerald-600`) para presencia/guardado.
- Sombras tintadas al fondo, radios `rounded-[2.5rem]` solo en contenedores mayores, resto `rounded-xl`.
- Prohibido: glows neón, gradientes de texto grandes, `#000000` (usar `zinc-950`).

## Layout (anti-centro solo si varianza sube; aquí varianza 2 = simétrico)
- Contenedor `max-w-7xl mx-auto`, grid sobre flex-math, `min-h-[100dvh]` nunca `h-screen`.
- Editor denso: toolbar compacta, sidebar con `divide-y`, métricas sin cajas.
- Móvil <768px: una columna `w-full px-4 py-8`, sin scroll horizontal.

## Movimiento (emil-design-eng, propósito primero)
- Frecuencia alta (teclear, cursores) = sin animación. Ocasional (toasts, modales) = 150-250ms.
- `ease-out` al entrar, `cubic-bezier(0.23,1,0.32,1)`; jamás `ease-in` en UI; solo `transform`+`opacity`.
- Presencia: `scale(0.97)` en `:active`, `scale(0.95)+opacity` al entrar (nunca desde `scale(0)`).
- `prefers-reduced-motion`: solo fade, sin desplazamiento. Hover solo con `@media (hover:hover) and (pointer:fine)`.

## Estados obligatorios
Loading: skeletons del tamaño del layout. Empty: cómo poblar. Error: inline bajo el campo.
Táctil: `-translate-y-[1px]` o `scale-[0.98]` en `:active`. Avatares: foto placeholder, nunca icono huevo.
Datos: nombres creíbles (no John Doe), números orgánicos (no 99.99%), sin lorem de startup.

## Accesibilidad y perf
- Foco visible, contraste, touch targets, `will-change` mínimo, animaciones off-main-thread (CSS > JS bajo carga).
- Grain solo en `fixed inset-0 pointer-events-none`, nunca en scroll. z-index solo para capas (nav/modal/overlay).
