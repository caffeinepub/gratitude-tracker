interface FlowerProps {
  x?: number;
  y?: number;
  scale?: number;
}

export function Poppy({ x = 0, y = 0, scale = 1 }: FlowerProps) {
  const id = `pop-${x}-${y}`;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <defs>
        <filter id={`wc-${id}`} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.065" numOctaves={4} seed={17} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={4} xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="0.55" result="blurred" />
          <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
        </filter>
        <filter id={`shadow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <radialGradient id={`pg-${id}`} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ffd0b0" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#f07040" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#c03020" stopOpacity="0.82" />
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="0" cy="12" rx="9" ry="2.5" fill="#a02010" fillOpacity="0.14" filter={`url(#shadow-${id})`} />

      {/* 4 petals */}
      {[0, 90, 180, 270].map((angle, i) => (
        <g key={i} transform={`rotate(${angle}, 0, 0)`}>
          {/* Base wash */}
          <ellipse cx="0" cy="-7" rx="5" ry="7" fill={`url(#pg-${id})`} fillOpacity="0.82" filter={`url(#wc-${id})`} />
          {/* Mid pigment pool */}
          <ellipse cx="0" cy="-4" rx="3.5" ry="5" fill="#c03020" fillOpacity="0.32" filter={`url(#wc-${id})`} />
          {/* Tip fade */}
          <ellipse cx="0" cy="-10.5" rx="3" ry="3.5" fill="#ffd0b0" fillOpacity="0.42" filter={`url(#wc-${id})`} />
          {/* Dark base blotch */}
          <ellipse cx="0" cy="-2" rx="2" ry="2.5" fill="#601010" fillOpacity="0.28" filter={`url(#wc-${id})`} />
          {/* Vein */}
          <line x1="0" y1="-2" x2="0" y2="-12" stroke="#a02010" strokeWidth="0.6" strokeOpacity="0.3" />
          <line x1="0" y1="-7" x2="-2" y2="-10" stroke="#a02010" strokeWidth="0.45" strokeOpacity="0.22" />
          <line x1="0" y1="-7" x2="2" y2="-10" stroke="#a02010" strokeWidth="0.45" strokeOpacity="0.22" />
        </g>
      ))}

      {/* Center */}
      <circle cx="0" cy="0" r="4" fill="#1a1a1a" fillOpacity="0.88" filter={`url(#wc-${id})`} />
      <circle cx="0" cy="0" r="2.5" fill="#2a2a2a" fillOpacity="0.7" />
      {/* Stamen dots */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
        const r = (a * Math.PI) / 180;
        return (
          <circle key={i} cx={Math.cos(r) * 3} cy={Math.sin(r) * 3} r="0.6" fill="#f0d020" fillOpacity="0.8" />
        );
      })}
    </g>
  );
}
