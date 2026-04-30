import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Styling/Colors',
  parameters: { controls: { hideNoControlsWarning: true } },
};
export default meta;

// ── WCAG contrast utilities ───────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function luminance(r: number, g: number, b: number): number {
  return [r, g, b]
    .map((c) => {
      const s = c / 255;
      return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    })
    .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = luminance(...hexToRgb(hex1));
  const l2 = luminance(...hexToRgb(hex2));
  const [lo, hi] = l1 < l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

type WcagGrade = 'AAA' | 'AA' | 'AA*' | '✕';

function wcagGrade(ratio: number): WcagGrade {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA*'; // large text / UI components only
  return '✕';
}

// Readable accessible label for each grade (✕ is a non-text symbol)
function gradeLabel(grade: WcagGrade): string {
  if (grade === '✕') return 'Fail';
  return grade; // AAA, AA, AA* are already readable text
}

// Tailwind classes for the grade badge — light uses -700 (passes on white),
// dark uses -300 (passes on ink-800).
function gradeClasses(grade: WcagGrade): string {
  if (grade === 'AAA')
    return 'text-green-700  border-green-700  dark:text-green-300  dark:border-green-300';
  if (grade === 'AA')
    return 'text-blue-700   border-blue-700   dark:text-blue-300   dark:border-blue-300';
  if (grade === 'AA*')
    return 'text-amber-700  border-amber-700  dark:text-amber-300  dark:border-amber-300';
  return 'text-red-700    border-red-700    dark:text-red-300    dark:border-red-300';
}

// ── Swatch ────────────────────────────────────────────────

const WHITE = '#FFFFFF';
const BLACK = '#0E0D0B'; // ink-900

function bestTextColor(bg: string): string {
  return contrastRatio(bg, WHITE) >= contrastRatio(bg, BLACK) ? WHITE : BLACK;
}

