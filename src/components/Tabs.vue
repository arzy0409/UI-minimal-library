<script setup lang="ts">
/* =====================================================
   IMPORTS & TYPEN
   ===================================================== */
import { ref, computed, watch, onMounted, nextTick } from 'vue'

/** Ein Tab-Eintrag (Label + optional disabled + optionale ID) */
type TabItem = { label: string; disabled?: boolean; id?: string }

/* =====================================================
   PROPS & DEFAULTS
   ===================================================== */
const props = withDefaults(
  defineProps<{
    /** Liste der Tabs */
    items: TabItem[]
    /** Aktiver Tab (Index) */
    modelValue?: number
    /** Nur optisch: horizontal (default) | vertical */
    orientation?: 'horizontal' | 'vertical'
    /** Optionaler ID-Prefix, falls du eigene IDs erzwingen willst */
    id?: string
  }>(),
  {
    modelValue: 0,
    orientation: 'horizontal',
  }
)

/* =====================================================
   EMITS
   ===================================================== */
const emit = defineEmits<{
  (e: 'update:modelValue', v: number): void
  (e: 'change', v: number): void
}>()

/* =====================================================
   INTERNE ZUSTÄNDE
   ===================================================== */
const current = ref(props.modelValue)

/** Halte internen Index in Sync wenn v-model sich ändert */
watch(
  () => props.modelValue,
  v => (current.value = v)
)

/** Stabile IDs für Tabs und Panels (A11y) */
const baseId = props.id ?? `tabs-${Math.random().toString(36).slice(2, 8)}`
const tabIds = computed(() =>
  props.items.map((it, i) => it.id ?? `${baseId}-tab-${i}`)
)
const panelIds = computed(() => props.items.map((_, i) => `${baseId}-panel-${i}`))

/* =====================================================
   HILFSFUNKTIONEN
   ===================================================== */
function focusTab(idx: number) {
  const btn = document.getElementById(tabIds.value[idx]!)
  if (btn instanceof HTMLElement) btn.focus()
}

function setActive(idx: number, { focus = false } = {}) {
  if (!props.items[idx] || props.items[idx].disabled) return
  current.value = idx
  emit('update:modelValue', idx)
  emit('change', idx)
  if (focus) focusTab(idx)
}

/** Nächstes aktivierbares Tab (Pfeiltasten-Navigation) */
function nextEnabled(from: number, dir: 1 | -1) {
  const len = props.items.length
  for (let step = 1; step <= len; step++) {
    const i = (from + dir * step + len) % len
    const item = props.items[i]
    if (item && !item.disabled) return i
  }
  return from
}

/** Tastatur-Navigation nach WAI-ARIA (Home/End + Pfeile) */
function onKeydownTabs(e: KeyboardEvent) {
  const isH = props.orientation === 'horizontal'
  const LEFT = 'ArrowLeft',
    RIGHT = 'ArrowRight',
    UP = 'ArrowUp',
    DOWN = 'ArrowDown'
  const HOME = 'Home',
    END = 'End'

  switch (e.key) {
    case HOME:
      e.preventDefault()
      setActive(firstEnabledIndex.value, { focus: true })
      break
    case END:
      e.preventDefault()
      setActive(lastEnabledIndex.value, { focus: true })
      break
    case LEFT:
      if (isH) {
        e.preventDefault()
        setActive(nextEnabled(current.value, -1), { focus: true })
      }
      break
    case RIGHT:
      if (isH) {
        e.preventDefault()
        setActive(nextEnabled(current.value, +1), { focus: true })
      }
      break
    case UP:
      if (!isH) {
        e.preventDefault()
        setActive(nextEnabled(current.value, -1), { focus: true })
      }
      break
    case DOWN:
      if (!isH) {
        e.preventDefault()
        setActive(nextEnabled(current.value, +1), { focus: true })
      }
      break
  }
}

/** Erster/Letzter nicht-deaktivierter Tab */
const firstEnabledIndex = computed(() => props.items.findIndex(t => !t.disabled))
const lastEnabledIndex = computed(() => {
  const rev = [...props.items].reverse()
  const idx = rev.findIndex(t => !t.disabled)
  return idx < 0 ? -1 : props.items.length - 1 - idx
})

