<script setup lang="ts">
/**
 * Modal.vue — Dialog-Komponente (Designsystem light)
 *
 * Ziele:
 * - Öffnen/Schließen per v-model:open
 * - Fokus springt beim Öffnen in das Modal (Fokusaufnahme)
 * - ESC schließt den Dialog (Tastaturbedienung)
 * - Klick auf Backdrop schließt (Option für leichte Bedienbarkeit)
 *
 * A11y:
 * - Rolle `dialog` + `aria-modal="true"`
 * - `aria-labelledby` verknüpft Titel und Dialog
 * - **kein vollständiger Fokus-Trap**: Tab bewegt sich nicht zyklisch,
 *   sondern verlässt das Modal. (Für ein leichtgewichtiges Designsystem gewollt.)
 */
import { ref, watch, onMounted, onBeforeUnmount, nextTick, computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  closeOnEsc?: boolean
  closeOnBackdrop?: boolean
  size?: 'sm' | 'md' | 'lg'
  id?: string
}>(), {
  closeOnEsc: true,
  closeOnBackdrop: true,
  size: 'md'
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'open'): void
  (e: 'close'): void
}>()

/** v-model Proxy */
const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

/** Stabile IDs für A11y */
const rootId  = props.id ?? `modal-${Math.random().toString(36).slice(2, 8)}`
const titleId = `${rootId}-title`

/** Refs + Fokusverwaltung */
const dialogRef   = ref<HTMLDivElement | null>(null)
let prevFocused: Element | null = null

function close() { open.value = false }

/** ESC & Fokus-Trap */
function onKeydown(e: KeyboardEvent) {
  if (!open.value) return

  // ESC zum Schließen (optional)
  if (props.closeOnEsc && e.key === 'Escape') {
    e.preventDefault()
    close()
  }

  // Fokus-Trap mit Tab/Shift+Tab
  if (e.key === 'Tab') {
    const nodes = getFocusable()
    if (!nodes.length) return
    const first = nodes[0]
    const last  = nodes[nodes.length - 1]
    const active = document.activeElement

    if (e.shiftKey && active === first) {
      e.preventDefault(); (last as HTMLElement).focus()
    } else if (!e.shiftKey && active === last) {
      e.preventDefault(); (first as HTMLElement).focus()
    }
  }
}

/** Fokus-fähige Elemente im Dialog */
function getFocusable(): HTMLElement[] {
  const root = dialogRef.value
  if (!root) return []
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',')
  return Array
    .from(root.querySelectorAll<HTMLElement>(selector))
    .filter(el => el.offsetParent !== null || el === document.activeElement)
}

/** Backdrop-Klick → schließen (nur wenn Klick außerhalb des Dialogs) */
function handleBackdrop(e: MouseEvent) {
  if (!props.closeOnBackdrop) return
  if (e.target && e.target === e.currentTarget) close()
}

/** Öffnen/Schließen beobachten: Scroll-Lock, Fokus setzen/zurückgeben */
watch(() => props.modelValue, async (v) => {
  if (v) {
    prevFocused = document.activeElement
    // Scroll sperren
    document.documentElement.style.overflow = 'hidden'
    await nextTick()
    // Fokus auf erstes fokussierbares Element (oder Dialog) setzen
    const focusables = getFocusable()
    ;(focusables[0] ?? dialogRef.value)?.focus()
    emit('open')
  } else {
    // Scroll freigeben & Fokus zurück
    document.documentElement.style.overflow = ''
    if (prevFocused instanceof HTMLElement) prevFocused.focus()
    emit('close')
  }
})

/** Globale Keydown-Listener nur einmal registrieren */
onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.documentElement.style.overflow = '' // Fallback: Lock immer lösen
})
</script>

<template>
  <!-- In den Body teleportieren, damit Overlay immer oben liegt -->
  <teleport to="body">
    <!-- Overlay (Backdrop) -->
    <div
      v-show="open"
      class="ui-modal__overlay"
      role="presentation"
      @mousedown="handleBackdrop"
    >
      <!-- Dialog -->
      <div
        class="ui-modal"
        :data-size="size"
        ref="dialogRef"
        role="dialog"
        :aria-modal="'true'"
        :aria-labelledby="title ? titleId : undefined"
        tabindex="-1"
      >
        <!-- Header -->
        <header class="ui-modal__header">
          <h3 v-if="title" class="ui-modal__title" :id="titleId">{{ title }}</h3>
          <button
            class="ui-modal__close"
            type="button"
            aria-label="Schließen"
            @click="close"
          >
            ✕
          </button>
        </header>

        <!-- Body -->
        <section class="ui-modal__body">
          <slot />
        </section>

        <!-- Footer (optional via Slot) -->
        <footer v-if="$slots.footer" class="ui-modal__footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
/* =====================================================================
   OVERLAY (Backdrop)
   ===================================================================== */
.ui-modal__overlay{
  position: fixed;
  inset: 0;
  /* dunkler, transparenter Schleier; nutzt Textfarbe für konsistente Tönung */
  background: color-mix(in oklab, var(--color-fg, #111) 60%, transparent);
  display: grid;
  place-items: center;
  padding: 24px;
  z-index: 1000;
}

/* =====================================================================
   DIALOG (Container)
   ===================================================================== */
.ui-modal{
  /* Design-Tokens (überschreibbar) */
  --modal-bg: var(--color-bg, #fff);
  --modal-fg: var(--color-fg, #111);
  --modal-radius: var(--radius-lg, 16px);
  --modal-border: color-mix(in oklab, var(--color-fg, #111) 12%, transparent);
  --modal-shadow: var(--shadow-lg, 0 12px 30px rgba(0,0,0,.18));

  color: var(--modal-fg);
  background: var(--modal-bg);
  border-radius: var(--modal-radius);
  border: 1px solid var(--modal-border);
  box-shadow: var(--modal-shadow);

  width: 100%;
  max-height: 90vh;
  overflow: auto;
  outline: none;

  /* kleine, angenehme Ein-/Ausblendung (ohne transform-conflicts) */
  transition: opacity .18s ease, transform .18s ease;
  opacity: 1;
  transform: translateY(0);
}

/* Größenvarianten */
.ui-modal[data-size="sm"]{ max-width: 420px; }
.ui-modal[data-size="md"]{ max-width: 640px; }
.ui-modal[data-size="lg"]{ max-width: 860px; }

/* =====================================================================
   ABSCHNITTE
   ===================================================================== */
.ui-modal__header,
.ui-modal__footer{
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.ui-modal__header{
  border-bottom: 1px solid var(--modal-border);
  justify-content: space-between;
}

.ui-modal__footer{
  border-top: 1px solid var(--modal-border);
  justify-content: flex-end;
  gap: 10px;
}

.ui-modal__body{
  padding: 18px;
}

/* Titel */
.ui-modal__title{
  margin: 0;
  font-size: 1.05rem;
}

/* Schließen-Button */
.ui-modal__close{
  border: 1px solid transparent;
  border-radius: 10px;
  background: color-mix(in oklab, var(--color-bg, #fff) 85%, var(--color-fg, #111));
  color: var(--color-fg, #111);
  padding: 6px 10px;
  cursor: pointer;
}

.ui-modal__close:hover{
  border-color: color-mix(in oklab, var(--color-fg, #111) 20%, transparent);
}

.ui-modal__close:focus-visible{
  outline: 0;
  /* nutzt globalen Fokus-Ring, falls vorhanden */
  box-shadow: var(--focus-ring, 0 0 0 3px color-mix(in oklab, #2563eb 20%, transparent));
}
</style>
