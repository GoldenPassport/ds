export interface AvatarProps {
  name:      string;
  size?:     number;
  className?: string;
}

export function Avatar({ name, size = 32, className = '' }: AvatarProps) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      aria-label={name}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.35,
        background: 'linear-gradient(135deg, #FBBF24, #D4A500)',
        flexShrink: 0,
      }}
      className={`rounded-full flex items-center justify-center font-bold font-display text-ink-900 select-none ${className}`}
    >
      {initials}
    </div>
  );
}
