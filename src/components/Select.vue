<script setup lang="ts">
/* =====================================================================
   UI-SELECT (v-model: string | number | null)
   - Props: modelValue, options, placeholder, label, disabled, error, id
   - Events: update:modelValue, change, open, close
   - A11y: Combobox + Listbox-Rolle, aria-Attribute, Tastatursteuerung
   - UX: Klick außerhalb schließt, Fokus springt zurück zum Trigger
   ===================================================================== */
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

/** Optionstyp für die Dropdown-Liste */
type Option = { label: string; value: string | number; disabled?: boolean }

/** Props + Defaults */
const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null
    options: Option[]
    placeholder?: string
    label?: string
    disabled?: boolean
    error?: string | null
    id?: string
  }>(),
  {
    modelValue: null,
    placeholder: 'Land auswählen…',
    label: '',
    disabled: false,
    error: null,
  }
)

/** Events für v-model / Change / Open-Close */
const emit = defineEmits<{
  (e: 'update:modelValue', v: string | number | null): void
  (e: 'change', v: string | number | null): void
  (e: 'open'): void
  (e: 'close'): void
}>()

/* ----------------------------- State/Refs ----------------------------- */
const open = ref(false)
const activeIndex = ref<number>(-1)
const triggerRef = ref<HTMLButtonElement | null>(null)
const listRef = ref<HTMLUListElement | null>(null)

/** stabile Basis-ID (optional per Prop übersteuerbar) */
const idBase  = props.id ?? `sel-${Math.random().toString(36).slice(2, 8)}`
const listId  = `${idBase}-list`
const labelId = `${idBase}-label`

/** aktuell ausgewählter Index / Option / Label (für Trigger) */
const selectedIndex = computed(() => props.options.findIndex(o => o.value === props.modelValue))
const selected      = computed(() => props.options[selectedIndex.value] ?? null)
const displayLabel  = computed(() => selected.value?.label ?? props.placeholder)

/* ----------------------- Öffnen/Schließen-Logik ---------------------- */
watch(open, v => {
  if (v) {
    // Startindex: aktuelle Auswahl oder erste nicht deaktivierte Option
    activeIndex.value =
      selectedIndex.value >= 0
        ? selectedIndex.value
        : props.options.findIndex(o => !o.disabled)
    emit('open')
    // Sobald die Liste gerendert ist, Fokus in die Listbox setzen (A11y)
    requestAnimationFrame(() => listRef.value?.focus())
  } else {
    emit('close')
  }
})

/* --------------------------- Wert setzen ----------------------------- */
function setValueByIndex(i: number) {
  const opt = props.options[i]
  if (!opt || opt.disabled) return
  emit('update:modelValue', opt.value)
  emit('change', opt.value)
  open.value = false
  // Fokus zurück auf den Trigger
  triggerRef.value?.focus()
}

/* --------------- Tastatur: Trigger (geschlossen/offen) --------------- */
function onTriggerKeydown(e: KeyboardEvent) {
  if (props.disabled) return
  switch (e.key) {
    case 'ArrowDown':
    case 'ArrowUp':
      e.preventDefault()
      if (!open.value) open.value = true
      else moveActive(e.key === 'ArrowDown' ? 1 : -1)
      break
    case 'Enter':
    case ' ':
      e.preventDefault()
      open.value = !open.value
      break
    case 'Escape':
      if (open.value) {
        e.preventDefault()
        open.value = false
      }
      break
  }
}

/* -------------------- Tastatur: in der Listbox ----------------------- */
function onListKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowDown': e.preventDefault(); moveActive(1); break
    case 'ArrowUp':   e.preventDefault(); moveActive(-1); break
    case 'Home':      e.preventDefault(); moveToEdge('start'); break
    case 'End':       e.preventDefault(); moveToEdge('end'); break
    case 'Enter':
    case ' ':
      e.preventDefault()
      setValueByIndex(activeIndex.value)
      break
    case 'Escape':
      e.preventDefault()
      open.value = false
      triggerRef.value?.focus()
      break
  }
}

/* ------- Aktiven Index bewegen (überspringt disabled Optionen) ------- */
function moveActive(delta: number) {
  if (!props.options.length) return
  let i = activeIndex.value
  for (let step = 0; step < props.options.length; step++) {
    i = (i + delta + props.options.length) % props.options.length
    const opt = props.options[i]
    if (opt && !opt.disabled) {
      activeIndex.value = i
      ensureActiveVisible()
      return
    }
  }
}

/** Anfang/Ende: erste/letzte nicht deaktivierte Option */
function moveToEdge(where: 'start' | 'end') {
  const list  = props.options
  const range = where === 'start' ? list : [...list].reverse()
  const idx   = range.findIndex(o => !o.disabled)
  if (idx === -1) return
  activeIndex.value = where === 'start' ? idx : (list.length - 1 - idx)
  ensureActiveVisible()
}

/** Scrollt die aktive Option in den sichtbaren Bereich */
function ensureActiveVisible() {
  const listEl = listRef.value
  const idx    = activeIndex.value
  if (!listEl || idx < 0) return
  const item = listEl.children[idx] as HTMLElement | undefined
  item?.scrollIntoView({ block: 'nearest' })
}

