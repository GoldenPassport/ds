# @golden-passport/ds

Golden Passport Design System — React component library built on **Tailwind CSS v4**, **Headless UI v2**, and **Lucide icons**.

---

## Contents

- [Install](#install)
- [Setup](#setup)
- [Components](#components)
- [Usage examples](#usage-examples)
- [Theming & branding overrides](#theming--branding-overrides)
- [Design tokens (JS)](#design-tokens-js)
- [Storybook](#storybook)
- [Publishing](#publishing)

---

## Install

```bash
pnpm add @golden-passport/ds @headlessui/react lucide-react
```

**Peer dependencies** — install these in your app if not already present:

```bash
pnpm add react react-dom tailwindcss
```

> Requires React ≥ 18, Tailwind CSS ≥ 4, Headless UI ≥ 2.

---

## Setup

### 1. Import the base CSS

In your app's root CSS file (the one processed by Tailwind):

```css
/* app/globals.css  —or—  src/index.css */
@import "@golden-passport/ds/styles";
```

This single import gives you:
- All color scales (`gold-*`, `ink-*`, `slate-*`) as Tailwind utilities
- Typography (`font-display`, `font-body`, `font-mono`)
- Radius, shadow, and animation tokens
- Class-based dark mode (`dark:` variant driven by the `.dark` class on `<html>`)
- Utility classes: `gp-focus` (gold focus ring), `gp-ai-dot` (pulsing AI indicator)

#### Next.js

```tsx
// app/layout.tsx
import '@golden-passport/ds/styles';
```

#### Vite / CRA

```tsx
// src/main.tsx
import '@golden-passport/ds/styles';
```

---

### 2. Load fonts

The design system uses three typefaces. Add them to your `<head>` via Google Fonts:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

Or self-host via Fontsource (avoids the Google Fonts request):

```bash
pnpm add @fontsource/plus-jakarta-sans @fontsource/dm-sans @fontsource/jetbrains-mono
```

```ts
// src/main.tsx
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/jetbrains-mono/400.css';
```

---

### 3. Enable dark mode

Dark mode is driven by the `dark` class on `<html>` — not `prefers-color-scheme`. Toggle it wherever you manage theme state:

```ts
// React example — wire this to your theme toggle
document.documentElement.classList.toggle('dark', isDarkMode);
```

---

## Components

| Component   | Headless UI   | Description |
|-------------|---------------|-------------|
| `Button`    | —             | Primary, secondary, ghost, danger · sm/md/lg · loading spinner |
| `Badge`     | —             | Status pill: active, running, pending, draft, failed, ai, warning, neutral |
| `Avatar`    | —             | Gold-gradient initials avatar, configurable size |
| `Input`     | —             | Text input with label, hint, error state, gold focus ring |
| `Toggle`    | `Switch`      | Accessible on/off switch, gold when active |
| `Select`    | `Listbox`     | Single-select dropdown with animated panel |
| `Menu`      | `Menu`        | Action dropdown for ⋯ / context menus with optional destructive items |
| `Dialog`    | `Dialog`      | Modal with focus trap, backdrop, animated entry |
| `Tabs`      | `TabGroup`    | Keyboard-navigable tab strip |
| `Combobox`  | `Combobox`    | Searchable select with real-time filtering |
| `Tooltip`   | floating-ui   | Hover label with configurable placement |
| `DataTable` | —             | Sortable table with column headers and row selection |

---

## Usage examples

### Button

```tsx
import { Button } from '@golden-passport/ds';

// Variants
<Button variant="primary">Run Workflow</Button>
<Button variant="secondary">Save Draft</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="danger">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>  {/* default */}
<Button size="lg">Large</Button>

// Loading state
<Button loading>Deploying…</Button>

// Disabled
<Button disabled>Unavailable</Button>
```

### Badge

```tsx
import { Badge } from '@golden-passport/ds';

<Badge label="Active"   variant="active"  />   // green dot
<Badge label="Running"  variant="running" />   // gold dot
<Badge label="Pending"  variant="pending" />   // blue dot
<Badge label="Failed"   variant="failed"  />   // red dot
<Badge label="Draft"    variant="draft"   />   // grey dot
<Badge label="AI"       variant="ai"      />   // slate chip, no dot
<Badge label="Warning"  variant="warning" />   // amber dot
```

### Avatar

```tsx
import { Avatar } from '@golden-passport/ds';

<Avatar name="Alex Morgan" />           // 32px default
<Avatar name="Alex Morgan" size={48} /> // custom size
```

### Input

```tsx
import { Input } from '@golden-passport/ds';

<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  hint="We'll never share your email."
/>

// Error state
<Input
  label="API Key"
  value={key}
  onChange={e => setKey(e.target.value)}
  error="Invalid key format"
/>
```

### Toggle

```tsx
import { Toggle } from '@golden-passport/ds';

const [enabled, setEnabled] = React.useState(false);

<Toggle
  checked={enabled}
  onChange={setEnabled}
  label="AI Suggestions"
  description="Show prompt suggestions in the builder"
/>
```

### Select

```tsx
import { Select } from '@golden-passport/ds';

const models = [
  { value: 'claude',  label: 'Claude 3.5 Sonnet' },
  { value: 'gpt4o',   label: 'GPT-4o' },
  { value: 'gemini',  label: 'Gemini 1.5 Pro' },
];

const [selected, setSelected] = React.useState('claude');

<Select
  label="AI Model"
  value={selected}
  onChange={setSelected}
  options={models}
/>
```

### Menu

```tsx
import { Menu, Button } from '@golden-passport/ds';

<Menu
  trigger={<Button variant="ghost" size="sm">⋯</Button>}
  items={[
    { label: 'Edit',      onClick: () => edit(id) },
    { label: 'Duplicate', onClick: () => duplicate(id) },
    { label: 'Delete',    onClick: () => del(id), destructive: true, dividerAbove: true },
  ]}
  align="right"
/>
```

### Dialog

```tsx
import { Dialog, Button } from '@golden-passport/ds';

const [open, setOpen] = React.useState(false);

<Button onClick={() => setOpen(true)}>Delete Workflow</Button>

<Dialog open={open} onClose={setOpen} title="Confirm Delete" size="sm">
  <p className="text-sm text-ink-500">
    This will permanently delete the workflow and all run history.
  </p>
  <div className="flex justify-end gap-2 mt-6">
    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
  </div>
</Dialog>
```

### Tabs

```tsx
import { Tabs } from '@golden-passport/ds';

<Tabs
  tabs={[
    { label: 'Overview',  content: <Overview /> },
    { label: 'Run Logs',  content: <RunLogs /> },
    { label: 'Settings',  content: <Settings /> },
  ]}
/>
```

### Combobox

```tsx
import { Combobox } from '@golden-passport/ds';

const users = [
  { value: 'alice', label: 'Alice Chen' },
  { value: 'bob',   label: 'Bob Kumar' },
];

const [assignee, setAssignee] = React.useState<string | null>(null);

<Combobox
  label="Assign to"
  value={assignee}
  onChange={setAssignee}
  options={users}
  placeholder="Search team members…"
/>
```

### Tooltip

```tsx
import { Tooltip, Button } from '@golden-passport/ds';

<Tooltip content="Deploy this workflow to production">
  <Button>Deploy</Button>
</Tooltip>

// Placement
<Tooltip content="Archived 30 days ago" placement="bottom">
  <Badge label="Draft" variant="draft" />
</Tooltip>
```

### DataTable

```tsx
import { DataTable } from '@golden-passport/ds';

const columns = [
  { key: 'name',    header: 'Workflow',  sortable: true },
  { key: 'status',  header: 'Status' },
  { key: 'runs',    header: 'Runs',      sortable: true },
  { key: 'lastRun', header: 'Last Run' },
];

<DataTable
  columns={columns}
  rows={workflows}
  onRowClick={wf => openDetail(wf)}
/>
```

---

## Theming & branding overrides

The design system is built on CSS custom properties inside Tailwind's `@theme {}` block. Overriding any token is a single CSS variable assignment — no config rebuilds, no class changes needed.

### Override in your own CSS

In your app's CSS file, after the `@import`, override any token:

```css
/* my-app/src/index.css */
@import "@golden-passport/ds/styles";

/* Replace the primary brand color with your own */
@theme {
  --color-gold-400: #7C3AED;   /* purple-600 */
  --color-gold-500: #6D28D9;   /* your primary */
  --color-gold-600: #5B21B6;   /* hover state */

  /* Swap out the warm ink neutrals for pure grays */
  --color-ink-50:  #F9FAFB;
  --color-ink-100: #F3F4F6;
  --color-ink-200: #E5E7EB;
  --color-ink-300: #D1D5DB;
  --color-ink-400: #9CA3AF;
  --color-ink-500: #6B7280;
  --color-ink-600: #4B5563;
  --color-ink-700: #374151;
  --color-ink-800: #1F2937;
  --color-ink-900: #111827;

  /* Change fonts */
  --font-display: 'Inter', sans-serif;
  --font-body:    'Inter', sans-serif;
}
```

Every component uses these variables — the override propagates automatically.

### Complete brand replacement example

This is the full set of tokens you can override to fully re-skin the system:

```css
@import "@golden-passport/ds/styles";

@theme {
  /* Primary / accent color (replaces gold) */
  --color-gold-50:  #EFF6FF;
  --color-gold-100: #DBEAFE;
  --color-gold-200: #BFDBFE;
  --color-gold-300: #93C5FD;
  --color-gold-400: #60A5FA;
  --color-gold-500: #3B82F6;   /* primary brand */
  --color-gold-600: #2563EB;   /* hover */
  --color-gold-700: #1D4ED8;
  --color-gold-800: #1E40AF;
  --color-gold-900: #1E3A8A;

  /* Neutral scale (replaces warm ink) */
  --color-ink-50:  #F8FAFC;
  --color-ink-100: #F1F5F9;
  --color-ink-200: #E2E8F0;
  --color-ink-300: #CBD5E1;
  --color-ink-400: #94A3B8;
  --color-ink-500: #64748B;
  --color-ink-600: #475569;
  --color-ink-700: #334155;
  --color-ink-800: #1E293B;
  --color-ink-900: #0F172A;

  /* AI / accent color (replaces slate) */
  --color-slate-100: #FCE7F3;
  --color-slate-300: #F9A8D4;
  --color-slate-400: #EC4899;
  --color-slate-500: #DB2777;
  --color-slate-700: #9D174D;

  /* Typography */
  --font-display: 'Sora', sans-serif;
  --font-body:    'Sora', sans-serif;
  --font-mono:    'Fira Code', monospace;

  /* Shape */
  --radius-sm:  2px;
  --radius-md:  4px;
  --radius-lg:  6px;
  --radius-xl:  8px;
  --radius-2xl: 12px;

  /* Focus ring — uses your primary color automatically */
  --shadow-gold: 0 0 0 3px rgb(59 130 246 / 0.25);
}
```

### Scoped overrides (per-section)

You can scope overrides to a subtree rather than the whole app:

```css
.admin-panel {
  --color-gold-500: #10B981;  /* emerald primary for admin only */
  --color-gold-600: #059669;
}
```

### Override via Tailwind v3 preset

If your consumer app uses Tailwind v3, extend the preset in your `tailwind.config.js`:

```js
import gpPreset from '@golden-passport/ds/tailwind-preset';

export default {
  presets: [gpPreset],
  theme: {
    extend: {
      colors: {
        // Override gold with your primary
        gold: {
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
        },
        // Override ink with cool grays
        ink: {
          50:  '#F8FAFC',
          900: '#0F172A',
        },
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
    },
  },
  content: ['./src/**/*.{ts,tsx}'],
};
```

---

## Design tokens (JS)

For use in SVG, canvas, `style` props, or any non-Tailwind context:

```ts
import { tokens } from '@golden-passport/ds';

// Colors
tokens.colors.gold500    // '#F5C200'
tokens.colors.ink900     // '#0E0D0B'
tokens.colors.slate400   // '#5A82B4'
tokens.colors.success    // '#22C55E'

// Fonts
tokens.fonts.display     // "'Plus Jakarta Sans', sans-serif"
tokens.fonts.mono        // "'JetBrains Mono', monospace"

// Radius
tokens.radius.lg         // '12px'
tokens.radius.full       // '9999px'

// Shadows
tokens.shadow.md         // '0 4px 12px 0 rgb(14 13 11 / 0.08)...'
tokens.shadow.gold       // '0 0 0 3px rgb(245 194 0 / 0.25)...'
```

Example — inline style on a canvas element:

```tsx
import { tokens } from '@golden-passport/ds';

<div style={{
  border: `1.5px solid ${tokens.colors.gold500}`,
  borderRadius: tokens.radius.lg,
  boxShadow: tokens.shadow.gold,
}} />
```

---

## Storybook

Browse and interact with all 12 components locally:

```bash
pnpm storybook
```

Opens on [http://localhost:6006](http://localhost:6006). Each story includes:
- All variants and sizes
- Light and dark theme switching
- Axe a11y audit (via `@storybook/addon-a11y`)

Build a static Storybook for deployment:

```bash
pnpm build-storybook   # outputs to storybook-static/
```

---

## Build & development

```bash
pnpm build       # compile to dist/ (ESM + CJS + .d.ts)
pnpm dev         # watch mode
pnpm typecheck   # tsc --noEmit
pnpm clean       # rm -rf dist/
```

---

## Publishing

```bash
# Bump version
npm version patch   # or minor / major

# Build and publish
pnpm build
pnpm publish --access public
```

Or use the GitHub Actions workflow (if configured) — tag a release and it publishes automatically:

```bash
git tag v0.2.0 && git push --tags
```
