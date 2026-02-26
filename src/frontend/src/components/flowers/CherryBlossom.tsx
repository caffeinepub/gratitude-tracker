interface FlowerProps {
  x?: number;
  y?: number;
  scale?: number;
}

export function CherryBlossom({ x = 0, y = 0, scale = 1 }: FlowerProps) {
  const id = `cb-${x}-${y}`;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <defs>
        <filter id={`wc-${id}`} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.055 0.07" numOctaves={4} seed={3} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={3.5} xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="0.5" result="blurred" />
          <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
        </filter>
        <filter id={`shadow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <radialGradient id={`pg-${id}`} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fce8f0" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#f4b8d0" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#e888b0" stopOpacity="0.8" />
        </radialGradient>
      </defs>

      {/* Soft ground shadow */}
      <ellipse cx="0" cy="12" rx="9" ry="2.5" fill="#c060a0" fillOpacity="0.12" filter={`url(#shadow-${id})`} />

      {/* 5 petals — each with 3 wash layers */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <g key={i} transform={`rotate(${angle}, 0, 0)`}>
          {/* Base wash */}
          <ellipse cx="0" cy="-7" rx="4.5" ry="6.5" fill={`url(#pg-${id})`} fillOpacity="0.82" filter={`url(#wc-${id})`} />
          {/* Mid wash — pigment pooling toward base */}
          <ellipse cx="0" cy="-5" rx="3" ry="4.5" fill="#e888b0" fillOpacity="0.35" filter={`url(#wc-${id})`} />
          {/* Tip fade */}
          <ellipse cx="0" cy="-10" rx="2.5" ry="3" fill="#fce8f0" fillOpacity="0.4" filter={`url(#wc-${id})`} />
          {/* Vein lines */}
          <line x1="0" y1="-2" x2="0" y2="-11" stroke="#d060a0" strokeWidth="0.5" strokeOpacity="0.3" />
          <line x1="0" y1="-6" x2="-1.5" y2="-9" stroke="#d060a0" strokeWidth="0.4" strokeOpacity="0.2" />
          <line x1="0" y1="-6" x2="1.5" y2="-9" stroke="#d060a0" strokeWidth="0.4" strokeOpacity="0.2" />
        </g>
      ))}

      {/* Center */}
      <circle cx="0" cy="0" r="3.5" fill="#f8e0f0" fillOpacity="0.9" filter={`url(#wc-${id})`} />
      <circle cx="0" cy="0" r="2" fill="#e8a0c8" fillOpacity="0.7" />
      {/* Stamens */}
      {[0, 60, 120, 180, 240, 300].map((a, i) => {
        const r = (a * Math.PI) / 180;
        return (
          <line
            key={i}
            x1="0" y1="0"
            x2={Math.cos(r) * 3.5} y2={Math.sin(r) * 3.5}
            stroke="#d060a0" strokeWidth="0.5" strokeOpacity="0.6"
          />
        );
      })}
    </g>
  );
}
