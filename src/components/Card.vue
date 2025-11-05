<script setup lang="ts">
/* ============================================================================
   CARD (UI-Komponente)
   ----------------------------------------------------------------------------
   Zweck:
   - Container-Komponente für strukturierte Inhalte mit optionalem Header/Footer.
   - Unterstützt drei Varianten:
       → hoverable – hebt sich beim Hover leicht an
       → compact   – geringeres Padding
       → divider   – optische Trennlinien zwischen Header, Body & Footer
   - Nutzt globale Design Tokens für Farben, Schatten und Abstände.
   ============================================================================ */

/** Props mit Defaultwerten */
const {
  hoverable = false,
  compact   = false,
  divider   = true,
} = defineProps<{
  hoverable?: boolean
  compact?: boolean
  divider?: boolean
}>()
</script>

<template>
  <!-- =========================================================================
       TEMPLATE
       -------------------------------------------------------------------------
       Struktur:
       <article> Container
         <header>  optional, über Slot "header"
         <section> Hauptinhalt (default Slot)
         <footer>  optional, über Slot "footer"
       ========================================================================= -->
  <article
    class="ui-card"
    :class="[
      hoverable && 'is-hoverable',
      compact   && 'is-compact',
      divider   && 'has-divider',
    ]"
  >
    <!-- Kopfbereich -->
    <header v-if="$slots.header" class="ui-card__header">
      <slot name="header" />
    </header>

    <!-- Inhaltsbereich -->
    <section class="ui-card__body">
      <slot />
    </section>

    <!-- Fußbereich -->
    <footer v-if="$slots.footer" class="ui-card__footer">
      <slot name="footer" />
    </footer>
  </article>
</template>

<style scoped>
/* ============================================================================
   STYLES
   ----------------------------------------------------------------------------
   Hinweis:
   - Verwendet lokale Variablen (Tokens) für Padding, Radius, Schatten etc.
   - Alle Farben & Schatten kommen aus globalen CSS-Variablen in base.css
   ============================================================================ */

/* ---------------- Grundlayout ---------------- */
.ui-card {
  /* Lokale Tokens (Fallbacks auf globale Variablen) */
  --card-pad: var(--space-md, 16px);
  --card-gap: var(--space-sm, 8px);
  --card-radius: var(--radius-lg, 12px);
  --card-shadow-sm: var(--shadow-sm, 0 1px 3px rgba(0,0,0,.05));
  --card-shadow-md: var(--shadow-md, 0 4px 12px rgba(0,0,0,.10));

  background: var(--color-bg);
  color: var(--color-fg);
  border: 1px solid var(--al-border, #e6e6e6);
  border-radius: var(--card-radius);
  box-shadow: var(--card-shadow-sm);

  transition: box-shadow .18s ease, transform .18s ease, border-color .18s ease;
}

/* ---------------- Spacing & Struktur ---------------- */
.ui-card__header,
.ui-card__body,
.ui-card__footer {
  padding: var(--card-pad);
}

/* Body nutzt Grid für konsistente Abstände */
.ui-card__body {
  display: grid;
  gap: var(--card-gap);
}

/* Header ist etwas betonter */
.ui-card__header {
  font-weight: 600;
}

/* Footer gruppiert Buttons schön */
.ui-card__footer {
  display: flex;
  gap: var(--space-sm, 8px);
  justify-content: flex-end;
  flex-wrap: wrap;
}

/* ---------------- Varianten ---------------- */

/* Trennlinien */
.ui-card.has-divider .ui-card__header {
  border-bottom: 1px solid var(--al-border, #e6e6e6);
}
.ui-card.has-divider .ui-card__footer {
  border-top: 1px solid var(--al-border, #e6e6e6);
}

/* Hover-Lift */
.ui-card.is-hoverable:hover {
  box-shadow: var(--card-shadow-md);
  transform: translateY(-2px);
}

/* Kompakte Variante (weniger Padding) */
.ui-card.is-compact {
  --card-pad: var(--space-sm, 8px);
}

/* ---------------- Fokus & A11y ---------------- */
.ui-card:focus-within {
  outline: 2px solid color-mix(in srgb, var(--color-primary, #2563eb) 40%, transparent);
  outline-offset: 2px;
  border-color: color-mix(in srgb, var(--color-primary, #2563eb) 40%, var(--al-border));
}

/* ---------------- Dark Mode ---------------- */
:root[data-theme="dark"] .ui-card {
  box-shadow: none;
  border-color: color-mix(in srgb, var(--al-border, #2a2a2a) 80%, transparent);
}

:root[data-theme="dark"] .ui-card.is-hoverable:hover {
  box-shadow: 0 10px 28px rgba(0, 0, 0, .45);
}

/* ---------------- Reduced Motion Support ---------------- */
@media (prefers-reduced-motion: reduce) {
  .ui-card {
    transition: border-color .18s ease;
  }
  .ui-card.is-hoverable:hover {
    transform: none;
  }
}
</style>
