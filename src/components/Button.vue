<script setup lang="ts">
/* =====================================================================
   UI-BUTTON (Primär / Neutral)
   ---------------------------------------------------------------------
   Ziel:
   - Einheitlicher, token-basierter Button
   - Varianten: 'primary' | 'neutral'
   - Zustände: hover, active, disabled, loading
   - A11y: focus-visible Ring über Token, aria-busy bei Ladezustand
   ===================================================================== */

const props = withDefaults(defineProps<{
  /** Farb-/Stilvariante */
  variant?: 'primary' | 'neutral'
  /** Ladezustand: blockiert Klicks, zeigt Spinner */
  loading?: boolean
  /** Deaktiviert den Button */
  disabled?: boolean
}>(), {
  variant: 'primary',
  loading: false,
  disabled: false,
})

/** Click-Event – wird nur ausgelöst, wenn Button aktiv ist */
const emit = defineEmits<{ (e: 'click', ev: MouseEvent): void }>()

function onClick(ev: MouseEvent) {
  if (!props.loading && !props.disabled) emit('click', ev)
}
</script>

<template>
  <button
    type="button"
    class="ui-btn"
    :data-variant="props.variant"
    :aria-busy="props.loading ? 'true' : 'false'"
    :disabled="props.disabled || props.loading"
    @click="onClick"
  >
    <!-- Visuelle Ladeanzeige (Punkt-Animation) -->
    <span v-if="props.loading" class="ui-btn__spinner" aria-hidden="true">●</span>

    <!-- Button-Inhalt -->
    <slot />

    <!-- Screenreader-Text im Ladezustand -->
    <span v-if="props.loading" class="sr-only">Lädt…</span>
  </button>
</template>

<style scoped>
/* =====================================================================
   BASIS-STILE
   ===================================================================== */
.ui-btn {
  /* Layout: Text & Icons zentriert */
  display: inline-flex;
  align-items: center;          /* vertikal mittig */
  justify-content: center;      /* horizontal mittig */
  gap: 8px;
  width: auto;                  /* verhindert 100%-Weite */
  align-self: flex-start;       /* bündig in Flex-Layouts */

  /* Maße / Typografie */
  padding: var(--space-sm, 8px) var(--space-md, 16px);
  border-radius: var(--radius-md, 8px);
  font: inherit;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;

  /* Interaktion / Visuelles */
  cursor: pointer;
  background: transparent;
  color: var(--color-fg, #111);
  border: 1px solid transparent;
  box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,.08));
  transition:
    transform .12s ease,
    box-shadow .12s ease,
    background-color .15s ease,
    color .15s ease,
    border-color .15s ease,
    filter .15s ease;
}

/* Hover/Active – subtiler Lift-Effekt */
.ui-btn:hover:not([disabled]) {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(0,0,0,.07);
}
.ui-btn:active:not([disabled]) {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}

/* Fokus: klarer Ring über Token (kommt aus base.css) */
.ui-btn:focus-visible {
  outline: 0;
  box-shadow: var(--focus-ring, 0 0 0 3px color-mix(in oklab, var(--color-primary, #2563eb) 20%, transparent));
}

/* Disabled / Loading sperren Interaktion */
.ui-btn[disabled] {
  opacity: .6;
  cursor: not-allowed;
  transform: none;
  box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,.08));
}

/* =====================================================================
   VARIANTEN
   ===================================================================== */

/* Primary */
.ui-btn[data-variant="primary"] {
  background: var(--color-primary, #2563eb);
  color: var(--color-on-primary, #fff);
  border-color: color-mix(in oklab, var(--color-on-primary, #fff) 20%, transparent);
}
.ui-btn[data-variant="primary"]:hover:not([disabled]) {
  filter: brightness(0.97);
}

/* Neutral */
.ui-btn[data-variant="neutral"] {
  background: color-mix(in oklab, var(--color-bg, #fff) 88%, var(--color-fg, #111));
  color: var(--color-fg, #111);
  border-color: color-mix(in oklab, var(--color-fg, #111) 22%, transparent);
}

/* =====================================================================
   LADESPINNER (einfacher Punkt mit Puls-Animation)
   ===================================================================== */
.ui-btn__spinner {
  display: inline-block;
  font-size: 0.9em;
  line-height: 1;
  animation: btnPulse 1s linear infinite;
  opacity: .9;
}
@keyframes btnPulse {
  0%   { transform: scale(0.9); opacity: .4; }
  50%  { transform: scale(1.0); opacity: 1; }
  100% { transform: scale(0.9); opacity: .4; }
}

/* =====================================================================
   SCREENREADER-TEXT
   ===================================================================== */
.sr-only {
  position: absolute !important;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0);
  white-space: nowrap; border: 0;
}

/* =====================================================================
   MOTION-PREFERENCE
   ===================================================================== */
@media (prefers-reduced-motion: reduce) {
  .ui-btn {
    transition: background-color .15s ease, color .15s ease, border-color .15s ease;
  }
  .ui-btn:hover,
  .ui-btn:active {
    transform: none;
    box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,.08));
  }
  .ui-btn__spinner { animation: none; }
}
</style>
