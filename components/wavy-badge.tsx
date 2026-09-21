/**
 * The scalloped number badge from the portfolio's index page. Built as a path
 * rather than an icon import because it is a piece of the identity, not a UI
 * glyph: twelve bumps around a circle, single white stroke.
 */
function scallopPath(bumps = 12, radius = 40, amplitude = 6) {
  const cx = 50;
  const cy = 50;
  const point = (i: number, r: number) => {
    const a = (i / bumps) * Math.PI * 2 - Math.PI / 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  };

  const [sx, sy] = point(0, radius);
  let d = `M ${sx.toFixed(2)} ${sy.toFixed(2)}`;
  for (let i = 0; i < bumps; i += 1) {
    const [qx, qy] = point(i + 0.5, radius + amplitude);
    const [px, py] = point(i + 1, radius);
    d += ` Q ${qx.toFixed(2)} ${qy.toFixed(2)} ${px.toFixed(2)} ${py.toFixed(2)}`;
  }
  return `${d} Z`;
}

const path = scallopPath();

export function WavyBadge({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  return (
    <span className={`relative inline-grid shrink-0 place-items-center ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden
        className="absolute inset-0 size-full"
      >
        <path
          d={path}
          stroke="currentColor"
          strokeWidth={3}
          strokeLinejoin="round"
        />
      </svg>
      <span className="type-display relative text-[0.9em] leading-none">
        {value}
      </span>
    </span>
  );
}
