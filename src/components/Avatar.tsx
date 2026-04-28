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
      role="img"
      aria-label={name}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.35,
        flexShrink: 0,
      }}
      className={`rounded-full flex items-center justify-center font-bold font-display bg-primary-500 text-ink-900 select-none ${className}`}
    >
      {initials}
    </div>
  );
}
