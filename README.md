# @golden-passport/ds

Golden Passport Design System — React component library built on **Tailwind CSS v4**, **Headless UI v2**, and **Lucide icons**.

---

## Contents

- [Install](#install)
- [Setup](#setup)
- [Running Storybook](#running-storybook)
- [Components](#components)
- [Example Pages](#example-pages)
- [Usage examples](#usage-examples)
- [Theming & token overrides](#theming--token-overrides)
- [Design tokens (JS)](#design-tokens-js)
- [Build & publishing](#build--publishing)

---

## Install

```bash
pnpm add @golden-passport/ds @headlessui/react lucide-react
```

**Peer dependencies** — install in your app if not already present:

```bash
pnpm add react react-dom tailwindcss
```

> Requires React ≥ 18, Tailwind CSS ≥ 4, Headless UI ≥ 2.

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

### Navigating Storybook

The sidebar groups components by category:

| Category | What's inside |
|---|---|
| **Styling** | Colour palette, typography scale, general tokens |
| **Elements** | Button, ButtonGroup, Badge, Avatar, Menu |
| **Forms** | Input, Textarea, Select, Toggle, Checkbox, RadioGroup, RatingGroup, DatePicker |
| **Headings** | PageHeading, SectionHeader, SectionHeading |
| **Layout** | Card, PageContainer, ContainerList, Divider, ListCard, MediaObject |
| **Lists** | DataTable, GridList, StackedList |
| **Data Display** | Stats, Calendar, DescriptionList |
| **Navigation** | Navbar, SidebarNav, VerticalNav, BottomNav, Tabs, Breadcrumbs, Pagination, StepsBar, ProgressBar, Combobox, FabMenu |
| **Overlays** | Dialog, Drawer, Tooltip |
| **Feedback** | Alert, EmptyState |
| **Components** | Carousel |
| **Example Pages** | HomeScreen, DetailScreen |

Each component has a **Playground** story at the top with interactive controls, followed by individual variant stories, and an **All Variants** overview at the bottom.

---

## Components

### Elements

| Component | Description |
|---|---|
| `Button` | Primary, secondary, ghost, danger · sm / md / lg · loading spinner · pill / square radius |
| `ButtonGroup` | Segmented button row sharing a border |
| `Badge` | Status pill: active, running, pending, draft, failed, ai, warning, neutral |
| `Avatar` | Gold-gradient initials avatar, configurable size |
| `Menu` | Action dropdown (⋯ / context menus) with optional dividers and destructive items |

### Forms

| Component | Description |
|---|---|
| `Input` | Text input — label, hint, error, optional left icon, optional right action (e.g. show/hide) |
| `Textarea` | Multi-line input with label, hint, error |
| `Select` | Single-select dropdown with animated panel |
| `Toggle` | Accessible on/off switch |
| `Checkbox` | Labelled checkbox with indeterminate support |
| `RadioGroup` | Labelled radio button group |
| `RatingGroup` | Star rating — controlled/uncontrolled, half-steps, custom icons, RTL |
| `DatePicker` | Custom date picker — calendar popover, no native browser UI |
| `TimePicker` | Custom time picker — scrollable HH / MM columns |
| `DateTimePicker` | Combined date + time picker in a single popover |
| `Combobox` | Searchable select with real-time filtering |

### Layout

| Component | Description |
|---|---|
| `Card` | Content panel — default, muted, outlined, flush variants |
| `PageContainer` | Max-width centred page wrapper |
| `ContainerList` | Stacked list of card-style containers |
| `Divider` | Horizontal rule with optional label |
| `ListCard` | Card with a built-in list slot |
| `MediaObject` | Icon / image + text side-by-side layout primitive |

### Lists

| Component | Description |
|---|---|
| `DataTable` | Sortable, clickable table with column headers |
| `GridList` | Card-grid list with overflow menu per item |
| `StackedList` | Divided list — bordered card or flat; custom `renderItem` slot |

### Data Display

| Component | Description |
|---|---|
| `Stats` | KPI stat cards — cards, simple, or bordered variants |
| `Calendar` | Monthly calendar — full event grid or compact `mini` picker |
| `DescriptionList` | Label / value definition list |

### Navigation

| Component | Description |
|---|---|
| `Navbar` | Top navigation bar — light / dark, search, user menu |
| `SidebarNav` | Full-height sidebar — logo, nav groups, user section, footer slot |
| `VerticalNav` | Standalone vertical nav list — default / gray / dark appearances |
| `BottomNav` | Mobile bottom tab bar — fixed or inline, with badge support |
| `Tabs` | Horizontal tab strip — underline and pill variants |
| `Breadcrumbs` | Hierarchical path trail |
| `Pagination` | Page navigation with prev / next and page numbers |
| `StepsBar` | Multi-step progress indicator |
| `ProgressBar` | Linear progress bar |
| `FabMenu` | Floating action button with expandable menu |

### Overlays

| Component | Description |
|---|---|
| `Dialog` | Modal with focus trap, backdrop, animated entry · sm / md / lg / xl sizes |
| `Drawer` | Slide-in panel — left / right / bottom |
| `Tooltip` | Hover label — configurable placement and radius |

### Feedback

| Component | Description |
|---|---|
| `Alert` | Inline alert — info, success, warning, error |
| `EmptyState` | Zero-state placeholder with icon, message, and action |

### Headings

| Component | Description |
|---|---|
| `PageHeading` | Page-level heading — title, breadcrumbs, tabs, actions · sticky support · master / small / medium / large mobile variants |
| `SectionHeader` | Section heading with optional overflow menu |
| `SectionHeading` | Lightweight sub-section label |

---

## Example Pages

Two full-page layout stories are included under **Example Pages** in Storybook. They show how components compose into real screens.

### HomeScreen

Two layout variants, each with light and dark stories:

**Sidebar — Deployments** (`HomeScreen → Sidebar`)
- `SidebarNav` with logo, grouped nav, teams section, and user profile
- `PageHeading` master variant with search and hamburger (mobile)
- Deployments list using `StackedList` (flat on page background)
- Activity feed panel using `StackedList` (white card)
- `BottomNav` on mobile (hidden on desktop)
- Responsive: stacked on mobile, side-by-side on `sm+`

**Stacked — Cashflow** (`HomeScreen → Stacked`)
- `Navbar` with logo, nav links, bell action, user avatar
- Filter tab strip with period selector and "New invoice" button
- `Stats` KPI cards (responsive 1 → 2 → 4 columns)
- Transaction list with responsive mobile-card / desktop-row layouts

### DetailScreen

A detail page layout showing:
- `SidebarNav` or `Navbar` chrome
- `PageHeading` with breadcrumbs, back navigation, and action buttons
- `Card` / `DescriptionList` / `Stats` content sections

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
import { DatePicker, TimePicker, DateTimePicker } from '@golden-passport/ds';

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
  appearance="light"
/>
```

### StackedList

```tsx
import { StackedList } from '@golden-passport/ds';
import { Avatar } from '@golden-passport/ds';

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
