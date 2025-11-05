<script setup lang="ts">
/* =====================================================================
   HELLO WORLD (Demo-Komponente)
   ---------------------------------------------------------------------
   Zweck:
   - Beispielkomponente aus dem Standard-Vite/Vue-Template
   - Zeigt Reaktivität (ref), Props, Events und Hot Module Replacement (HMR)
   ===================================================================== */

import { ref } from 'vue'

/** Props: Eine einfache Eingabe-Nachricht */
defineProps<{ msg: string }>()

/** Reaktive Zählvariable */
const count = ref(0)
</script>

<template>
  <!-- Überschrift -->
  <h1>{{ msg }}</h1>

  <!-- Card-Bereich mit Button -->
  <div class="card">
    <button type="button" @click="count++">
      count is {{ count }}
    </button>

    <p>
      Bearbeite
      <code>components/HelloWorld.vue</code>, um HMR (Hot Module Reload) zu testen.
    </p>
  </div>

  <!-- Lernlinks -->
  <p>
    Schau dir
    <a
      href="https://vuejs.org/guide/quick-start.html#local"
      target="_blank"
      rel="noopener"
    >
      create-vue
    </a>
    an — das offizielle Vue + Vite Starterprojekt.
  </p>

  <p>
    Erfahre mehr über IDE-Unterstützung für Vue im
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      rel="noopener"
    >
      Vue Docs Scaling Up Guide
    </a>.
  </p>

  <p class="read-the-docs">
    Klicke auf die Vite- und Vue-Logos, um mehr zu erfahren.
  </p>
</template>

<style scoped>
/* =====================================================================
   STYLES
   ===================================================================== */

/* dezente graue Farbe für den Hilfetext */
.read-the-docs {
  color: #888;
}

/* Beispiel für leichtes Card-Styling */
.card {
  padding: 1rem;
  border-radius: 8px;
  background: color-mix(in oklab, var(--color-bg, #fff) 90%, #000);
  box-shadow: var(--shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05));
  display: inline-block;
}

button {
  background: var(--color-primary, #2563eb);
  color: #fff;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease;
}

button:hover {
  background: color-mix(in oklab, var(--color-primary, #2563eb) 85%, #000);
}
</style>
