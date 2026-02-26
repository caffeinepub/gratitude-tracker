interface FlowerProps {
  x?: number;
  y?: number;
  scale?: number;
}

export function CitrusBlossom({ x = 0, y = 0, scale = 1 }: FlowerProps) {
  const id = `cit-${x}-${y}`;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <defs>
        <filter id={`wc-${id}`} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.06 0.075" numOctaves={4} seed={7} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={3} xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="0.45" result="blurred" />
          <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
        </filter>
        <filter id={`shadow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <radialGradient id={`pg-${id}`} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fffef0" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#f8f0c0" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#e8d870" stopOpacity="0.8" />
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="0" cy="12" rx="9" ry="2.5" fill="#c0a020" fillOpacity="0.12" filter={`url(#shadow-${id})`} />

      {/* 5 petals */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <g key={i} transform={`rotate(${angle}, 0, 0)`}>
          {/* Base wash */}
          <ellipse cx="0" cy="-7" rx="4" ry="6" fill={`url(#pg-${id})`} fillOpacity="0.85" filter={`url(#wc-${id})`} />
          {/* Mid pigment pool */}
          <ellipse cx="0" cy="-5" rx="2.5" ry="4" fill="#e8d060" fillOpacity="0.38" filter={`url(#wc-${id})`} />
          {/* Tip fade */}
          <ellipse cx="0" cy="-10" rx="2" ry="2.5" fill="#fffef8" fillOpacity="0.45" filter={`url(#wc-${id})`} />
          {/* Vein */}
          <line x1="0" y1="-2" x2="0" y2="-11" stroke="#c0a020" strokeWidth="0.5" strokeOpacity="0.28" />
          <line x1="0" y1="-6" x2="-1.5" y2="-8.5" stroke="#c0a020" strokeWidth="0.4" strokeOpacity="0.2" />
          <line x1="0" y1="-6" x2="1.5" y2="-8.5" stroke="#c0a020" strokeWidth="0.4" strokeOpacity="0.2" />
        </g>
      ))}

      {/* Center */}
      <circle cx="0" cy="0" r="3.5" fill="#f8e840" fillOpacity="0.9" filter={`url(#wc-${id})`} />
      <circle cx="0" cy="0" r="2" fill="#e0c020" fillOpacity="0.7" />
      {[0, 60, 120, 180, 240, 300].map((a, i) => {
        const r = (a * Math.PI) / 180;
        return (
          <line
            key={i}
            x1="0" y1="0"
            x2={Math.cos(r) * 3.5} y2={Math.sin(r) * 3.5}
            stroke="#c0a020" strokeWidth="0.5" strokeOpacity="0.55"
          />
        );
      })}
    </g>
  );
}
