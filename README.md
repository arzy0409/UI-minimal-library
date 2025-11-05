# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

# 🧩 UI-Minimal Library

Eine minimalistische, komponentenbasierte **UI-Library für Vue 3 + TypeScript**, aufgebaut auf **Design Tokens** mit Unterstützung für **Light/Dark Mode** und **Accessibility (A11y)**.

---

## ✨ Features

- 🎨 Einheitliches Design-System auf Basis globaler Tokens
- 🌓 Automatischer Theme-Switch (Light/Dark)
- 🧱 Wiederverwendbare Komponenten:
  - Buttons (Primary/Neutral)
  - Cards mit Header/Footer-Slots
  - Inputs mit Validierung
  - Switches (v-model gesteuert)
  - Select-Dropdowns mit Tastaturnavigation
  - Modal-Dialoge mit Fokus-Trap
  - Badges (Info, Warning, Success, Error)
  - Alerts mit Rollen & Schließen-Button
  - Tooltips (top/bottom/left/right)
  - Tabs mit ARIA-Integration
- ♿ Fokus-Ringe und Keyboard-Navigation
- 🧩 Kompatibel mit Vite & TypeScript

---

## 🧠 Architektur

```
Frontend (Vue 3 + Vite + TypeScript)
│
├── Komponenten
│   ├── Button.vue
│   ├── Card.vue
│   ├── Input.vue
│   ├── Switch.vue
│   ├── Select.vue
│   ├── Modal.vue
│   ├── Tooltip.vue
│   ├── Tabs.vue
│   ├── Alert.vue
│   └── Badge.vue
│
├── Tokens
│   └── style-dictionary.config.mjs
│
└── Demo-App
    └── src/App.vue (Live-Komponentenvorschau)
```

---

## 🚀 Installation

```bash
# Repository klonen
git clone https://github.com/arqy0409/ui-minimal-library.git

# Abhängigkeiten installieren
npm install

# Lokale Vorschau starten
npm run dev
```

Anschließend öffne **http://localhost:5173** im Browser.

---

## 🧩 Komponentenübersicht

| Komponente | Beschreibung |
|-------------|---------------|
| **Button** | Einheitliche Buttons mit Fokus-States und Varianten |
| **Card** | Container mit Header/Footer-Slots |
| **Input** | Textfelder mit Label & Fehlermeldungen |
| **Switch** | Toggle-Schalter für binäre Optionen |
| **Select** | Dropdown mit Tastatursteuerung |
| **Modal** | Dialog mit Fokus-Trap & ESC-Schließen |
| **Tooltip** | Kontext-Hinweise bei Hover oder Fokus |
| **Tabs** | Strukturierte Inhaltsnavigation |
| **Badge** | Kleine Statusindikatoren |
| **Alert** | Hinweise mit Varianten & Rollen |

---

## 🎨 Design Tokens

Die Library basiert auf **Design Tokens** für Farben, Abstände, Radius und Schatten.

Beispiel:

```css
:root {
  --color-bg-light: #ffffff;
  --color-bg-dark: #0b0f14;
  --radius-md: 8px;
  --space-sm: 8px;
  --space-md: 16px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,.08);
}
```

Tokens werden über `style-dictionary` generiert.

---

## 🌗 Themes

Das Theme (Light/Dark) wird automatisch aus `localStorage` geladen und kann per Button gewechselt werden.

```ts
const theme = ref<'light' | 'dark'>('light')
watchEffect(() => {
  document.documentElement.dataset.theme = theme.value
})
```

---

## 🧱 Beispiel: Tooltip

```vue
<UiTooltip content="Warnung" position="left">
  <UiBadge variant="warning">Warnung</UiBadge>
</UiTooltip>
```

---

## 🧩 Ziel des Projekts

Diese Library wurde entwickelt, um **minimalistische, barrierefreie und modulare** UI-Komponenten zu schaffen,
die einfach in Vue 3-Projekte integriert werden können — ideal für Lernzwecke oder kleine Projekte.

---

## 🤝 Beitrag & Erweiterung

Pull Requests, Issues oder Verbesserungsvorschläge sind willkommen!  
Falls du Ideen für neue Komponenten hast, öffne gerne ein Issue.

---

## 📜 Lizenz

MIT License © 2025 — UI-Minimal Library by arqy0409