/* Falls der initial gesetzte Tab disabled ist → zur ersten aktiven Option springen */
onMounted(() => {
  if (props.items[current.value]?.disabled) {
    const fe = firstEnabledIndex.value
    if (fe >= 0) nextTick(() => setActive(fe, { focus: false }))
  }
})
</script>

<template>
  <div class="ui-tabs" :data-orient="orientation">
    <!-- =========================================
         TABLIST (Buttons sind role="tab")
         ========================================= -->
    <div
      class="ui-tabs__list"
      role="tablist"
      :aria-orientation="orientation"
      @keydown="onKeydownTabs"
    >
      <button
        v-for="(tab, i) in items"
        :key="tabIds[i]"
        :id="tabIds[i]"
        role="tab"
        class="ui-tabs__tab"
        :data-active="current === i ? 'true' : null"
        :data-disabled="tab.disabled ? 'true' : null"
        :aria-selected="current === i ? 'true' : 'false'"
        :tabindex="current === i ? 0 : -1"
        :aria-controls="panelIds[i]"
        :disabled="tab.disabled"
        @click="setActive(i, { focus: false })"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- =========================================
         PANELS (role="tabpanel"), v-show pro Index
         ========================================= -->
    <div class="ui-tabs__panels">
      <section
        v-for="(_, i) in items"
        :key="panelIds[i]"
        :id="panelIds[i]"
        role="tabpanel"
        class="ui-tabs__panel"
        :data-active="current === i ? 'true' : null"
        :aria-labelledby="tabIds[i]"
        v-show="current === i"
      >
        <!-- Inhalte via benanntem Slot: <template #panel-0> ... -->
        <slot :name="`panel-${i}`" />
      </section>
    </div>
  </div>
</template>

<style scoped>
/* =====================================================
   GRUNDLAYOUT
   ===================================================== */
.ui-tabs {
  display: grid;
  gap: 12px;
}

/* =====================================================
   TAB-LEISTE
   ===================================================== */
.ui-tabs__list {
  display: flex;
  gap: 6px;
  /* kein unterer Rahmen – das Panel hat seinen eigenen */
  border-bottom: none;
}

.ui-tabs[data-orient='vertical'] .ui-tabs__list {
  flex-direction: column;
  border-right: none;
}

/* Einzelner Tab-Button */
.ui-tabs__tab {
  appearance: none;
  border: 1px solid transparent;
  background: transparent;
  padding: 8px 12px;
  border-radius: var(--radius-md, 10px) var(--radius-md, 10px) 0 0;
  color: var(--color-fg, #111);
  cursor: pointer;
  font: inherit;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

/* Hover-State */
.ui-tabs__tab:hover {
  background: color-mix(in oklab, var(--color-fg, #111) 8%, transparent);
}

/* Fokus: nutze globalen Fokus-Ring (aus base.css) */
.ui-tabs__tab:focus-visible {
  outline: 0;
  box-shadow: var(--focus-ring, 0 0 0 3px color-mix(in oklab, #2563eb 20%, transparent));
}

/* Aktiver Tab hat „Card“-Look und sitzt optisch vor dem Panel */
.ui-tabs__tab[data-active='true'] {
  background: var(--color-bg, #fff);
  border: 1px solid var(--al-border, #e6e6e6);
  font-weight: 600;
  position: relative;
  z-index: 2;
}

/* Vertikal: abgerundete Kante links */
.ui-tabs[data-orient='vertical'] .ui-tabs__tab {
  border-radius: var(--radius-md, 10px) 0 0 var(--radius-md, 10px);
}
.ui-tabs[data-orient='vertical'] .ui-tabs__tab[data-active='true'] {
  border-right-color: transparent;
}

/* =====================================================
   PANELS (Inhaltsbereich)
   ===================================================== */
.ui-tabs__panels {
  background: var(--color-bg, #fff);
  border: 1px solid var(--al-border, #e6e6e6);
  border-radius: 0 var(--radius-md, 10px) var(--radius-md, 10px) var(--radius-md, 10px);
  padding: 12px;
  box-shadow: var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.06));
  margin-top: 8px;
}

.ui-tabs[data-orient='vertical'] .ui-tabs__panels {
  border-radius: var(--radius-md, 10px);
}

.ui-tabs__panel {
  display: block;
}
</style>
