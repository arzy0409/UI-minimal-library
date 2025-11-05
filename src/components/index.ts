/* ============================================================================
   Komponenten-Barrel
   ----------------------------------------------------------------------------
   Zweck:
   - Zentrale Export-Stelle für alle UI-Komponenten
   - Erlaubt kurze Import-Pfade wie: import { UiButton, UiCard } from '@/components'
   - Unterstützt Tree-Shaking (nur tatsächlich genutzte Komponenten werden gebündelt)

   ============================================================================ */

// Basis-Elemente
export { default as UiAlert }   from './Alert.vue'
export { default as UiBadge }   from './Badge.vue'
export { default as UiButton }  from './Button.vue'
export { default as UiCard }    from './Card.vue'
export { default as UiInput }   from './Input.vue'
export { default as UiModal }   from './Modal.vue'
export { default as UiSelect }  from './Select.vue'
export { default as UiSwitch }  from './Switch.vue'
export { default as UiTabs }    from './Tabs.vue'
export { default as UiTooltip } from './Tooltip.vue'