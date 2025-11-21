<script setup lang="ts">
/**
 * Alert.vue — Hinweis-/Statuskomponente
 *
 * Ziele:
 * - Darstellung kurzer Hinweise, Infos, Warnungen oder Fehler
 * - Optional schließbar (dismissible)
 *
 * A11y:
 * - Nutzt `role="alert"` → Screenreader geben den Inhalt sofort aus
 *   (assertive Live-Region, geeignet für Fehler/Hinweise mit hoher Priorität)
 * - Für weniger dringliche Hinweise könnte alternativ `role="status"` genutzt werden,
 *   wird jedoch im aktuellen Code NICHT gesetzt.
 */


type LiveRole = 'status' | 'alert'

const {
  variant = 'info',
  title,
  role = 'status',
  dismissible = false,
} = defineProps<{
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  role?: LiveRole
  dismissible?: boolean
}>()

const emit = defineEmits<{ (e: 'dismiss'): void }>()
</script>

<template>
  <!--
    Rolle & Live-Region:
    - role="status"  => screenreader liest "höflich"
    - role="alert"   => screenreader liest "dringlich/sofort"
  -->
  <div
    class="ui-alert"
    :data-variant="variant"
    :role="role"
    :aria-live="role === 'alert' ? 'assertive' : 'polite'"
  >
    <!-- Icon-Spalte (rein dekorativ) -->
    <div class="ui-alert__icon" aria-hidden="true">
      <!-- Einfache Unicode-Icons als Fallback; kann später durch SVGs ersetzt werden -->
      <span v-if="variant === 'info'">ℹ️</span>
      <span v-else-if="variant === 'success'">✅</span>
      <span v-else-if="variant === 'warning'">⚠️</span>
      <span v-else>⛔</span>
    </div>

    <!-- Inhalt -->
    <div class="ui-alert__content">
      <div v-if="title" class="ui-alert__title">{{ title }}</div>
      <div class="ui-alert__message"><slot /></div>
    </div>

    <!-- Optionaler Close-Button -->
    <button
      v-if="dismissible"
      class="ui-alert__close"
      type="button"
      aria-label="Hinweis schließen"
      @click="emit('dismiss')"
    >
      ✕
    </button>
  </div>
</template>

<style scoped>
/* =====================================================================
   BASIS-LOOK & LAYOUT
   - Farben werden über Variablen je Variante gesetzt (siehe unten)
   ===================================================================== */
.ui-alert {
  /* Ableitbare Token (Fallbacks sichern) */
  --al-bg:     color-mix(in oklab, var(--color-bg, #fff) 8%, var(--color-fg, #111));
  --al-border: color-mix(in oklab, var(--color-fg, #111) 15%, transparent);
  --al-color:  var(--color-fg, #111);

  display: grid;
  grid-template-columns: auto 1fr auto; /* Icon | Text | X */
  align-items: start;
  gap: 10px;
  padding: 12px 14px;

  background: var(--al-bg);
  color: var(--al-color);
  border: 1px solid var(--al-border);
  border-radius: var(--radius-md, 12px);
  box-shadow: var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.08));
}

/* Textstruktur */
.ui-alert__icon   { font-size: 18px; padding-top: 2px; line-height: 1; }
.ui-alert__title  { font-weight: 600; margin: 0 0 4px 0; }
.ui-alert__message{ font-size: 0.95rem; }

/* Close-Button (nur wenn dismissible=true) */
.ui-alert__close {
  inline-size: 28px;
  block-size: 28px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  color: inherit;
  transition: background-color .15s ease, box-shadow .15s ease;
}
.ui-alert__close:hover {
  background: color-mix(in oklab, currentColor 10%, transparent);
}
.ui-alert__close:focus-visible {
  outline: 0;
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary, #2563eb) 25%, transparent);
}

/* =====================================================================
   VARIANTEN (setzt nur Variablen; Basis nutzt diese automatisch)
   ===================================================================== */
.ui-alert[data-variant='info'] {
  --al-color:  #1e40af;
  --al-border: #bfdbfe;
  --al-bg:     #eff6ff;
}
.ui-alert[data-variant='success'] {
  --al-color:  #166534;
  --al-border: #bbf7d0;
  --al-bg:     #f0fdf4;
}
.ui-alert[data-variant='warning'] {
  --al-color:  #92400e;
  --al-border: #fde68a;
  --al-bg:     #fffbeb;
}
.ui-alert[data-variant='error'] {
  --al-color:  #991b1b;
  --al-border: #fecaca;
  --al-bg:     #fef2f2;
}

/* =====================================================================
   DARK MODE FEINJUSTIERUNG (optional)
   - Leicht andere Tönung für bessere Lesbarkeit im Dark-Theme
   ===================================================================== */
:root[data-theme="dark"] .ui-alert[data-variant='info'] {
  --al-bg: color-mix(in oklab, #60a5fa 12%, #0b0f14);
}
:root[data-theme="dark"] .ui-alert[data-variant='success'] {
  --al-bg: color-mix(in oklab, #22c55e 12%, #0b0f14);
}
:root[data-theme="dark"] .ui-alert[data-variant='warning'] {
  --al-bg: color-mix(in oklab, #f59e0b 14%, #0b0f14);
}
:root[data-theme="dark"] .ui-alert[data-variant='error'] {
  --al-bg: color-mix(in oklab, #ef4444 12%, #0b0f14);
}

/* =====================================================================
   REDUCED MOTION
   ===================================================================== */
@media (prefers-reduced-motion: reduce) {
  .ui-alert__close { transition: none; }
}
</style>
