# @golden-passport/ds

Golden Passport Design System — React component library built on **Tailwind CSS v4**, **Headless UI v2**, and **Lucide icons**.

[![CI](https://github.com/GoldenPassport/ds/actions/workflows/ci.yml/badge.svg)](https://github.com/GoldenPassport/ds/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Contents

- [Install](#install)
- [Setup](#setup)
- [Running Storybook](#running-storybook)
- [Usage examples](#usage-examples)
- [Theming & token overrides](#theming--token-overrides)
- [Design tokens (JS)](#design-tokens-js)
- [Stories](#stories)
- [Build & publishing](#build--publishing)

---

## Install

```bash
pnpm add @golden-passport/ds @headlessui/react @floating-ui/react lucide-react
```

**Peer dependencies** — install in your app if not already present:

```bash
pnpm add react react-dom tailwindcss
```

> Requires React ≥ 18, Tailwind CSS ≥ 4, Headless UI ≥ 2, Floating UI ≥ 0.26.

---

## Setup

### 1. Import the base CSS

In your app's root CSS file (processed by Tailwind):

```css
/* app/globals.css  —or—  src/index.css */
@import "@golden-passport/ds/styles";
```

This gives you:
- All colour scales (`primary-*`, `ink-*`, `slate-*`) as Tailwind utilities
- Typography (`font-display`, `font-body`, `font-mono`)
- Radius, shadow, and animation tokens
- Class-based dark mode (`dark:` variant driven by `.dark` on `<html>`)
- Utility classes: `gp-focus`, `gp-ai-dot`

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

### 2. Load fonts

```html
<link
  href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

Or self-host via Fontsource:

```bash
pnpm add @fontsource/plus-jakarta-sans @fontsource/dm-sans @fontsource/jetbrains-mono
```

```ts
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/jetbrains-mono/400.css';
```

### 3. Enable dark mode

Dark mode is class-based — toggle the `dark` class on `<html>`:

```ts
document.documentElement.classList.toggle('dark', isDarkMode);
```

---

## Running Storybook

Storybook is the primary way to browse, develop, and test components.

### Start the dev server

```bash
pnpm storybook
```

Opens at [http://localhost:6006](http://localhost:6006). Supports:
- **Hot reload** — changes to components and stories update instantly
- **Light / Dark** theme toggle via the toolbar globe icon
- **Viewport** presets — mobile (`375 px`), tablet, desktop
- **Autodocs** — auto-generated API docs for every component

### Build a static Storybook

```bash
pnpm build-storybook
# outputs to storybook-static/ — deploy to any static host
```

### Component tests

Every story is covered by interaction tests (play functions) and WCAG 2.x accessibility scans (axe-core). Tests run in a headless Chromium browser via Vitest + Playwright.

```bash
pnpm test-storybook:light    # light mode  (487 tests)
pnpm test-storybook:dark     # dark mode   (487 tests, separate Vitest config)
pnpm test-storybook:all      # both passes — full gate
pnpm test-storybook:coverage # light mode with V8 coverage report
```

**Why two separate commands?**

The Storybook GUI's ▷ "Run component tests" button always uses `vitest.config.ts`, which renders stories in light mode. There is no built-in way to make the GUI runner switch configs. Dark-mode testing requires `vitest.config.dark.ts`, which injects `STORYBOOK_THEME=Dark` at the Vite build level so every story renders with the `.dark` class applied before the first paint.

| Command | Renders as | Intended use |
|---|---|---|
| GUI ▷ / `pnpm test-storybook:light` | Light | Fast feedback during development |
| `pnpm test-storybook:dark` | Dark | Pre-ship or CI dark-mode a11y gate |
| `pnpm test-storybook:all` | Both | Full CI gate |

> **Note** — changing the theme in the Storybook toolbar (`globals=theme:Dark` in the URL) only affects the visual preview; it has no effect on what the test runner renders.

---

## Usage examples

### Button

```tsx
import { Button } from '@golden-passport/ds';

<Button variant="primary">Deploy</Button>
<Button variant="secondary">Save Draft</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="danger">Delete</Button>
<Button size="sm" loading>Deploying…</Button>
<Button radius="pill">Pill shape</Button>
```

### Input

```tsx
import { Input } from '@golden-passport/ds';
import { Mail, Eye } from 'lucide-react';

// With left icon
<Input label="Email" type="email" icon={<Mail className="w-4 h-4" />} />

// With right action (show/hide password)
<Input
  label="Password"
  type={show ? 'text' : 'password'}
  rightAction={
    <button onClick={() => setShow(v => !v)}>
      <Eye className="w-4 h-4" />
    </button>
  }
/>

// With error
<Input label="API Key" error="Invalid key format" />
```

### DatePicker / TimePicker

```tsx
import { DatePicker, TimePicker, DateTimePicker, DateRangePicker } from '@golden-passport/ds';

<DatePicker
  label="Passport expiry"
  value={date}
  onChange={setDate}
/>

<TimePicker
  label="Departure time"
  value={time}     // "HH:mm"
  onChange={setTime}
/>

<DateTimePicker
  label="Appointment"
  value={dt}       // { date: Date, hour: number, minute: number }
  onChange={setDt}
/>

<DateRangePicker
  label="Trip dates"
  value={range}    // { start: Date | null, end: Date | null }
  onChange={setRange}
/>
```

### SidebarNav

```tsx
import { SidebarNav } from '@golden-passport/ds';
import { LayoutDashboard, Users, Settings } from 'lucide-react';

<SidebarNav
  logo={<img src="/logo.svg" alt="Brand" className="h-6" />}
  groups={[{
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, active: true },
      { label: 'Team',      href: '/team',      icon: <Users           className="w-5 h-5" /> },
      { label: 'Settings',  href: '/settings',  icon: <Settings        className="w-5 h-5" /> },
    ],
  }]}
  user={{ name: 'Tom Cook', email: 'tom@example.com' }}
/>
```

### StackedList

```tsx
import { StackedList, Avatar } from '@golden-passport/ds';

// Default row (leading + title + subtitle + trailing)
<StackedList
  bordered
  items={[
    {
      id: 1,
      leading: <Avatar name="Alice Chen" size={40} />,
      title: 'Alice Chen',
      subtitle: 'alice@example.com',
      trailing: 'Admin',
      href: '/users/1',
    },
  ]}
/>

// Custom row via renderItem
<StackedList
  items={rows}
  renderItem={(item) => (
    <div className="flex items-center gap-3 py-3">
      <StatusDot /> <span>{item.title}</span>
    </div>
  )}
/>
```

### RatingGroup

```tsx
import { RatingGroup } from '@golden-passport/ds';
import { Heart } from 'lucide-react';

// Basic 5-star
<RatingGroup value={rating} onChange={setRating} />

// Half steps
<RatingGroup value={3.5} onChange={setRating} allowHalf />

// Custom icons
<RatingGroup
  value={2}
  onChange={setRating}
  iconEmpty={<Heart className="w-full h-full" strokeWidth={1.5} />}
  iconFull={<Heart  className="w-full h-full fill-current" strokeWidth={1.5} />}
/>
```

### Hyperlink

```tsx
import { Hyperlink } from '@golden-passport/ds';

// Default — auto-darkens primary colour for 4.5:1 contrast on light backgrounds
<Hyperlink href="/docs">Read the docs</Hyperlink>

// Variants
<Hyperlink href="/author" variant="muted">Alex Johnson</Hyperlink>
<Hyperlink href="/delete" variant="danger">Delete account</Hyperlink>

// External link (adds icon + rel="noopener noreferrer")
<Hyperlink href="https://example.com" external>Open site</Hyperlink>

// Always underlined
<Hyperlink href="/terms" underline="always">Terms of Service</Hyperlink>

// Override contrast for a white-background container
<div style={{ '--link-primary': 'var(--color-primary-500)' }}>
  <Hyperlink href="#">Bright gold on white</Hyperlink>
</div>
```

### Dialog

```tsx
import { Dialog, Button } from '@golden-passport/ds';

<Button onClick={() => setOpen(true)}>Delete</Button>

<Dialog open={open} onClose={setOpen} title="Confirm Delete" size="sm">
  <p className="text-sm text-ink-500">This action cannot be undone.</p>
  <div className="flex justify-end gap-2 mt-6">
    <Button variant="ghost"  onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="danger" onClick={confirm}>Delete</Button>
  </div>
</Dialog>
```

### Tooltip

```tsx
import { Tooltip, Button } from '@golden-passport/ds';

<Tooltip content="Deploy to production" placement="top">
  <Button>Deploy</Button>
</Tooltip>
```

---

## Theming & token overrides

All design tokens are CSS custom properties inside Tailwind's `@theme {}` block. Override any token after the import — no rebuilds needed.

```css
/* your-app/src/index.css */
@import "@golden-passport/ds/styles";

@theme {
  /* Swap primary brand colour */
  --color-primary-400: #60A5FA;
  --color-primary-500: #3B82F6;
  --color-primary-600: #2563EB;

  /* Replace warm neutrals with cool grays */
  --color-ink-50:  #F8FAFC;
  --color-ink-900: #0F172A;

  /* Change fonts */
  --font-display: 'Inter', sans-serif;
  --font-body:    'Inter', sans-serif;

  /* Tighten border radius */
  --radius-xl:  0.5rem;
  --radius-2xl: 0.75rem;
}
```

Every component references these variables — the override propagates automatically.

---

## Design tokens (JS)

For use in SVG, canvas, `style` props, or non-Tailwind contexts:

```ts
import { tokens } from '@golden-passport/ds';

tokens.colors.primary500   // '#F5C200'
tokens.colors.ink900       // '#0E0D0B'
tokens.fonts.display       // "'Plus Jakarta Sans', sans-serif"
tokens.radius.xl           // '1rem'
tokens.shadow.md           // '0 4px 12px 0 rgb(14 13 11 / 0.08)…'
```

---

## Stories

All stories are browsable in Storybook. Each entry has a **Playground** story with interactive controls, individual variant stories, and an **All Variants** overview. The **Headless UI** column indicates which primitives the component delegates to.

| Category | Name | Headless UI | Description |
|---|---|---|---|
| Styling | Colors | — | Full primary, ink, and slate colour palette swatches with hex values |
| Styling | General | — | Design token reference — spacing, radius, shadow, animation |
| Styling | Typography | — | Type scale, font families (display / body / mono), and weight samples |
| Elements | Avatar | — | Gold-gradient initials avatar, configurable size |
| Elements | Badge | — | Status pills: active, running, pending, draft, failed, ai, warning, neutral; dismissible variant |
| Elements | Button | — | Primary / secondary / ghost / danger · sm / md / lg · loading spinner · pill / square radius |
| Elements | ButtonGroup | — | Segmented button row sharing a border |
| Elements | Hyperlink | — | Styled `<a>` with adaptive `--link-primary` contrast, muted / danger variants, underline control, external-link icon |
| Elements | Menu | `Menu` | Action dropdown / context menu with optional dividers and destructive items |
| Forms | ActionPanel | — | Call-to-action panel with title, body, and primary / secondary actions |
| Forms | Checkbox | — | Labelled checkbox with indeterminate support |
| Forms | DatePicker | `Popover` | Calendar popover date picker — Clear / Today shortcuts |
| Forms | DateRangePicker | `Popover` | Two-field From / To range picker with hover-preview strip |
| Forms | DateTimePicker | `Popover` | Combined date + time picker in a single popover |
| Forms | Fieldset | — | Form layout primitives: Fieldset, Legend, FieldGroup, Field, Label, Description, ErrorMessage |
| Forms | Input | — | Text input — label, hint, error, left icon, right action slot, corner-hint slot |
| Forms | OtpInput | — | One-time password digit entry — sm / md / lg sizes, auto-advance, paste support |
| Forms | RadioGroup | — | Labelled radio button group — default and card variants |
| Forms | RatingGroup | — | Star rating — controlled / uncontrolled, half-steps, custom icons, RTL |
| Forms | SearchSet | — | Search field with tag chips and a collapsible filter panel |
| Forms | Select | `Listbox` | Single-select dropdown with animated panel |
| Forms | Textarea | — | Multi-line input with label, hint, error, character count |
| Forms | TimePicker | `Popover` | Scrollable HH / MM column time picker — Clear / Now shortcuts |
| Forms | Toggle | `Switch` | Accessible on/off switch with optional label and description |
| Headings | PageHeading | — | Page-level heading — title, back link, meta slot, tabs, action buttons, optional sticky |
| Headings | SectionHeader | `Menu` | Section heading with optional overflow action menu |
| Headings | SectionHeading | — | Lightweight sub-section label with optional tab strip |
| Layout | Card | — | Content panel — default, muted, outlined, and flush variants |
| Layout | ContainerList | — | Stacked list of card-style containers with action buttons |
| Layout | Divider | — | Horizontal rule with optional centred or left-aligned label |
| Layout | ListCard | — | Card with a built-in divided list slot |
| Layout | MediaObject | — | Icon / image + text side-by-side layout primitive — left / right, gap variants |
| Layout | PageContainer | — | Max-width centred page wrapper — xs / sm / md / lg / xl / full widths |
| Lists | Carousel | — | Scrollable card carousel with dot indicators and auto-play |
| Lists | DataTable | — | Sortable, clickable table with typed column headers and pagination |
| Lists | GridList | `Menu` | Card-grid list with per-item overflow action menu |
| Lists | StackedList | — | Divided list — bordered card or flat; custom `renderItem` slot |
| Data Display | Calendar | — | Monthly event calendar or compact `mini` picker with range selection and month/year quick-picker |
| Data Display | DescriptionList | — | Label / value definition list — stacked and side-by-side layouts |
| Data Display | Stats | — | KPI stat cards — cards, simple, and bordered variants; trend indicators |
| Navigation | BottomNav | — | Mobile bottom tab bar — fixed or inline, icon + label, badge support |
| Navigation | Breadcrumbs | — | Hierarchical path trail with configurable separators |
| Navigation | Combobox | `Combobox` | Searchable select with real-time filtering and custom option rendering |
| Navigation | FabMenu | — | Floating action button with expandable radial / stacked item menu |
| Navigation | FlyoutMenu | `Popover` | Mega-menu flyout — simple list, featured, and full-width variants |
| Navigation | Navbar | `Menu` | Top navigation bar — logo, nav links, search, actions, user dropdown |
| Navigation | Pagination | — | Page navigation with prev / next, page numbers, and jump-to input |
| Navigation | ProgressBar | — | Linear and circular progress bars — labelled, striped, and animated variants |
| Navigation | SidebarNav | `Menu`, `Disclosure` | Full-height sidebar — logo, grouped nav, collapsible sections, user profile |
| Navigation | StepsBar | — | Multi-step progress indicator — horizontal and vertical orientations |
| Navigation | Tabs | `TabGroup` | Horizontal tab strip — underline and pill variants |
| Navigation | VerticalNav | — | Standalone vertical nav list — size, spacing, radius, shadow, border, active-indicator props |
| Overlays | Dialog | `Dialog` | Modal with focus trap, backdrop, animated entry · sm / md / lg / xl sizes |
| Overlays | Drawer | `Dialog` | Slide-in panel — left / right / bottom placements, configurable sizes |
| Overlays | Notifications | — | Toast notification stack — info, success, warning, error; auto-dismiss; position variants |
| Overlays | Tooltip | — | Hover/focus label — configurable placement, radius, and max-width (Floating UI) |
| Feedback | Alert | — | Inline alert — info, success, warning, error; dismissible; with-actions variant |
| Feedback | EmptyState | — | Zero-state placeholder with icon, heading, body, and primary / secondary actions |
| Feedback | ErrorPage | — | Full-page error states — 404, 500, 403, 503; icon or large code display |
| Marketing | Banner | — | Announcement banner — dark, primary, and light variants; dismissible |
| Messaging | Chat | — | iMessage-style chat thread — bubbles, timestamps, read receipts, reactions, image lightbox |
| Example Pages | DetailScreen | — | Detail page with stacked (Navbar) or sidebar (SidebarNav) chrome, PageHeading, DescriptionList, attachments, activity feed |
| Example Pages | HomeScreen | — | Dashboard with sidebar (deployments + activity) or stacked (cashflow + transactions) layout |
| Example Pages | Login | — | Standard email + password, passwordless OTP, and email + 2FA authenticator login flows |
| Example Pages | Register | — | Single-step and multi-step (with OTP verification) registration flows |

---

## Contributing

PRs and issues are welcome. The CI gate runs TypeScript, build, and interaction tests in both light and dark mode on every push and PR.

```bash
pnpm storybook              # develop with hot reload
pnpm test-storybook:light   # run tests locally (light)
pnpm test-storybook:dark    # run tests locally (dark)
pnpm typecheck              # type-check
```

> **Logo** — `assets/gp-logo.*` is proprietary and excluded from the MIT licence. All other files are MIT.

---

## Build & publishing

```bash
pnpm build          # compile to dist/ (ESM + CJS + .d.ts)
pnpm dev            # watch mode
pnpm typecheck      # tsc --noEmit
pnpm clean          # rm -rf dist/
```

```bash
# Bump version and publish
npm version patch   # or minor / major
pnpm build
pnpm publish --access public
```

Or tag a release to trigger the GitHub Actions publish workflow:

```bash
git tag v0.2.0 && git push --tags
```
