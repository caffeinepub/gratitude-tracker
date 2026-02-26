interface FlowerProps {
  x?: number;
  y?: number;
  scale?: number;
}

export function Rose({ x = 0, y = 0, scale = 1 }: FlowerProps) {
  const id = `rose-${x}-${y}`;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <defs>
        <filter id={`wc-${id}`} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.06" numOctaves={4} seed={13} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={3.5} xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="0.5" result="blurred" />
          <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
        </filter>
        <filter id={`shadow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <radialGradient id={`outer-${id}`} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ffc0c8" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#e87090" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#c03060" stopOpacity="0.8" />
        </radialGradient>
        <radialGradient id={`mid-${id}`} cx="45%" cy="40%" r="58%">
          <stop offset="0%" stopColor="#f8a0b8" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#d85080" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#a02050" stopOpacity="0.8" />
        </radialGradient>
        <radialGradient id={`inner-${id}`} cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#f090b0" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#c04070" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#801840" stopOpacity="0.8" />
        </radialGradient>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="0" cy="12" rx="9" ry="2.5" fill="#a02050" fillOpacity="0.13" filter={`url(#shadow-${id})`} />

      {/* Outer petals — 5 petals */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <g key={i} transform={`rotate(${angle}, 0, 0)`}>
          <ellipse cx="0" cy="-8" rx="4.5" ry="6.5" fill={`url(#outer-${id})`} fillOpacity="0.78" filter={`url(#wc-${id})`} />
          <ellipse cx="0" cy="-6" rx="3" ry="4.5" fill="#c03060" fillOpacity="0.3" filter={`url(#wc-${id})`} />
          <ellipse cx="0" cy="-10.5" rx="2.5" ry="3" fill="#ffc0c8" fillOpacity="0.38" filter={`url(#wc-${id})`} />
          <line x1="0" y1="-3" x2="0" y2="-12" stroke="#a02050" strokeWidth="0.5" strokeOpacity="0.28" />
          <line x1="0" y1="-7" x2="-1.8" y2="-9.5" stroke="#a02050" strokeWidth="0.4" strokeOpacity="0.2" />
          <line x1="0" y1="-7" x2="1.8" y2="-9.5" stroke="#a02050" strokeWidth="0.4" strokeOpacity="0.2" />
        </g>
      ))}

      {/* Mid petals — 5 petals offset */}
      {[36, 108, 180, 252, 324].map((angle, i) => (
        <g key={i} transform={`rotate(${angle}, 0, 0)`}>
          <ellipse cx="0" cy="-6" rx="3.5" ry="5" fill={`url(#mid-${id})`} fillOpacity="0.72" filter={`url(#wc-${id})`} />
          <ellipse cx="0" cy="-4" rx="2.2" ry="3.5" fill="#a02050" fillOpacity="0.28" filter={`url(#wc-${id})`} />
          <ellipse cx="0" cy="-7.5" rx="1.8" ry="2.2" fill="#f8a0b8" fillOpacity="0.35" filter={`url(#wc-${id})`} />
        </g>
      ))}

      {/* Inner petals */}
      {[0, 120, 240].map((angle, i) => (
        <g key={i} transform={`rotate(${angle}, 0, 0)`}>
          <ellipse cx="0" cy="-4" rx="2.5" ry="3.5" fill={`url(#inner-${id})`} fillOpacity="0.8" filter={`url(#wc-${id})`} />
          <ellipse cx="0" cy="-2.5" rx="1.5" ry="2.2" fill="#801840" fillOpacity="0.3" filter={`url(#wc-${id})`} />
        </g>
      ))}

      {/* Center */}
      <circle cx="0" cy="0" r="3" fill="#c04070" fillOpacity="0.9" filter={`url(#wc-${id})`} />
      <circle cx="0" cy="0" r="1.8" fill="#e06090" fillOpacity="0.7" />
      <circle cx="-0.8" cy="-0.8" r="0.7" fill="#ffd0e0" fillOpacity="0.8" />
    </g>
  );
}
