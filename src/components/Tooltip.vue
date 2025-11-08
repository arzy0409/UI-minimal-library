<script setup lang="ts">
/**
 * Tooltip.vue — Designsystem light (A11y-ready)
 *
 * Ziele:
 * - Trigger verweist per `aria-describedby` auf den Tooltip-Content
 * - Content trägt `role="tooltip"` + stabile ID
 * - Öffnen/Schließen per Maus (hover) und Tastatur (focus)
 * - ESC schließt nur, wenn der Trigger fokussiert ist (nicht global)
 *
 * Styling:
 * - Farben/Schatten/Radius kommen aus base.css/tokens.css (siehe .ui-tooltip__content)
 * - Die Positions-Klassen (.pos-top/.pos-right/...) sind hier scoped definiert
 */

import { computed, ref } from 'vue'

const props = defineProps<{
  /** Tooltip-Text */
  content: string
  /** Position relativ zum Trigger (CSS-seitig gestylt) */
  position?: 'top' | 'right' | 'bottom' | 'left'
  /** Optionale Basis-ID (z. B. für Tests/SSR); sonst wird generiert */
  id?: string
  /**
   * Falls der Slot NICHT fokussierbar ist (z. B. <span> Badge),
   * macht dieser Schalter den Trigger selbst fokussierbar (tabindex=0).
   * Wenn im Slot bereits ein <button>/<a> liegt, setze auf false.
   */
  focusableTrigger?: boolean
}>()

/** Sichtbarkeit (light: rein lokal) */
const open = ref(false)

/** stabile Content-ID für Screenreader */
const _uid = Math.random().toString(36).slice(2)
const contentId = computed(() => (props.id ? `${props.id}-tooltip` : `ui-tooltip-${_uid}`))

/** Positionsklasse für CSS-Layout */
const posClass = computed(() => `pos-${props.position ?? 'top'}`)

/** Trigger-Fokusbarkeit: Standard = true (gut für Badge/Span) */
const triggerTabindex = computed(() => (props.focusableTrigger ?? true ? 0 : undefined))
</script>

<template>
  <!-- Wrapper: steuert nur Sichtbarkeit per Maus/Fokus -->
  <span
    class="ui-tooltip"
    @mouseenter="open = true"
    @mouseleave="open = false"
    @focusin="open = true"
    @focusout="open = false"
  >
    <!--
      TRIGGER:
      - verweist mit aria-describedby auf den Tooltip-Text
      - optional fokussierbar (tabindex=0), wenn Slot kein interaktives Element ist
      - ESC schließt NUR, wenn dieser Trigger fokussiert ist
    -->
    <span
      class="ui-tooltip__trigger"
      :tabindex="triggerTabindex"
      :aria-describedby="contentId"
      @keydown.esc.stop.prevent="open = false"
    >
      <slot />
    </span>

    <!--
      TOOLTIP-CONTENT:
      - Screenreader-verständlich (role="tooltip")
      - ID wird durch den Trigger referenziert
      - Positionierung per Klasse (Farben/Schatten kommen aus base.css)
    -->
    <div
      v-if="open"
      class="ui-tooltip__content"
      :class="posClass"
      :id="contentId"
      role="tooltip"
    >
      {{ props.content }}
    </div>
  </span>
</template>

<style scoped>
/* Minimal-Layout-Hooks: deine Look&Feel-Token (bg/fg/shadow) kommen aus base.css */

/* Wrapper: inline-flex, damit Trigger/Content sauber ausgerichtet sind */
.ui-tooltip {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
}

/* Content absolut positionieren; base.css liefert Farben/Schatten/Radius/Padding */
.ui-tooltip__content {
  position: absolute;
  white-space: nowrap;
  z-index: 20;
}

/* Positionsklassen – ggf. anpassen, falls du andere Namen bevorzugst */
.ui-tooltip__content.pos-top    { bottom: 100%; left: 50%; transform: translate(-50%, -6px); }
.ui-tooltip__content.pos-bottom { top: 100%;    left: 50%; transform: translate(-50%,  6px); }
.ui-tooltip__content.pos-left   { right: 100%;  top: 50%;  transform: translate(-6px, -50%); }
.ui-tooltip__content.pos-right  { left: 100%;   top: 50%;  transform: translate( 6px, -50%); }
</style>
