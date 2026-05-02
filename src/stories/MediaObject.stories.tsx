import type { Meta, StoryObj } from '@storybook/react';
import { FileText, Image as ImageIcon, MessageSquare, ThumbsUp, Reply } from 'lucide-react';
import { MediaObject, MediaObjectList } from '../components/MediaObject';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';

const meta = {
  title: 'Layout/MediaObject',
  component: MediaObject,
  tags: ['autodocs'],
  argTypes: {
    align: { control: { type: 'select', options: ['top', 'center', 'bottom', 'stretch'] } },
    side: { control: { type: 'select', options: ['left', 'right'] } },
    gap: { control: { type: 'select', options: ['sm', 'md', 'lg'] } },
    responsive: { control: 'boolean' },
    media: { control: false },
  },
} satisfies Meta<typeof MediaObject>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Shared helpers ────────────────────────────────────────

function PlaceholderImg({
  size = 48,
  rounded = 'rounded-full',
}: {
  size?: number;
  rounded?: string;
}) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`${rounded} bg-ink-200 dark:bg-ink-700 flex items-center justify-center shrink-0`}
    >
      <ImageIcon className="w-5 h-5 text-ink-600 dark:text-ink-300" />
    </div>
  );
}

function Body({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">{title}</p>
      {sub && <p className="mt-0.5 text-sm font-body text-ink-500 dark:text-ink-300">{sub}</p>}
      {children}
    </div>
  );
}

// ── Playground ────────────────────────────────────────────

export const Playground: Story = {
  args: {
    align: 'top',
    side: 'left',
    gap: 'md',
    media: null,
    children: null,
  },
  render: (args) => (
    <div className="max-w-lg">
      <MediaObject {...args} media={<Avatar name="Alex Johnson" size={40} />}>
        <Body title="Alex Johnson" sub="Commented on your pull request · 2h ago">
          <p className="mt-2 text-sm font-body text-ink-600 dark:text-ink-300">
            Looks good to me! Just left a few suggestions on the auth module. Let me know what you
            think before we merge.
          </p>
        </Body>
      </MediaObject>
    </div>
  ),
};

// ── Alignments (center / bottom / right) ─────────────────

export const Alignments: Story = {
  name: 'Alignments',
  args: { media: null, children: null },
  render: () => (
    <div className="max-w-lg flex flex-col gap-8">
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-3">align=center</p>
        <MediaObject align="center" media={<PlaceholderImg />}>
          <Body title="Lindsay Walton" sub="Front-end Developer">
            <p className="mt-1 text-sm font-body text-ink-500 dark:text-ink-300">
              The media element is vertically centered against the content block, which works well
              for short labels or meta text.
            </p>
          </Body>
        </MediaObject>
      </div>
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-3">align=bottom</p>
        <MediaObject align="bottom" media={<PlaceholderImg />}>
          <Body title="Courtney Henry" sub="Designer">
            <p className="mt-1 text-sm font-body text-ink-500 dark:text-ink-300">
              Aligning to the bottom anchors the media element to the baseline of the content block
              — useful for signature-style layouts.
            </p>
          </Body>
        </MediaObject>
      </div>
      <div>
        <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-3">side=right</p>
        <MediaObject side="right" align="center" media={<PlaceholderImg />}>
          <Body title="Tom Cook" sub="Director of Product">
            <p className="mt-1 text-sm font-body text-ink-500 dark:text-ink-300">
              Flip the media to the right side for alternative layouts like right-aligned avatars or
              decorative imagery.
            </p>
          </Body>
        </MediaObject>
      </div>
    </div>
  ),
};

// ── Responsive ────────────────────────────────────────────

export const Responsive: Story = {
  name: 'Responsive (stacks on mobile)',
  args: { media: null, children: null },
  render: () => (
    <div className="max-w-lg">
      <MediaObject responsive media={<PlaceholderImg size={64} rounded="rounded-xl" />} gap="lg">
        <Body title="Whitney Francis" sub="Copywriter">
          <p className="mt-2 text-sm font-body text-ink-500 dark:text-ink-300">
            On small screens the media element stacks above the content. Resize the window to see
            the layout shift.
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="primary">
              View profile
            </Button>
            <Button size="sm" variant="secondary">
              Message
            </Button>
          </div>
        </Body>
      </MediaObject>
    </div>
  ),
};

// ── Nested ────────────────────────────────────────────────

export const Nested: Story = {
  name: 'Nested (threaded comments)',
  args: { media: null, children: null },
  render: () => (
    <div className="max-w-lg">
      <MediaObject media={<Avatar name="Alex Johnson" size={40} />} gap="md">
        <Body title="Alex Johnson" sub="2h ago">
          <p className="mt-1 text-sm font-body text-ink-600 dark:text-ink-300">
            Looks great! The responsive behaviour on mobile is much smoother now.
          </p>
          {/* Nested reply */}
          <div className="mt-4">
            <MediaObject media={<Avatar name="Sarah Chen" size={32} />} gap="sm">
              <Body title="Sarah Chen" sub="1h ago">
                <p className="mt-1 text-sm font-body text-ink-600 dark:text-ink-300">
                  Agreed — I also checked the accessibility audit and everything passes now.
                </p>
                {/* Double-nested */}
                <div className="mt-3">
                  <MediaObject media={<Avatar name="Marcus Lee" size={28} />} gap="sm">
                    <Body title="Marcus Lee" sub="45m ago">
                      <p className="mt-1 text-sm font-body text-ink-600 dark:text-ink-300">
                        Nice work both. Ready to ship!
                      </p>
                    </Body>
                  </MediaObject>
                </div>
              </Body>
            </MediaObject>
          </div>
        </Body>
      </MediaObject>
    </div>
  ),
};

