import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FileText, User, Mail, Phone, MapPin, Calendar, Tag, FolderOpen, Link2 } from 'lucide-react';
import { Drawer } from '../components/Drawer';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { Divider } from '../components/Divider';

const meta = {
  title: 'Overlays/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    placement: { control: { type: 'select', options: ['left', 'right', 'top', 'bottom'] } },
    size:      { control: { type: 'select', options: ['sm', 'md', 'lg', 'xl', 'full'] } },
    children:  { control: false },
    footer:    { control: false },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Trigger wrapper ───────────────────────────────────────

function Demo({ label = 'Open drawer', children }: { label?: string; children: (open: boolean, setOpen: (v: boolean) => void) => React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-8">
      <Button variant="primary" onClick={() => setOpen(true)}>{label}</Button>
      {children(open, setOpen)}
    </div>
  );
}

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    open:      false,
    onClose:   () => {},
    title:     'Panel title',
    placement: 'right',
    size:      'md',
    children:  null,
  },
  render: (args) => (
    <Demo>
      {(open, setOpen) => (
        <Drawer {...args} open={open} onClose={() => setOpen(false)}>
          <p className="text-sm font-body text-ink-600 dark:text-ink-300">
            Drawer content goes here. You can put forms, details, lists, or any arbitrary content inside.
          </p>
        </Drawer>
      )}
    </Demo>
  ),
};

// ── Basic ─────────────────────────────────────────────────

export const Basic: Story = {
  name: 'Basic',
  args: { open: false, onClose: () => {}, children: null },
  render: () => (
    <Demo>
      {(open, setOpen) => (
        <Drawer open={open} onClose={() => setOpen(false)} title="Notifications">
          <div className="flex flex-col gap-4">
            {['Sprint planning updated', 'New comment on PR #482', 'Deployment succeeded', 'Alex Johnson mentioned you'].map(n => (
              <div key={n} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0" />
                <p className="text-sm font-body text-ink-700 dark:text-ink-300">{n}</p>
              </div>
            ))}
          </div>
        </Drawer>
      )}
    </Demo>
  ),
};

// ── Close button outside ──────────────────────────────────

export const CloseOutside: Story = {
  name: 'Close button outside',
  args: { open: false, onClose: () => {}, children: null },
  render: () => (
    <Demo label="Close button outside">
      {(open, setOpen) => (
        <Drawer open={open} onClose={() => setOpen(false)} title="File details" closeOutside closeButton={false}>
          <p className="text-sm font-body text-ink-600 dark:text-ink-300">
            The close button sits outside the panel — common when no header is needed or you want a cleaner panel surface.
          </p>
        </Drawer>
      )}
    </Demo>
  ),
};

// ── No header ─────────────────────────────────────────────

export const NoHeader: Story = {
  name: 'No header (empty)',
  args: { open: false, onClose: () => {}, children: null },
  render: () => (
    <Demo label="Open (no header)">
      {(open, setOpen) => (
        <Drawer open={open} onClose={() => setOpen(false)} closeButton={false}>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mb-4 text-xs font-body text-ink-500 dark:text-ink-300 hover:text-ink-700 dark:hover:text-ink-200 transition-colors"
          >
            ← Close
          </button>
          <p className="text-sm font-body text-ink-600 dark:text-ink-300">
            No header — the close affordance is left to the content or backdrop click.
          </p>
        </Drawer>
      )}
    </Demo>
  ),
};

// ── Wide ─────────────────────────────────────────────────

export const Wide: Story = {
  name: 'Wide',
  args: { open: false, onClose: () => {}, children: null },
  render: () => (
    <Demo label="Open wide drawer">
      {(open, setOpen) => (
        <Drawer open={open} onClose={() => setOpen(false)} title="Analytics overview" size="xl">
          <p className="text-sm font-body text-ink-600 dark:text-ink-300">
            A wider drawer gives room for data-dense content like tables, charts, or multi-column layouts.
          </p>
        </Drawer>
      )}
    </Demo>
  ),
};

// ── With sticky footer ────────────────────────────────────

