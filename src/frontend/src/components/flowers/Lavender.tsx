interface FlowerProps {
  x?: number;
  y?: number;
  scale?: number;
}

export function Lavender({ x = 0, y = 0, scale = 1 }: FlowerProps) {
  const id = `lav-${x}-${y}`;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <defs>
        <filter id={`wc-${id}`} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.07 0.09" numOctaves={4} seed={11} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.8} xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="0.4" result="blurred" />
          <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
        </filter>
        <filter id={`shadow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
        <linearGradient id={`lg-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e0d0f8" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#c0a0e8" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#9060c8" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="0" cy="14" rx="7" ry="2" fill="#7040a0" fillOpacity="0.12" filter={`url(#shadow-${id})`} />

      {/* Stem */}
      <line x1="0" y1="14" x2="0" y2="-2" stroke="#6a8a40" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="0" y1="6" x2="-3" y2="3" stroke="#6a8a40" strokeWidth="1" strokeLinecap="round" />
      <line x1="0" y1="6" x2="3" y2="3" stroke="#6a8a40" strokeWidth="1" strokeLinecap="round" />

      {/* Floret clusters — 3 wash layers each */}
      {[
        { x: 0, y: -2, r: 3.5 },
        { x: -3, y: 1, r: 2.8 },
        { x: 3, y: 1, r: 2.8 },
        { x: -2, y: -5, r: 2.5 },
        { x: 2, y: -5, r: 2.5 },
        { x: 0, y: -8, r: 2.2 },
      ].map((f, i) => (
        <g key={i}>
          {/* Base wash */}
          <ellipse cx={f.x} cy={f.y} rx={f.r} ry={f.r * 1.2} fill={`url(#lg-${id})`} fillOpacity="0.8" filter={`url(#wc-${id})`} />
          {/* Mid pigment pool */}
          <ellipse cx={f.x} cy={f.y + f.r * 0.3} rx={f.r * 0.65} ry={f.r * 0.8} fill="#9060c8" fillOpacity="0.35" filter={`url(#wc-${id})`} />
          {/* Highlight */}
          <ellipse cx={f.x - f.r * 0.2} cy={f.y - f.r * 0.2} rx={f.r * 0.4} ry={f.r * 0.5} fill="#e8d8f8" fillOpacity="0.35" filter={`url(#wc-${id})`} />
          {/* Detail line */}
          <line
            x1={f.x} y1={f.y - f.r * 0.8}
            x2={f.x} y2={f.y + f.r * 0.8}
            stroke="#7040a0" strokeWidth="0.4" strokeOpacity="0.25"
          />
        </g>
      ))}
    </g>
  );
}
