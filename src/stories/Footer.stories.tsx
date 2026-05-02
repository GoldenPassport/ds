import type { Meta, StoryObj } from '@storybook/react';
import { ArrowRight, Twitter, Linkedin, Facebook, Instagram, Youtube, Globe, Mail, Phone, MapPin } from 'lucide-react';
import gpLogo from '../../assets/gp-logo.png';
import { Button } from '../components/Button';
import { Divider } from '../components/Divider';
import { Hyperlink } from '../components/Hyperlink';
import { Input } from '../components/Input';
import { ActionPanel } from '../components/ActionPanel';

const meta = {
  title: 'Example Sections/Footer',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Data ──────────────────────────────────────────────────

const navLinks = {
  Products: [
    'Lorem ipsum',
    'Dolor sit amet',
    'Consectetur',
    'Adipiscing elit',
    'Sed do eiusmod',
    'Explore all',
  ],
  Company: [
    'About us',
    'How it works',
    'Pricing',
    'Blog',
    'Careers',
    'Contact',
  ],
  Legal: [
    'Privacy policy',
    'Terms of service',
    'Cookie policy',
    'Compliance',
  ],
  Support: [
    'Help centre',
    'System status',
    'Book a call',
    'Partners',
  ],
};

const socials = [
  { label: 'X (Twitter)', icon: Twitter, href: '#' },
  { label: 'LinkedIn',    icon: Linkedin,  href: '#' },
  { label: 'Facebook',   icon: Facebook,  href: '#' },
  { label: 'Instagram',  icon: Instagram, href: '#' },
  { label: 'YouTube',    icon: Youtube,   href: '#' },
];

// ── Shared sub-components ─────────────────────────────────

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <img src={gpLogo} alt="" aria-hidden="true" className="h-7 w-auto" />
      <span className={`text-sm font-bold font-display tracking-tight ${light ? 'text-ink-50' : 'text-ink-900 dark:text-ink-50'}`}>
        Golden Passport
      </span>
    </div>
  );
}

function SocialRow({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      {socials.map(({ label, icon: Icon, href }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          className={`transition-colors ${light ? 'text-ink-400 hover:text-ink-50' : 'text-ink-400 dark:text-ink-500 hover:text-ink-600 dark:hover:text-ink-200'}`}
        >
          <Icon className="w-5 h-5" />
        </a>
      ))}
    </div>
  );
}

/** Logo + tagline + social icons — reused across stories */
function BrandBlock({ light = false }: { light?: boolean }) {
  return (
    <div>
      <Logo light={light} />
      <p className={`mt-4 text-sm font-body leading-relaxed ${light ? 'text-ink-300' : 'text-ink-500 dark:text-ink-300'}`}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
      </p>
      <div className="mt-6">
        <SocialRow light={light} />
      </div>
    </div>
  );
}

/**
 * Responsive link-column grid.
 * cols=4 → 2 cols on mobile, 4 on md+   (used when BrandBlock is separate)
 * cols=2 → 2 cols always                (used when inside a half-width container)
 */
