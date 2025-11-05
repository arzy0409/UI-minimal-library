<script setup lang="ts">
/* =====================================================================
   UI-INPUT (Textfeld)
   - v-model: Zweiwegbindung für Texteingabe
   - Props: id, label, type, placeholder, error, disabled, modelValue
   - Events: update:modelValue
   - A11y: aria-invalid bei Fehler, Label mit Input verknüpft
   ===================================================================== */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    id?: string
    label?: string
    type?: string
    placeholder?: string
    error?: string | null
    disabled?: boolean
    modelValue?: string
  }>(),
  {
    type: 'text',
    placeholder: '',
    error: null,
    disabled: false,
  }
)

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

/** Stabile ID für das Input-Feld (falls kein id-Prop übergeben wurde) */
const inputId = computed(
  () => props.id || `input-${Math.random().toString(36).slice(2, 8)}`
)
</script>

<template>
  <!-- Wrapper enthält Label, Input und evtl. Fehlermeldung -->
  <label class="ui-input" :for="inputId">
    <!-- Oberes Label -->
    <span v-if="label" class="ui-input__label">{{ label }}</span>

    <!-- Eingabefeld -->
    <input
      :id="inputId"
      class="ui-input__field"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="!!error"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <!-- Fehlermeldung -->
    <span v-if="error" class="ui-input__error" role="alert">
      {{ error }}
    </span>
  </label>
</template>

<style scoped>
/* =====================================================================
   GRUNDLAYOUT
   ===================================================================== */
.ui-input {
  display: grid;
  gap: 4px;
  width: 100%;
  font-family: var(--font-base, system-ui, sans-serif);
}

/* Label über dem Feld */
.ui-input__label {
  font-size: 0.875rem;
  color: var(--color-fg, #111);
}

/* =====================================================================
   EINGABEFELD (Textinput)
   ===================================================================== */
.ui-input__field {
  font: inherit;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md, 8px);
  border: 1px solid color-mix(in oklab, var(--color-fg, #111) 20%, transparent);
  background: var(--color-bg, #fff);
  color: var(--color-fg, #111);
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background-color 0.15s ease;
}

/* Fokus: nutze globalen Fokus-Ring oder Standardfarbe */
.ui-input__field:focus {
  border-color: var(--color-primary, #2563eb);
  box-shadow: var(--focus-ring, 0 0 0 3px color-mix(in oklab, #2563eb 25%, transparent));
}

/* Deaktiviert */
.ui-input__field:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: color-mix(in oklab, var(--color-bg, #fff) 80%, var(--color-fg, #111));
}

/* =====================================================================
   FEHLERZUSTAND
   ===================================================================== */
.ui-input__error {
  color: var(--color-error, #e11d48);
  font-size: 0.75rem;
  line-height: 1.2;
  margin-top: 2px;
}

/* Optional: visuelles Feedback bei Fehler + Fokus */
.ui-input__field[aria-invalid="true"]:focus {
  border-color: var(--color-error, #e11d48);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-error, #e11d48) 25%, transparent);
}

/* =====================================================================
   REDUCED MOTION
   ===================================================================== */
@media (prefers-reduced-motion: reduce) {
  .ui-input__field {
    transition: none !important;
  }
}
</style>