export const StickyFooter: Story = {
  name: 'With sticky footer',
  args: { open: false, onClose: () => {}, children: null },
  render: () => (
    <Demo>
      {(open, setOpen) => (
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Edit details"
          description="Changes are saved when you click Update."
          footer={
            <div className="flex justify-end gap-2.5">
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>Update</Button>
            </div>
          }
        >
          <div className="flex flex-col gap-4">
            <Input label="Name"        placeholder="e.g. Sprint planning" />
            <Input label="Description" placeholder="Optional description"  />
            <Input label="Owner"       placeholder="Assign an owner"       />
          </div>
        </Drawer>
      )}
    </Demo>
  ),
};

// ── Create project form ───────────────────────────────────

export const CreateForm: Story = {
  name: 'Create project form',
  args: { open: false, onClose: () => {}, children: null },
  render: () => (
    <Demo label="New project">
      {(open, setOpen) => (
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="New project"
          description="Fill in the details below to get started."
          size="lg"
          footer={
            <div className="flex justify-end gap-2.5">
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary">Create project</Button>
            </div>
          }
        >
          <div className="flex flex-col gap-5">
            <Input label="Project name"  placeholder="e.g. Q3 Launch"    />
            <Input label="Slug"          placeholder="q3-launch"          />
            <Input label="Description"   placeholder="What's this project about?" />
            <div>
              <label className="block text-[13px] font-semibold font-body text-ink-900 dark:text-ink-50 mb-1.5">
                Visibility
              </label>
              <div className="flex flex-col gap-2">
                {['Public — anyone in the workspace', 'Private — invite only'].map((opt, i) => (
                  <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
                    <input type="radio" name="visibility" defaultChecked={i === 0}
                      className="accent-primary-500 w-4 h-4" />
                    <span className="text-sm font-body text-ink-700 dark:text-ink-300">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </Demo>
  ),
};

// ── User profile ──────────────────────────────────────────

export const UserProfile: Story = {
  name: 'User profile',
  args: { open: false, onClose: () => {}, children: null },
  render: () => (
    <Demo label="View profile">
      {(open, setOpen) => (
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Member profile"
          size="lg"
          footer={
            <div className="flex justify-between gap-2">
              <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
              <Button variant="primary">Edit profile</Button>
            </div>
          }
        >
          {/* Avatar + name */}
          <div className="flex flex-col items-center text-center pb-6 mb-6 border-b border-ink-100 dark:border-ink-700">
            <Avatar name="Alex Johnson" size={72} />
            <h2 className="mt-3 text-lg font-bold font-display text-ink-900 dark:text-ink-50">Alex Johnson</h2>
            <p className="text-sm font-body text-ink-500 dark:text-ink-300">Product Manager</p>
            <div className="mt-2 flex gap-2">
              <Badge label="Admin"  variant="active"  />
              <Badge label="Pro"    variant="running" />
            </div>
          </div>

          {/* Details */}
          <dl className="flex flex-col gap-4">
            {[
              { icon: <Mail    className="w-4 h-4" />, label: 'Email',    value: 'alex@acme.com'       },
              { icon: <Phone   className="w-4 h-4" />, label: 'Phone',    value: '+1 (555) 234-5678'   },
              { icon: <MapPin  className="w-4 h-4" />, label: 'Location', value: 'San Francisco, CA'   },
              { icon: <Calendar className="w-4 h-4"/>, label: 'Joined',   value: 'January 2023'        },
            ].map(row => (
              <div key={row.label} className="flex items-center gap-3">
                <span className="text-ink-500 dark:text-ink-300 shrink-0">{row.icon}</span>
                <div>
                  <dt className="text-xs font-body text-ink-400 dark:text-ink-300">{row.label}</dt>
                  <dd className="text-sm font-medium font-body text-ink-900 dark:text-ink-50">{row.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </Drawer>
      )}
    </Demo>
  ),
};

// ── File details ──────────────────────────────────────────

export const FileDetails: Story = {
  name: 'File details',
  args: { open: false, onClose: () => {}, children: null },
  render: () => (
    <Demo label="View file">
      {(open, setOpen) => (
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="File details"
          size="lg"
          footer={
            <div className="flex gap-2.5">
              <Button variant="secondary" className="flex-1">Download</Button>
              <Button variant="primary"   className="flex-1">Share</Button>
            </div>
          }
        >
          {/* Preview */}
          <div className="flex items-center justify-center h-36 rounded-xl bg-ink-50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-700 mb-6">
            <FileText className="w-12 h-12 text-ink-300 dark:text-ink-600" />
          </div>

          <h3 className="text-sm font-bold font-display text-ink-900 dark:text-ink-50 mb-4">
            Q2-Roadmap-Final.pdf
          </h3>

          <Divider />

          <dl className="mt-4 flex flex-col gap-3">
            {[
              { icon: <User      className="w-4 h-4" />, label: 'Uploaded by', value: 'Sarah Chen'       },
              { icon: <Calendar  className="w-4 h-4" />, label: 'Date',        value: 'Apr 18, 2026'     },
              { icon: <FolderOpen className="w-4 h-4"/>, label: 'Folder',      value: 'Product / Q2'     },
              { icon: <Tag       className="w-4 h-4" />, label: 'Tags',        value: 'roadmap, planning' },
              { icon: <Link2     className="w-4 h-4" />, label: 'Size',        value: '2.4 MB'           },
            ].map(row => (
              <div key={row.label} className="flex items-center gap-3">
                <span className="text-ink-500 dark:text-ink-300 shrink-0">{row.icon}</span>
                <div className="flex items-center gap-2 min-w-0">
                  <dt className="text-xs font-body text-ink-400 dark:text-ink-300 w-24 shrink-0">{row.label}</dt>
                  <dd className="text-sm font-body text-ink-700 dark:text-ink-300 truncate">{row.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </Drawer>
      )}
    </Demo>
  ),
};

// ── Placements ────────────────────────────────────────────

export const Placements: Story = {
  name: 'All placements',
  args: { open: false, onClose: () => {}, children: null },
  render: () => {
    const [active, setActive] = useState<'left' | 'right' | 'top' | 'bottom' | null>(null);
    return (
      <div className="p-8 flex flex-wrap gap-3">
        {(['left', 'right', 'top', 'bottom'] as const).map(p => (
          <Button key={p} variant="secondary" onClick={() => setActive(p)}>
            Open {p}
          </Button>
        ))}
        {(['left', 'right', 'top', 'bottom'] as const).map(p => (
          <Drawer
            key={p}
            open={active === p}
            onClose={() => setActive(null)}
            title={`${p.charAt(0).toUpperCase() + p.slice(1)} drawer`}
            placement={p}
          >
            <p className="text-sm font-body text-ink-600 dark:text-ink-300">
              This drawer slides in from the <strong>{p}</strong>.
            </p>
          </Drawer>
        ))}
      </div>
    );
  },
};

// ── In context ────────────────────────────────────────────

export const InContext: Story = {
  name: 'In context — app page',
  args: { open: false, onClose: () => {}, children: null },
  render: () => (
    <Demo label="Open details panel">
      {(open, setOpen) => (
        <>
          <div className="min-h-screen bg-ink-50 dark:bg-ink-900 p-8">
            <h1 className="text-2xl font-bold font-display text-ink-900 dark:text-ink-50">Projects</h1>
            <p className="mt-1 text-sm font-body text-ink-500 dark:text-ink-300">
              Click "Open details panel" above to reveal the side drawer.
            </p>
          </div>
          <Drawer
            open={open}
            onClose={() => setOpen(false)}
            title="Sprint planning"
            description="Updated Apr 24, 2026"
            size="lg"
            footer={
              <div className="flex justify-end gap-2.5">
                <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
                <Button variant="primary">Edit</Button>
              </div>
            }
          >
            <p className="text-sm font-body text-ink-600 dark:text-ink-300">
              Detailed view of the selected item. This pattern is commonly used for item inspection without leaving the current page context.
            </p>
          </Drawer>
        </>
      )}
    </Demo>
  ),
};