function NavLinkColumns({ cols = 4 }: { cols?: 2 | 4 }) {
  const entries = Object.entries(navLinks).slice(0, cols === 2 ? 2 : 4);
  return (
    <div className={`grid grid-cols-2 gap-x-8 gap-y-10 ${cols === 4 ? 'md:grid-cols-4' : ''}`}>
      {entries.map(([section, links]) => (
        <div key={section}>
          <h3 className="text-xs font-semibold font-body uppercase tracking-widest text-ink-900 dark:text-ink-50 mb-4">
            {section}
          </h3>
          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link}>
                <Hyperlink href="#" variant="muted" underline="none" className="text-sm">
                  {link}
                </Hyperlink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Copyright + legal links bottom bar */
function BottomBar({
  left,
  center,
  right,
}: {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
      <div className="flex justify-start">{left}</div>
      <div className="flex justify-center text-center">{center}</div>
      <div className="flex justify-end">{right}</div>
    </div>
  );
}

function Copyright() {
  return (
    <p className="text-xs font-body text-ink-500 dark:text-ink-300">
      © {new Date().getFullYear()} Golden Passport Ltd. All rights reserved.
    </p>
  );
}

function LegalLinks() {
  return (
    <div className="flex items-center gap-6">
      {['Privacy', 'Terms', 'Cookies'].map((item) => (
        <Hyperlink key={item} href="#" variant="muted" underline="none" className="text-xs">
          {item}
        </Hyperlink>
      ))}
    </div>
  );
}

// ── Shared layout constants ───────────────────────────────

/** Outer wrapper: centred, max-width, consistent horizontal padding */
const wrap = 'mx-auto max-w-7xl px-6 lg:px-8 py-16 lg:py-20';

/**
 * Main footer grid: brand col (col-span-2 → col-span-1) + 4 link cols.
 * mobile:  2-col (brand full-width, links 2×2)
 * lg:      5-col (brand + 4 links side by side)
 */
const mainGrid = 'grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-5';

// ═══════════════════════════════════════════════════════════
// 1 — Four-column
// ═══════════════════════════════════════════════════════════

export const FourColumn: Story = {
  name: 'Four column',
  render: () => (
    <footer className="bg-white dark:bg-ink-900 border-t border-ink-100 dark:border-ink-800">
      <div className={wrap}>

        <div className={mainGrid}>
          {/* Brand — full width on mobile, 1/5 at lg */}
          <div className="col-span-2 lg:col-span-1">
            <BrandBlock />
          </div>

          {/* Four link columns — each 1/5 at lg, 1/2 on mobile */}
          {Object.entries(navLinks).map(([section, links]) => (
            <div key={section} className="col-span-1">
              <h3 className="text-xs font-semibold font-body uppercase tracking-widest text-ink-900 dark:text-ink-50 mb-4">
                {section}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Hyperlink href="#" variant="muted" underline="none" className="text-sm">
                      {link}
                    </Hyperlink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Divider className="mt-16 mb-8" />

        <BottomBar
          left={<Copyright />}
          right={<LegalLinks />}
        />
      </div>
    </footer>
  ),
};

// ═══════════════════════════════════════════════════════════
// 2 — Simple centered
// ═══════════════════════════════════════════════════════════

export const SimpleCentered: Story = {
  name: 'Simple centered',
  render: () => (
    <footer className="bg-white dark:bg-ink-900 border-t border-ink-100 dark:border-ink-800">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 py-16 flex flex-col items-center gap-8">

        <Logo />

        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {['Products', 'How it works', 'Pricing', 'About', 'Blog', 'Careers', 'Contact'].map((item) => (
            <Hyperlink key={item} href="#" variant="muted" underline="none" className="text-sm">
              {item}
            </Hyperlink>
          ))}
        </nav>

        <SocialRow />

        <Divider className="w-full" />

        <Copyright />
      </div>
    </footer>
  ),
};

// ═══════════════════════════════════════════════════════════
// 3 — With newsletter
// ═══════════════════════════════════════════════════════════

export const WithNewsletter: Story = {
  name: 'With newsletter',
  render: () => (
    <footer className="bg-ink-50 dark:bg-ink-900 border-t border-ink-100 dark:border-ink-800">
      <div className={wrap}>

        <ActionPanel
          layout="inline"
          title="Stay in the loop"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum."
        >
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-3">
            <Input
              type="email"
              placeholder="you@example.com"
              aria-label="Email address"
              reserveHintSpace={false}
            />
            <Button variant="primary" size="md" type="submit">
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </ActionPanel>

        <Divider className="mt-16 mb-12" />

        <NavLinkColumns cols={4} />

        <Divider className="mt-16 mb-8" />

        <BottomBar
          left={<Logo />}
          center={<Copyright />}
          right={<SocialRow />}
        />
      </div>
    </footer>
  ),
};

// ═══════════════════════════════════════════════════════════
// 4 — Dark
// ═══════════════════════════════════════════════════════════

export const Dark: Story = {
  name: 'Dark',
  render: () => (
    <div className="dark">
      <footer className="bg-ink-900 border-t border-ink-800">
        <div className={wrap}>

          <div className={mainGrid}>
            <div className="col-span-2 lg:col-span-1">
              <BrandBlock light />
            </div>
            {Object.entries(navLinks).map(([section, links]) => (
              <div key={section} className="col-span-1">
                <h3 className="text-xs font-semibold font-body uppercase tracking-widest text-ink-50 mb-4">
                  {section}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <Hyperlink href="#" variant="muted" underline="none" className="text-sm">
                        {link}
                      </Hyperlink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Divider className="mt-16 mb-10" />

          {/* Contact strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Mail,   text: 'hello@example.com' },
              { icon: Phone,  text: '+1 (555) 000-0000' },
              { icon: MapPin, text: 'New York · London · Sydney' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary-400" />
                </div>
                <span className="text-sm font-body text-ink-400">{text}</span>
              </div>
            ))}
          </div>

          <Divider className="mt-10 mb-8" />

          <BottomBar
            left={<Copyright />}
            right={<LegalLinks />}
          />
        </div>
      </footer>
    </div>
  ),
};

// ═══════════════════════════════════════════════════════════
// 5 — Minimal
// ═══════════════════════════════════════════════════════════

export const Minimal: Story = {
  name: 'Minimal',
  render: () => (
    <footer className="bg-white dark:bg-ink-900 border-t border-ink-100 dark:border-ink-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6">
        <BottomBar
          left={<Logo />}
          center={
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {['Privacy', 'Terms', 'Cookies', 'Help', 'Contact'].map((item) => (
                <Hyperlink key={item} href="#" variant="muted" underline="none" className="text-xs">
                  {item}
                </Hyperlink>
              ))}
            </nav>
          }
          right={<Copyright />}
        />
      </div>
    </footer>
  ),
};

// ═══════════════════════════════════════════════════════════
// 6 — With contact details
// ═══════════════════════════════════════════════════════════

export const WithContactDetails: Story = {
  name: 'With contact details',
  render: () => (
    <footer className="bg-white dark:bg-ink-900 border-t border-ink-100 dark:border-ink-800">
      <div className={wrap}>

        {/* Two-column: brand+contact left, link columns right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left — brand + contact details */}
          <div>
            <Logo />
            <p className="mt-4 text-sm font-body text-ink-500 dark:text-ink-400 leading-relaxed max-w-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { icon: Globe,  label: 'Website', value: 'example.com',            href: 'https://example.com' },
                { icon: Mail,   label: 'Email',   value: 'hello@example.com',       href: 'mailto:hello@example.com' },
                { icon: Phone,  label: 'Phone',   value: '+1 (555) 000-0000',       href: 'tel:+15550000000' },
                { icon: MapPin, label: 'Address', value: '1 Placeholder St, NY',    href: undefined },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-primary-500/10 dark:bg-primary-500/15 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary-800 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold font-body uppercase tracking-widest text-ink-500 dark:text-ink-300 mb-0.5">
                      {label}
                    </p>
                    {href ? (
                      <Hyperlink href={href} variant="muted" underline="none" className="text-sm">
                        {value}
                      </Hyperlink>
                    ) : (
                      <p className="text-sm font-body text-ink-500 dark:text-ink-400">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <SocialRow />
            </div>
          </div>

          {/* Right — 2×2 link columns inside the half-width container */}
          <NavLinkColumns cols={4} />
        </div>

        <Divider className="mt-16 mb-8" />

        <BottomBar
          left={<Copyright />}
          right={
            <p className="text-xs font-body text-ink-500 dark:text-ink-300 text-right">
              Registered · Company No. 00000000
            </p>
          }
        />
      </div>
    </footer>
  ),
};
