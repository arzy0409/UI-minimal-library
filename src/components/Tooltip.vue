<script setup lang="ts">
/* =====================================================
   IMPORTS & PROPS-DEFINITION
   ===================================================== */
import { ref } from 'vue'

/**
 * Tooltip-Komponente
 * Liefert kurze Kontexthinweise bei Hover oder Fokus.
 * Unterstützt Positionen: oben, unten, links, rechts.
 */
const props = withDefaults(
  defineProps<{
    content?: string
    position?: 'top' | 'bottom' | 'left' | 'right'
  }>(),
  {
    content: '',
    position: 'top',
  }
)

/* =====================================================
   REAKTIVE ZUSTÄNDE
   ===================================================== */
const open = ref(false)
</script>

<template>
  <!-- ÄUSSERER WRAPPER -->
  <span
    class="ui-tooltip"
    @mouseenter="open = true"
    @mouseleave="open = false"
    @focusin="open = true"
    @focusout="open = false"
    @keydown.esc="open = false"
  >
    <!-- TRIGGER-ELEMENT (das Ziel, über dem der Tooltip erscheint) -->
    <span class="ui-tooltip__trigger">
      <slot />
    </span>

    <!-- TOOLTIP-INHALT -->
    <transition name="ttfade">
      <span
        v-if="open"
        class="ui-tooltip__content"
        :data-pos="props.position"
        role="tooltip"
      >
        <!-- Inhalt über Props oder benannten Slot -->
        <slot name="content">{{ props.content }}</slot>

        <!-- Pfeil (zeigt zur Quelle) -->
        <span class="ui-tooltip__arrow" aria-hidden="true"></span>
      </span>
    </transition>
  </span>
</template>

<style scoped>
/* =====================================================
   GRUNDLAYOUT
   ===================================================== */
/* Der Container ist Referenzpunkt für die Positionslogik */
.ui-tooltip {
  position: relative;
  display: inline-block; /* wichtig: kein inline-flex */
  vertical-align: middle;
}

/* Fokus-Ring (aus base.css über --focus-ring) */
.ui-tooltip__trigger:focus-visible {
  outline: 0;
  box-shadow: var(--focus-ring);
  border-radius: 8px;
}

/* =====================================================
   TOOLTIP-FLÄCHE (CONTENT)
   ===================================================== */
.ui-tooltip__content {
  position: absolute;
  z-index: 1000;
  padding: 6px 10px;
  font-size: 0.9rem;
  white-space: nowrap;
  pointer-events: none;

  /* Farben & Schatten (Design Tokens) */
  background: var(--tooltip-bg, rgba(33, 33, 33, 0.95));
  color: var(--tooltip-fg, #fff);
  border-radius: 6px;
  box-shadow: var(--tooltip-shadow, 0 2px 8px rgba(0, 0, 0, 0.2));
}

/* =====================================================
   ANIMATION (Opacity-Transition)
   ===================================================== */
/* Nur Opacity animieren – keine Transforms, damit Positionen stabil bleiben */
.ttfad-enter-active,
.ttfad-leave-active {
  transition: opacity 0.15s ease;
}
.ttfad-enter-from,
.ttfad-leave-to {
  opacity: 0;
}
.ttfad-enter-to,
.ttfad-leave-from {
  opacity: 1;
}

/* =====================================================
   POSITIONIERUNG
   ===================================================== */
.ui-tooltip {
  --tt-offset: 10px; /* Abstand zwischen Trigger und Tooltip */
}

/* Tooltip oberhalb */
.ui-tooltip__content[data-pos='top'] {
  left: 50%;
  bottom: calc(100% + var(--tt-offset));
  transform: translateX(-50%);
}

/* Tooltip unterhalb */
.ui-tooltip__content[data-pos='bottom'] {
  left: 50%;
  top: calc(100% + var(--tt-offset));
  transform: translateX(-50%);
}

/* Tooltip links vom Element */
.ui-tooltip__content[data-pos='left'] {
  right: calc(100% + var(--tt-offset));
  top: 50%;
  transform: translateY(-50%);
}

/* Tooltip rechts vom Element */
.ui-tooltip__content[data-pos='right'] {
  left: calc(100% + var(--tt-offset));
  top: 50%;
  transform: translateY(-50%);
}

/* =====================================================
   PFEIL (VISUELLE VERBINDUNG)
   ===================================================== */
.ui-tooltip__arrow {
  position: absolute;
  width: 10px;
  height: 10px;
  background: inherit;
  box-shadow: inherit;
  transform: rotate(45deg);
}

/* Pfeil-Position je nach Tooltip-Ausrichtung */
.ui-tooltip__content[data-pos='top'] .ui-tooltip__arrow {
  top: 100%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
}

.ui-tooltip__content[data-pos='bottom'] .ui-tooltip__arrow {
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
}

.ui-tooltip__content[data-pos='left'] .ui-tooltip__arrow {
  left: 100%;
  top: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
}

.ui-tooltip__content[data-pos='right'] .ui-tooltip__arrow {
  left: 0;
  top: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
}
</style>
