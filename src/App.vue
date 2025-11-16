<script setup lang="ts">
/* ==========================================================
   IMPORTS
   ========================================================== */
import { ref, computed, watchEffect, onMounted } from 'vue'
import {
  UiButton, UiCard, UiInput, UiSwitch, UiSelect,
  UiBadge, UiAlert, UiTooltip, UiTabs, UiModal
} from './components'

/* ==========================================================
   THEME HANDLING (Light / Dark)
   ========================================================== */
const theme = ref<'light' | 'dark'>('light')

// Lade gespeichertes Theme aus localStorage
onMounted(() => {
  const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
  if (saved) theme.value = saved
})

// Synchronisiere Theme-Attribut und Speichern
watchEffect(() => {
  document.documentElement.dataset.theme = theme.value
  localStorage.setItem('theme', theme.value)
})

// Umschalten zwischen Light & Dark Mode
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

/* ==========================================================
   BUTTON-AKTIONEN
   ========================================================== */
const onPrimaryClick = () => window.alert('Klick!')

/* ==========================================================
   INPUTS
   ========================================================== */
const firstName = ref('Max')
const email = ref('')
const emailError = computed(() =>
  email.value && !email.value.includes('@')
    ? 'Bitte gültige E-Mail eingeben'
    : null
)

/* ==========================================================
   SWITCHES
   ========================================================== */
const notifications = ref(true)
const autoSave = ref(false)
const isDarkMode = computed({
  get: () => theme.value === 'dark',
  set: (v) => (theme.value = v ? 'dark' : 'light')
})

/* ==========================================================
   SELECT-FELD
   ========================================================== */
const countries = [
  { label: 'Deutschland', value: 'DE' },
  { label: 'Österreich', value: 'AT' },
  { label: 'Schweiz', value: 'CH' },
  { label: 'Italien (disabled)', value: 'IT', disabled: true }
]
const country = ref<string | null>(null)
const countryError = computed(() => (country.value ? null : 'Bitte Land wählen'))

/* ==========================================================
   MODAL
   ========================================================== */
const showModal = ref(false)

/* ==========================================================
   TABS
   ========================================================== */
type TabItem = { label: string; value: number }
const tabs: TabItem[] = [
  { label: 'Allgemein', value: 0 },
  { label: 'Details', value: 1 },
  { label: 'Einstellungen', value: 2 }
]
const tabIndex = ref<number>(0)

/* ==========================================================
   LOGIK: Nur ein Accordion pro Zeile offen
   ========================================================== */
onMounted(() => {
  const accordions = Array.from(
    document.querySelectorAll<HTMLDetailsElement>('.tool-grid .acc')
  )

  accordions.forEach((acc, idx) => {
    acc.addEventListener('toggle', () => {
      if (acc.open) {
        const columns = getComputedStyle(acc.parentElement!).gridTemplateColumns.split(' ').length
        const rowIndex = Math.floor(idx / columns)

        // Schließe alle anderen in derselben Zeile
        accordions.forEach((other, j) => {
          const otherRow = Math.floor(j / columns)
          if (j !== idx && otherRow === rowIndex) other.open = false
        })
      }
    })
  })
})
</script>