function Swatch({
  shade,
  hex,
  surface,
}: {
  shade: string;
  hex: string;
  surface?: 'light' | 'dark';
}) {
  const best = bestTextColor(hex);
  const grade = wcagGrade(contrastRatio(hex, best));
  // Use inline colours matched to the card's forced background, not Tailwind dark: classes
  const labelColor = surface === 'dark' ? '#F8F7F4' : '#0E0D0B';
  const subColor = surface === 'dark' ? '#B0ADA6' : '#55524C';

  return (
    <div className="flex flex-col gap-2">
      {/* Color block */}
      <div
        className="relative w-full rounded-2xl border border-black/5 flex flex-col items-center justify-center gap-1"
        style={{ backgroundColor: hex, height: 88 }}
      >
        {/* Auto-selected "Aa" — decorative, grade shown in badge below */}
        <span
          aria-hidden="true"
          style={{ color: best, fontSize: 18, fontWeight: 700, fontFamily: 'sans-serif' }}
        >
          Aa
        </span>
        <span
          aria-hidden="true"
          style={{
            color: best,
            fontSize: 9,
            fontFamily: 'sans-serif',
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}
        >
          {grade}
        </span>
      </div>
      {/* Shade + hex */}
      <div>
        <p className="text-xs font-semibold font-body" style={{ color: labelColor }}>
          {shade}
        </p>
        <p className="text-[10px] font-mono uppercase" style={{ color: subColor }}>
          {hex}
        </p>
      </div>
    </div>
  );
}

// ── Palette section ───────────────────────────────────────

function PaletteSection({
  name,
  description,
  swatches,
  surface,
}: {
  name: string;
  description: string;
  swatches: { shade: string; hex: string }[];
  surface: 'light' | 'dark';
}) {
  const bg = surface === 'dark' ? '#0E0D0B' : '#FFFFFF';
  const border = surface === 'dark' ? '#27241F' : '#D6D4CF';
  const title = surface === 'dark' ? '#F8F7F4' : '#0E0D0B';
  const sub = surface === 'dark' ? '#7E7A72' : '#55524C';

  return (
    <div className="rounded-2xl p-5 border" style={{ backgroundColor: bg, borderColor: border }}>
      <div className="mb-4">
        <p className="text-sm font-semibold font-display" style={{ color: title }}>
          {name}
        </p>
        <p className="text-xs font-body mt-0.5" style={{ color: sub }}>
          {description}
        </p>
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {swatches.map((s) => (
          <Swatch key={s.shade} {...s} surface={surface} />
        ))}
      </div>
    </div>
  );
}

function PalettePair({
  name,
  description,
  swatches,
}: {
  name: string;
  description: string;
  swatches: { shade: string; hex: string }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold font-body uppercase tracking-widest text-primary-800 dark:text-primary-400">
        {name}
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <PaletteSection
          name="Light surface"
          description={description}
          swatches={swatches}
          surface="light"
        />
        <PaletteSection
          name="Dark surface"
          description={description}
          swatches={swatches}
          surface="dark"
        />
      </div>
    </div>
  );
}

// ── Status swatches ───────────────────────────────────────

function StatusSwatch({ name, fg, bg }: { name: string; fg: string; bg: string }) {
  const fgRatio = contrastRatio(fg, WHITE);
  const fgGrade = wcagGrade(fgRatio);
  const bgRatio = contrastRatio(bg, BLACK);
  const bgGrade = wcagGrade(bgRatio);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div
          className="flex-1 rounded-xl border border-black/5 h-14"
          style={{ backgroundColor: fg }}
        />
        <div
          className="flex-1 rounded-xl border border-black/5 h-14"
          style={{ backgroundColor: bg }}
        />
      </div>
      <div>
        <p className="text-xs font-semibold font-body text-ink-700 dark:text-ink-200">{name}</p>
        <div className="flex gap-2 mt-0.5">
          <span className="text-[10px] font-mono text-ink-500 dark:text-ink-300">{fg}</span>
          <span className="text-[10px] font-mono text-ink-500 dark:text-ink-300">{bg}</span>
        </div>
        <div className="flex gap-3 mt-1">
          <span className="text-[10px] font-body text-ink-500 dark:text-ink-300">
            fg {fgRatio.toFixed(1)}:1{' '}
            <span className={`font-bold ${gradeClasses(fgGrade)}`}>{gradeLabel(fgGrade)}</span>
          </span>
          <span className="text-[10px] font-body text-ink-500 dark:text-ink-300">
            bg {bgRatio.toFixed(1)}:1{' '}
            <span className={`font-bold ${gradeClasses(bgGrade)}`}>{gradeLabel(bgGrade)}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Legend ────────────────────────────────────────────────

function Legend() {
  const items = [
    { grade: 'AAA', min: '7:1', desc: 'Enhanced — all text sizes' },
    { grade: 'AA', min: '4.5:1', desc: 'Normal text — required' },
    { grade: 'AA*', min: '3:1', desc: 'Large text / UI only' },
    { grade: '✕', min: '<3:1', desc: 'Fails WCAG' },
  ] as const;

  return (
    <div className="rounded-2xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 shadow-sm px-5 py-4">
      <p className="text-xs font-semibold font-body text-ink-900 dark:text-ink-50 mb-3">
        WCAG contrast grades
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map(({ grade, min, desc }) => (
          <div key={grade} className="flex items-start gap-2">
            <span
              className={`mt-0.5 shrink-0 text-[10px] font-bold rounded px-1 border ${gradeClasses(grade as WcagGrade)}`}
            >
              {gradeLabel(grade as WcagGrade)}
            </span>
            <div>
              <p className="text-xs font-mono font-medium text-ink-700 dark:text-ink-200">{min}</p>
              <p className="text-[10px] font-body text-ink-500 dark:text-ink-300">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Story ─────────────────────────────────────────────────

export const Palette = {
  name: 'Color Palette',
  render: () => (
    <div className="max-w-5xl flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-lg font-bold font-display text-ink-900 dark:text-ink-50">
            Color Palette
          </h1>
          <p className="mt-1 text-sm font-body text-ink-500 dark:text-ink-300">
            Each swatch auto-selects the best-contrast text (white or dark) and shows its WCAG ratio
            and grade. Palettes are shown on both light and dark surfaces.
          </p>
        </div>
        <Legend />
      </div>

      <PalettePair
        name="Primary — brand yellow"
        description="CTAs, focus rings, active states, brand accents."
        swatches={[
          { shade: '50', hex: '#FFFBEB' },
          { shade: '100', hex: '#FEF3C7' },
          { shade: '200', hex: '#FDE68A' },
          { shade: '300', hex: '#FCD34D' },
          { shade: '400', hex: '#FBBF24' },
          { shade: '500', hex: '#F5C200' },
          { shade: '600', hex: '#D4A500' },
          { shade: '700', hex: '#A37C00' },
          { shade: '800', hex: '#725600' },
          { shade: '900', hex: '#3D2E00' },
        ]}
      />

      <PalettePair
        name="Ink — neutrals"
        description="Text, backgrounds, borders, and neutral UI surfaces."
        swatches={[
          { shade: '50', hex: '#F8F7F4' },
          { shade: '100', hex: '#EDECEA' },
          { shade: '200', hex: '#D6D4CF' },
          { shade: '300', hex: '#B0ADA6' },
          { shade: '400', hex: '#7E7A72' },
          { shade: '500', hex: '#55524C' },
          { shade: '600', hex: '#3A3733' },
          { shade: '700', hex: '#27241F' },
          { shade: '800', hex: '#1A1714' },
          { shade: '900', hex: '#0E0D0B' },
        ]}
      />

      <PalettePair
        name="Slate — AI / accent"
        description="AI features, pipeline indicators, secondary accent states."
        swatches={[
          { shade: '50', hex: '#F1F4F9' },
          { shade: '100', hex: '#E1E8F2' },
          { shade: '200', hex: '#C3D1E5' },
          { shade: '300', hex: '#93AECF' },
          { shade: '400', hex: '#5A82B4' },
          { shade: '500', hex: '#3460A0' },
          { shade: '600', hex: '#254A82' },
          { shade: '700', hex: '#1A3564' },
          { shade: '800', hex: '#112247' },
          { shade: '900', hex: '#0A1428' },
        ]}
      />

      <div>
        <p className="mb-3 text-xs font-semibold font-body uppercase tracking-widest text-primary-800 dark:text-primary-400">
          Status
        </p>
        <p className="mb-4 text-xs font-body text-ink-500 dark:text-ink-300">
          Foreground (left) and background tint (right) for each status colour.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <StatusSwatch name="Success" fg="#22C55E" bg="#DCFCE7" />
          <StatusSwatch name="Warning" fg="#F59E0B" bg="#FEF3C7" />
          <StatusSwatch name="Error" fg="#EF4444" bg="#FEE2E2" />
          <StatusSwatch name="Info" fg="#3B82F6" bg="#DBEAFE" />
        </div>
      </div>
    </div>
  ),
};