// ── With list ─────────────────────────────────────────────

export const WithList: Story = {
  name: 'List — divided',
  args: { media: null, children: null },
  render: () => (
    <div className="max-w-lg">
      <MediaObjectList divided>
        {[
          { name: 'Alex Johnson', role: 'Product Manager', badge: 'Admin' },
          { name: 'Sarah Chen', role: 'Lead Engineer', badge: 'Member' },
          { name: 'Marcus Lee', role: 'Designer', badge: 'Member' },
          { name: 'Whitney Francis', role: 'Copywriter', badge: 'Viewer' },
        ].map((u) => (
          <MediaObject key={u.name} align="center" media={<Avatar name={u.name} size={40} />}>
            <div className="flex items-center justify-between gap-4">
              <Body title={u.name} sub={u.role} />
              <Badge label={u.badge} variant="neutral" />
            </div>
          </MediaObject>
        ))}
      </MediaObjectList>
    </div>
  ),
};

// ── Comment feed ──────────────────────────────────────────

export const CommentFeed: Story = {
  name: 'Comment feed',
  args: { media: null, children: null },
  render: () => {
    const comments = [
      {
        author: 'Alex Johnson',
        time: '2h ago',
        text: 'The new onboarding flow looks fantastic. Really intuitive for first-time users.',
      },
      {
        author: 'Sarah Chen',
        time: '90m ago',
        text: 'Agreed. I ran it through the accessibility checker — passes WCAG AA across the board.',
      },
      {
        author: 'Marcus Lee',
        time: '1h ago',
        text: 'One small thing: the CTA button on step 3 could use a bit more contrast. Otherwise ship it!',
      },
      {
        author: 'Whitney Francis',
        time: '30m ago',
        text: 'Already updated the copy per your suggestions. Ready for final review.',
      },
    ];

    return (
      <div className="max-w-lg">
        <MediaObjectList divided>
          {comments.map((c) => (
            <MediaObject key={c.author} media={<Avatar name={c.author} size={40} />} gap="md">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold font-body text-ink-900 dark:text-ink-50">
                    {c.author}
                  </p>
                  <p className="text-xs font-body text-ink-500 dark:text-ink-300 shrink-0">
                    {c.time}
                  </p>
                </div>
                <p className="text-sm font-body text-ink-600 dark:text-ink-300">{c.text}</p>
                <div className="mt-2 flex gap-4">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-xs font-body text-ink-500 hover:text-ink-600 dark:text-ink-300 dark:hover:text-ink-200 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    Like
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-xs font-body text-ink-500 hover:text-ink-600 dark:text-ink-300 dark:hover:text-ink-200 transition-colors"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    Reply
                  </button>
                </div>
              </div>
            </MediaObject>
          ))}
        </MediaObjectList>
      </div>
    );
  },
};

// ── Activity feed ─────────────────────────────────────────

export const ActivityFeed: Story = {
  name: 'Activity feed',
  args: { media: null, children: null },
  render: () => {
    const items = [
      {
        icon: <MessageSquare className="w-4 h-4" />,
        color: 'bg-primary-500',
        text: 'Alex Johnson left a comment on',
        target: 'Sprint planning doc',
        time: '2h ago',
      },
      {
        icon: <FileText className="w-4 h-4" />,
        color: 'bg-green-500',
        text: 'Sarah Chen created a new file',
        target: 'Q2 roadmap.pdf',
        time: '4h ago',
      },
      {
        icon: <ThumbsUp className="w-4 h-4" />,
        color: 'bg-slate-500',
        text: 'Marcus Lee approved',
        target: 'PR #482 – Auth refactor',
        time: '6h ago',
      },
      {
        icon: <MessageSquare className="w-4 h-4" />,
        color: 'bg-amber-500',
        text: 'Whitney Francis replied on',
        target: 'Design system notes',
        time: '1d ago',
      },
    ];

    return (
      <div className="max-w-lg">
        <MediaObjectList>
          {items.map((item, i) => (
            <MediaObject
              key={i}
              align="center"
              gap="sm"
              media={
                <div
                  className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-white shrink-0`}
                >
                  {item.icon}
                </div>
              }
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-body text-ink-600 dark:text-ink-300">
                  {item.text}{' '}
                  <span className="font-medium text-ink-900 dark:text-ink-50">{item.target}</span>
                </p>
                <p className="text-xs font-body text-ink-500 dark:text-ink-300 shrink-0">
                  {item.time}
                </p>
              </div>
            </MediaObject>
          ))}
        </MediaObjectList>
      </div>
    );
  },
};

// ── All alignments ────────────────────────────────────────

export const AllAlignments: Story = {
  name: 'All alignments',
  args: { media: null, children: null },
  render: () => (
    <div className="max-w-xl flex flex-col gap-6">
      {(['top', 'center', 'bottom'] as const).map((align) => (
        <div key={align} className="flex flex-col gap-1">
          <p className="text-xs font-body text-ink-500 dark:text-ink-300 mb-1">align="{align}"</p>
          <MediaObject
            align={align}
            media={<PlaceholderImg size={56} rounded="rounded-xl" />}
            gap="lg"
          >
            <Body title="Media object" sub={`align="${align}"`}>
              <p className="mt-1 text-sm font-body text-ink-500 dark:text-ink-300">
                This is a longer block of content to demonstrate how the media element is positioned
                vertically relative to a multi-line text block. The alignment affects only the media
                side.
              </p>
            </Body>
          </MediaObject>
        </div>
      ))}
    </div>
  ),
};