<template>
  <main class="ui-demo">
    <div class="ui-demo__container">
      <!-- =====================================================
           HERO-BEREICH
           ===================================================== -->
      <header class="hero">
        <h1>Willkommen zur Minimalistic UI Component Library</h1>
        <p class="lead">
          Eine kleine, konsistente Komponenten-Sammlung auf Basis von Design-Tokens.
        </p>
        <div class="hero-line" />
      </header>

      <!-- =====================================================
           TOOL GRID (Alle Komponenten-Demos)
           ===================================================== -->
      <section class="tools">
        <div class="tool-grid">

          <!-- ================== 1) CARDS ================== -->
          <details class="acc">
            <summary class="acc__summary">Cards</summary>
            <div class="acc__body">
              <p class="acc__desc">
                Container mit Kopf-/Fußbereich, konsistentem Spacing und optionalem Hover-Lift.
              </p>

              <UiCard hoverable>
                <template #header>Minimal Card</template>
                <p>
                  Diese Card nutzt die globalen Design Tokens (Farben, Radius, Schatten).
                  Sie unterstützt <b>Light/Dark</b>, hat Header/Footer-Slots und eine Hover-Erhöhung.
                </p>
                <template #footer>
                  <UiButton variant="neutral">Abbrechen</UiButton>
                  <UiButton>Bestätigen</UiButton>
                </template>
              </UiCard>
            </div>
          </details>

          <!-- ================== 2) BUTTONS & THEME ================== -->
          <details class="acc">
            <summary class="acc__summary">Buttons & Theme</summary>
            <div class="acc__body stack-sm">
              <p class="acc__desc">
                Primär/Neutral/Disabled-Buttons und ein Theme-Umschalt-Button (Light/Dark).
              </p>

              <UiButton @click="toggleTheme">
                Switch to {{ theme === 'light' ? 'Dark' : 'Light' }} Mode
              </UiButton>

              <div class="row-sm">
                <UiButton @click="onPrimaryClick">Primary</UiButton>
                <UiButton variant="neutral">Neutral</UiButton>
                <UiButton :disabled="true">Disabled</UiButton>
              </div>
            </div>
          </details>

          <!-- ================== 3) INPUT ================== -->
          <details class="acc">
            <summary class="acc__summary">Input</summary>
            <div class="acc__body stack-sm">
              <p class="acc__desc">
                Textfelder mit Label, Typen (z. B. E-Mail) und Validierung.
              </p>

              <UiInput label="Vorname" placeholder="Max" v-model="firstName" />

              <UiInput
                label="E-Mail"
                type="email"
                placeholder="max@example.com"
                :error="emailError"
                v-model="email"
              />

              <div class="row-sm" style="justify-content:flex-end">
                <UiButton variant="neutral">Abbrechen</UiButton>
                <UiButton :disabled="!!emailError">Speichern</UiButton>
              </div>
            </div>
          </details>

          <!-- ================== 4) SWITCHES ================== -->
          <details class="acc">
            <summary class="acc__summary">Switches</summary>
            <div class="acc__body">
              <p class="acc__desc">
                Binäre Einstellungen mit <code>v-model</code>; Label, Tastatursteuerung und Fokus-States.
              </p>
              <UiSwitch v-model="notifications" label="Benachrichtigungen aktivieren" />
              <UiSwitch v-model="autoSave" label="Automatisches Speichern" />
              <UiSwitch v-model="isDarkMode" label="Dark Mode" />
            </div>
          </details>

          <!-- ================== 5) SELECT ================== -->
          <details class="acc">
            <summary class="acc__summary">Select</summary>
            <div class="acc__body stack-sm">
              <p class="acc__desc">
                Dropdown mit Optionen, Placeholder und deaktivierten Einträgen.
              </p>

              <UiSelect
                v-model="country"
                :options="countries"
                label="Land"
                placeholder="Land auswählen…"
                :error="countryError"
              />

              <div class="row-sm" style="justify-content:flex-end">
                <UiButton variant="neutral" @click="country = null">Zurücksetzen</UiButton>
                <UiButton :disabled="!!countryError">Weiter</UiButton>
              </div>
            </div>
          </details>

          <!-- ================== 6) MODAL ================== -->
          <details class="acc">
            <summary class="acc__summary">Modal</summary>
            <div class="acc__body">
              <p class="acc__desc">
                Ein modaler Dialog mit Fokus-Trap, ESC-Schließen und Backdrop-Klick.
              </p>

              <UiButton @click="showModal = true">Modal öffnen</UiButton>

              <UiModal v-model="showModal" title="Einstellungen" size="md">
                <p>
                  Hier kannst du Optionen festlegen. Der Fokus bleibt im Dialog.
                  ESC oder ✕ schließt.
                </p>
                <template #footer>
                  <UiButton variant="neutral" @click="showModal = false">Abbrechen</UiButton>
                  <UiButton @click="showModal = false">Speichern</UiButton>
                </template>
              </UiModal>
            </div>
          </details>

          <!-- ================== 7) BADGES ================== -->
          <details class="acc">
            <summary class="acc__summary">Badges</summary>
            <div class="acc__body stack-sm">
              <p class="acc__desc">
                Kleine Statusindikatoren mit Varianten, Größen und „pill“-Form.
              </p>
              <div class="row-sm" style="flex-wrap:wrap">
                <UiBadge>Neutral</UiBadge>
                <UiBadge variant="info">Info</UiBadge>
                <UiBadge variant="success">Success</UiBadge>
                <UiBadge variant="warning">Warnung</UiBadge>
                <UiBadge variant="error">Fehler</UiBadge>
                <UiBadge size="sm">Klein</UiBadge>
                <UiBadge :pill="false">Eckig</UiBadge>
              </div>
            </div>
          </details>

          <!-- ================== 8) ALERTS ================== -->
          <details class="acc">
            <summary class="acc__summary">Alerts</summary>
            <div class="acc__body stack-sm">
              <p class="acc__desc">
                Informations- und Statusmeldungen mit Varianten.
              </p>
              <UiAlert title="Hinweis">Dies ist eine neutrale Information.</UiAlert>
              <UiAlert variant="info" title="Info">Neue Version verfügbar.</UiAlert>
              <UiAlert variant="success" title="Erfolg">Einstellungen gespeichert.</UiAlert>
              <UiAlert variant="warning" title="Warnung">Bitte Eingaben prüfen.</UiAlert>
              <UiAlert variant="error" title="Fehler" role="alert" dismissible>
                Speichern fehlgeschlagen.
              </UiAlert>
            </div>
          </details>

          <!-- ================== 9) TOOLTIP ================== -->
          <details class="acc">
            <summary class="acc__summary">Tooltip</summary>
            <div class="acc__body">
              <p class="acc__desc" style="color: var(--color-fg);">
                Tooltips liefern knappe Kontexthinweise auf Hover oder Fokus.
              </p>

              <div class="row-sm" style="align-items:center; flex-wrap:wrap">
                <UiTooltip content="Primäre Aktion" position="top">
                  <UiButton>Primary</UiButton>
                </UiTooltip>

                <UiTooltip content="Neutraler Button" position="bottom">
                  <UiButton variant="neutral">Neutral</UiButton>
                </UiTooltip>

                <UiTooltip content="Achtung!" position="left">
                  <UiBadge variant="warning">Warnung</UiBadge>
                </UiTooltip>

                <UiTooltip content="Information" position="right">
                  <UiBadge variant="info">Info</UiBadge>
                </UiTooltip>
              </div>
            </div>
          </details>

          <!-- ================== 10) TABS ================== -->
          <details class="acc">
            <summary class="acc__summary">Tabs</summary>
            <div class="acc__body stack-sm">
              <p class="acc__desc">
                Register zur Strukturierung von Inhalten – gesteuert per Index über <code>v-model</code>.
              </p>

              <UiTabs v-model="tabIndex" :items="tabs">
                <template #panel-0>
                  <p>Allgemeine Informationen und Einleitung.</p>
                </template>
                <template #panel-1>
                  <p>Detailansicht mit mehr Inhalt.</p>
                </template>
                <template #panel-2>
                  <p>Einstellungen – hier könntest du weitere Controls einbauen.</p>
                </template>
              </UiTabs>
            </div>
          </details>
        </div>
      </section>

      <!-- =====================================================
           FOOTER
           ===================================================== -->
      <footer class="site-footer" role="contentinfo" aria-label="Seitenfuß">
        <span>UI-Minimal Library · v0.1</span>
        <span>Design-Tokens · Light/Dark · A11y</span>
        <a
          href="https://github.com/arzy0409/UI-minimal-library"
          target="_blank"
          rel="noopener"
          aria-label="Repository"
        >
          Repository
        </a>
      </footer>
    </div>
  </main>
</template>
