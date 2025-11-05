<script setup lang="ts">
/* =====================================================
   UI-SWITCH (v-model: boolean)
   - Props: modelValue, label, disabled
   - A11y: native Checkbox mit role="switch", aria-checked/-disabled
   ===================================================== */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    label?: string
    disabled?: boolean
  }>(),
  {
    modelValue: false,
    label: '',
    disabled: false,
  }
)

const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()

/** Toggle nur, wenn nicht disabled */
const toggle = () => {
  if (!props.disabled) emit('update:modelValue', !props.modelValue)
}

/** einfache (quasi) eindeutige ID für Input/Label-Verknüpfung */
const switchId = computed(() => `switch-${Math.random().toString(36).slice(2, 8)}`)
</script>

<template>
  <!--
    Label kapselt Input + visuelle Hülle:
    - Klick auf Track/Label toggelt
    - data-disabled erzwingt konsistente Styles
  -->
  <label
    class="ui-switch"
    :for="switchId"
    :data-disabled="disabled ? 'true' : null"
  >
    <!--
      Nativer Checkbox-Input
      - role="switch" für Screenreader
      - aria-checked/aria-disabled für A11y
      - :checked bindet v-model-State
     -->
    <input
      :id="switchId"
      class="ui-switch__input"
      type="checkbox"
      role="switch"
      :checked="modelValue"
      :disabled="disabled"
      :aria-checked="modelValue ? 'true' : 'false'"
      :aria-disabled="disabled ? 'true' : 'false'"
      @change="toggle"
    />

    <!-- Visueller Track + Thumb -->
    <span class="ui-switch__track">
      <span class="ui-switch__thumb" />
    </span>

    <!-- Optionales Label rechts vom Schalter -->
    <span v-if="label" class="ui-switch__label">{{ label }}</span>
  </label>
</template>

<style scoped>
/* =====================================================
   LAYOUT & ZUSTÄNDE
   ===================================================== */
.ui-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  font: inherit;
}

.ui-switch[data-disabled="true"] {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Versteckter echter Input – behält Tastatur & Screenreader */
.ui-switch__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

/* =====================================================
   TRACK (Hintergrund) & THUMB (Kreis)
   ===================================================== */
.ui-switch__track {
  position: relative;
  width: 42px;
  height: 24px;
  background: color-mix(in oklab, var(--color-fg, #111) 25%, var(--color-bg, #fff));
  border-radius: 999px;
  transition: background-color .25s ease, box-shadow .25s ease;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.15);
}

.ui-switch__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: var(--color-bg, #fff);
  border-radius: 50%;
  transition: transform .25s ease, box-shadow .25s ease, background-color .25s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

/* =====================================================
   INTERAKTIONS- & AKTIV-ZUSTÄNDE
   ===================================================== */
/* Aktiviert (checked) → Primärfarbe + Thumb nach rechts */
.ui-switch__input:checked + .ui-switch__track {
  background: var(--color-primary, #2563eb);
}
.ui-switch__input:checked + .ui-switch__track .ui-switch__thumb {
  transform: translateX(18px);
}

/* Tastatur-Fokus: nutze globalen Focus-Ring (Token) */
.ui-switch__input:focus-visible + .ui-switch__track {
  outline: 0; /* eigene Ring-Logik statt Outline */
  box-shadow: var(--focus-ring, 0 0 0 3px color-mix(in oklab, #2563eb 20%, transparent));
}

/* Optional leichte Hover-Hebung (nur wenn nicht disabled) */
.ui-switch:not([data-disabled="true"]):hover .ui-switch__thumb {
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
}

/* Label-Text rechts vom Schalter */
.ui-switch__label {
  color: var(--color-fg, #111);
  font-size: 0.875rem;
  line-height: 1.2;
}

/* =====================================================
   REDUCED-MOTION (Respektiere Nutzerpräferenzen)
   ===================================================== */
@media (prefers-reduced-motion: reduce) {
  .ui-switch__track,
  .ui-switch__thumb {
    transition: none !important;
  }
}
</style>
