# UI-Minimal Library

**UI-Minimal** ist eine leichtgewichtige, komponentenbasierte **UI-Library für Vue 3 + TypeScript**,  
aufgebaut auf einem **Design-Token-System** mit Unterstützung für **Light/Dark-Mode** und **Accessibility (A11y)**.  

Die Library dient als technisches Fundament für minimalistische Benutzeroberflächen – modular, barrierearm und optisch konsistent.

---

## Features

- Einheitliches **Design-System** auf Basis globaler Tokens  
- Unterstützung für **Light- und Dark-Mode** (per `data-theme`)  
- Sauber strukturierte **Vue-3-Komponenten** mit TypeScript  
- Wiederverwendbare UI-Elemente:
  - **Buttons** (Varianten, Fokus- und Disabled-Zustände)
  - **Cards** mit Header- und Footer-Slots
  - **Inputs** mit Label- und Validierungszuständen
  - **Switches** (`v-model`-gesteuert)
  - **Select-Dropdowns** mit Tastatursteuerung
  - **Modal-Dialoge** mit Fokus-Verhalten
  - **Tooltips**, **Tabs**, **Badges** und **Alerts**
- Vollständig kompatibel mit **Vite + TypeScript**

---

## Architektur

```
ui-minimal-library/
│
├─ src/
│  ├─ components/
│  │  ├─ Button.vue
│  │  ├─ Card.vue
│  │  ├─ Input.vue
│  │  ├─ Switch.vue
│  │  ├─ Select.vue
│  │  ├─ Modal.vue
│  │  ├─ Tooltip.vue
│  │  ├─ Tabs.vue
│  │  ├─ Alert.vue
│  │  └─ Badge.vue
│  ├─ App.vue            # Demo-Ansicht aller Komponenten
│  ├─ main.ts            # Einstieg & Theme-Mount
│  └─ style.css          # Globale Styles & Layout
│
├─ tokens/
│  ├─ tokens.css         # CSS-Variablen
│  ├─ tokens.json        # Style-Dictionary-Quelle
│  └─ base.css           # Erweiterte Design-Tokens (Fokus, Tooltips, Layout)
│
└─ vite.config.ts
```

---

## Installation & Entwicklung

```bash
# Repository klonen
git clone https://github.com/arzy0409/UI-Minimal-Library.git
cd UI-Minimal-Library

# Abhängigkeiten installieren
npm install

# Lokale Vorschau starten
npm run dev
```

> Nach dem Start des Dev-Servers kann die Vorschau im Browser geöffnet werden.  
> (Standardmäßig über den lokalen Vite-Server.)

---

## Komponentenübersicht

| Komponente | Beschreibung |
|-------------|--------------|
| **Button** | Einheitliche Buttons mit Fokus-States, Hover-Effekten und deaktiviertem Zustand |
| **Card** | Container mit optionalen Header- und Footer-Slots |
| **Input** | Textfelder mit Label, Validierung und Fehlerzustand |
| **Switch** | Binärer Umschalter mit `v-model`-Binding |
| **Select** | Dropdown mit Tastaturnavigation |
| **Modal** | Dialog mit Fokus-Verhalten |
| **Tooltip** | Kontext-Hinweis mit Positionierung |
| **Tabs** | Strukturierte Inhaltsnavigation |
| **Badge** | Statusindikator in verschiedenen Varianten |
| **Alert** | Hinweis- oder Warnmeldung mit Schließen-Button |

---

## Design Tokens

Die gesamte Library basiert auf **Design-Tokens**, die zentrale Farb-, Abstands- und Typografie-Werte definieren.  

Beispiel (`tokens.css`):

```css
:root {
  --color-bg-light: #ffffff;
  --color-bg-dark:  #0b0f14;

  --color-fg-light: #0b0f14;
  --color-fg-dark:  #e8eef5;

  --color-primary-500: #2563eb;
  --color-primary-600: #1d4ed8;

  --radius-md: 8px;
  --space-sm: 8px;
  --space-md: 16px;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, .08);
}
```

Die Werte werden durch **Style Dictionary** generiert (`tokens.json`) und automatisch in CSS-Variablen exportiert.

---

## Light / Dark Mode

Das Theme-System arbeitet mit dem globalen `data-theme`-Attribut.  
In `main.ts` wird die Root-Instanz geladen, während der aktive Modus (light / dark) über CSS-Tokens gesteuert wird:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).mount('#app')
```

```css
:root[data-theme="dark"] {
  --color-bg: #1c1c1c;
  --color-fg: #f6f6f6;
}
```

Das Umschalten kann direkt über das Attribut erfolgen, z. B.:

```js
document.documentElement.dataset.theme = 'dark'
```

---

## Beispiel: Tooltip-Verwendung

Auszug aus der `App.vue`-Demo:

```vue
<UiTooltip content="Warnung" position="left">
  <UiBadge variant="warning">Warnung</UiBadge>
</UiTooltip>
```

Dieses Beispiel zeigt, wie Tooltips über eigene Tokens (Hintergrund, Schatten, Textfarbe) konsistent gestylt sind.

---

## Accessibility (A11y)

- Sichtbare **Fokus-Ringe** über globale Tokens (`base.css`)  
- Grundlegende **Tastaturnavigation** (Tab-Fokus auf allen interaktiven Elementen)  
- Farben und Kontraste werden zentral über Tokens gesteuert  
- Unterstützung für **Reduced Motion** (Deaktivierung von Transitionen bei Bedarf)  
- Komponenten sind **für ARIA-Integration vorbereitet**

> Hinweis: Erweiterte Funktionen wie Fokus-Traps oder rollenbasierte ARIA-Attribute sind derzeit noch in Entwicklung.

---

## Style-Architektur

Globale Layout- und Komponentenstile befinden sich in `base.css` und `style.css`.  
Diese Dateien enthalten:
- Tokens für Fokus-Ringe, Abstände, Schatten  
- Utility-Klassen (`.stack-sm`, `.row-sm`)  
- Responsive Grids & Accordion-Strukturen  
- Farbanpassungen für den Dark Mode  

---

## Verwendung in eigenen Projekten

1. Komponenten importieren:
   ```ts
   import { UiButton, UiCard, UiTooltip } from 'ui-minimal-library'
   ```
2. Tokens in das eigene Stylesheet einbinden:
   ```css
   @import 'ui-minimal-library/tokens.css';
   @import 'ui-minimal-library/base.css';
   ```
3. Theme setzen (optional):
   ```js
   document.documentElement.dataset.theme = 'dark';
   ```

---

## 🤝 Beitrag & Erweiterung

Beiträge, Pull Requests und Verbesserungsvorschläge sind willkommen.  
Neue Komponenten oder Token-Erweiterungen können über ein Issue oder PR vorgeschlagen werden.

---