/* ------------------------ Click-Outside schließen -------------------- */
function onClickOutside(e: MouseEvent) {
  if (!open.value) return
  const t = e.target as Node
  if (!triggerRef.value?.contains(t) && !listRef.value?.contains(t)) {
    open.value = false
  }
}
onMounted(() => document.addEventListener('mousedown', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<template>
  <div class="ui-field">
    <!-- Optionales Label oberhalb -->
    <label v-if="label" :id="labelId" class="ui-label">{{ label }}</label>

    <!-- Wrapper (position:relative) für die absolute Listbox -->
    <div class="ui-select" :data-disabled="disabled ? 'true' : null">
      <!-- Trigger-Button (Combobox) -->
      <button
        ref="triggerRef"
        type="button"
        class="ui-select__trigger"
        :id="idBase"
        :aria-labelledby="label ? `${labelId} ${idBase}` : undefined"
        role="combobox"
        aria-haspopup="listbox"
        :aria-expanded="open ? 'true' : 'false'"
        :aria-controls="listId"
        :aria-activedescendant="open && activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined"
        :disabled="disabled"
        @click="!disabled && (open = !open)"
        @keydown="onTriggerKeydown"
      >
        <span class="ui-select__value" :data-placeholder="!selected ? 'true' : null">
          {{ displayLabel }}
        </span>
        <span class="ui-select__chevron" aria-hidden="true">▾</span>
      </button>

      <!-- Dropdown / Listbox -->
      <ul
        v-show="open"
        ref="listRef"
        :id="listId"
        class="ui-select__list"
        role="listbox"
        :aria-labelledby="label ? labelId : undefined"
        @keydown="onListKeydown"
        tabindex="-1"
      >
        <li
          v-for="(opt, i) in options"
          :key="opt.value"
          class="ui-select__option"
          :id="`${listId}-opt-${i}`"
          role="option"
          :aria-selected="selectedIndex === i ? 'true' : 'false'"
          :aria-disabled="opt.disabled ? 'true' : 'false'"
          :data-active="activeIndex === i ? 'true' : null"
          :data-selected="selectedIndex === i ? 'true' : null"
          :data-disabled="opt.disabled ? 'true' : null"
          @mousemove="!opt.disabled && (activeIndex = i)"
          @click="setValueByIndex(i)"
        >
          {{ opt.label }}
        </li>
      </ul>
    </div>

    <!-- Fehlermeldung -->
    <p v-if="error" class="ui-error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
/* =====================================================
   Feld/Label/Fehler
   ===================================================== */
.ui-field { display: grid; gap: 6px; }

.ui-label {
  font-size: 0.875rem;
  color: var(--color-fg, #111);
}

.ui-error {
  margin: 6px 0 0;
  font-size: 0.8125rem;
  color: var(--color-error, #b00020);
}

/* =====================================================
   Trigger (Combobox)
   ===================================================== */
.ui-select { position: relative; width: 100%; }

.ui-select__trigger {
  width: 100%;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;

  border: 1px solid var(--color-border, #dcdcdc);
  background: var(--color-bg, #fff);
  color: var(--color-fg, #111);
  border-radius: var(--radius-md, 10px);
  box-shadow: 0 1px 0 rgba(0,0,0,0.02);

  transition: border-color .15s ease, box-shadow .15s ease, background-color .15s ease;
}

.ui-select__trigger:hover {
  border-color: color-mix(in oklab, var(--color-fg, #111) 20%, transparent);
}

/* Fokus: nutze globalen Focus-Ring (Token) */
.ui-select__trigger:focus-visible {
  outline: 0;
  box-shadow: var(--focus-ring, 0 0 0 3px color-mix(in oklab, #2563eb 20%, transparent));
}

.ui-select[data-disabled="true"] .ui-select__trigger {
  opacity: .6;
  cursor: not-allowed;
}

/* Platzhalter-Optik */
.ui-select__value[data-placeholder="true"] {
  color: color-mix(in oklab, var(--color-fg, #111) 45%, transparent);
}

.ui-select__chevron { opacity: .65; }

/* =====================================================
   Dropdown / Listbox
   ===================================================== */
.ui-select__list {
  position: absolute;
  inset-inline: 0;
  top: calc(100% + 6px);
  max-height: 220px;
  overflow: auto;
  z-index: 20;

  background: var(--color-bg, #fff);
  border: 1px solid var(--color-border, #dcdcdc);
  border-radius: var(--radius-md, 10px);
  box-shadow: var(--shadow-md, 0 6px 18px rgba(0,0,0,.08));
  padding: 6px;
}

.ui-select__option {
  padding: 8px 10px;
  border-radius: 8px;
  cursor: default;
  user-select: none;
  color: var(--color-fg, #111);
}

/* deaktivierte Optionen */
.ui-select__option[data-disabled="true"] { opacity: .5; }

/* Hover/Active in der Liste (Tastatur) */
.ui-select__option[data-active="true"] {
  background: color-mix(in oklab, var(--color-primary, #2563eb) 12%, transparent);
}

/* ausgewählte Option */
.ui-select__option[data-selected="true"] {
  background: color-mix(in oklab, var(--color-primary, #2563eb) 18%, transparent);
  font-weight: 600;
}

/* =====================================================
   Reduced Motion
   ===================================================== */
@media (prefers-reduced-motion: reduce) {
  .ui-select__trigger,
  .ui-select__option {
    transition: none !important;
  }
}
</style>
