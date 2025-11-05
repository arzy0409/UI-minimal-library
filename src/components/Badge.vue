<script setup lang="ts">
/* =====================================================================
   UI-BADGE – kompakter Status-/Tag-Chip
   ---------------------------------------------------------------------
   Props
   - variant : farbliche Variante (neutral | info | success | warning | error)
   - size    : Größe (sm | md)
   - pill    : Pillenform (true) oder abgerundet/rechteckig (false)

   Hinweise
   - Rein dekorativ (span). Für interaktive Chips bitte Button/Link verwenden.
   - Nutzt globale Design Tokens: --color-*, --radius-*, --shadow-*, etc.
   ===================================================================== */

const {
  variant = 'neutral',
  size    = 'md',
  pill    = true,
} = defineProps<{
  variant?: 'neutral' | 'info' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md'
  pill?: boolean
}>()
</script>

<template>
  <span
    class="ui-badge"
    :data-variant="variant"
    :data-size="size"
    :data-pill="pill ? 'true' : null"
  >
    <slot />
  </span>
</template>

<style scoped>
/* =====================================================================
   BASIS
   ===================================================================== */
.ui-badge {
  /* Lokale Badge-Tokens (ableitbar von globalen Design Tokens) */
  --bdg-bg: color-mix(in oklab, var(--color-fg, #111) 10%, var(--color-bg, #fff));
  --bdg-fg: var(--color-fg, #111);
  --bdg-radius: var(--radius-md, 10px);
  --bdg-pad-y: 3px;
  --bdg-pad-x: 8px;
  --bdg-fs: 12px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: var(--bdg-pad-y) var(--bdg-pad-x);
  border-radius: var(--bdg-radius);
  border: 1px solid color-mix(in oklab, var(--color-fg, #111) 15%, transparent);

  background: var(--bdg-bg);
  color: var(--bdg-fg);

  font-weight: 500;
  font-size: var(--bdg-fs);
  line-height: 1;
  white-space: nowrap;
  user-select: none;
}

/* =====================================================================
   GRÖSSEN
   ===================================================================== */
.ui-badge[data-size='sm'] {
  --bdg-fs: 11px;
  --bdg-pad-y: 2px;
  --bdg-pad-x: 6px;
}
.ui-badge[data-size='md'] {
  --bdg-fs: 12px;
  --bdg-pad-y: 3px;
  --bdg-pad-x: 8px;
}

/* Pillenform */
.ui-badge[data-pill='true'] {
  border-radius: 999px;
}

/* =====================================================================
   VARIANTEN (Farben)
   - Hintergrund ist leicht getönt, Textfarbe erhält höheren Kontrast
   ===================================================================== */
.ui-badge[data-variant='neutral'] {
  --bdg-bg: color-mix(in oklab, var(--color-fg, #111) 8%, var(--color-bg, #fff));
  --bdg-fg: var(--color-fg, #111);
}

.ui-badge[data-variant='info'] {
  --bdg-bg: color-mix(in oklab, var(--color-primary, #2563eb) 18%, transparent);
  --bdg-fg: #1e3a8a; /* dunkles Blau für Lesbarkeit */
}

.ui-badge[data-variant='success'] {
  --bdg-bg: color-mix(in oklab, var(--color-success, #16a34a) 22%, transparent);
  --bdg-fg: #14532d;
}

.ui-badge[data-variant='warning'] {
  --bdg-bg: color-mix(in oklab, var(--color-warning, #f59e0b) 26%, transparent);
  --bdg-fg: #78350f;
}

.ui-badge[data-variant='error'] {
  --bdg-bg: color-mix(in oklab, var(--color-error, #e11d48) 20%, transparent);
  --bdg-fg: #7f1d1d;
}

/* =====================================================================
   DARK MODE FEINJUSTIERUNG (optional)
   - Der Hintergrund ist im Dark Mode oft zu dunkel/kontrastarm:
     leichte Aufhellung verbessert die Lesbarkeit.
   ===================================================================== */
:root[data-theme="dark"] .ui-badge[data-variant='neutral'] {
  --bdg-bg: color-mix(in oklab, #ffffff 8%, var(--color-bg, #1e1e1e));
}
</style>
