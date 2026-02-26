import { useRef } from "react";
import type { Season } from "../hooks/useSeason";

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  color: string;
  color2: string;
  color3: string;
  swayAmount: number;
  seed: number;
}

const SPRING_PALETTES = [
  ["#f4b8d0", "#e888b0", "#fce8f0"],
  ["#f8c0d8", "#e898b8", "#fdf0f8"],
  ["#f0a8c8", "#d878a0", "#fce0f0"],
  ["#f8d0e0", "#e8a0c0", "#fff0f8"],
  ["#e1bee7", "#ce93d8", "#f3e5f5"],
  ["#ffd7e8", "#f48fb1", "#fce4ec"],
];

const AUTUMN_PALETTES = [
  ["#d06020", "#a04010", "#f09040"],
  ["#c85020", "#983010", "#e87030"],
  ["#d08020", "#a06010", "#f0a040"],
  ["#b84020", "#882010", "#d86030"],
  ["#c07030", "#905020", "#e09050"],
  ["#e65100", "#bf360c", "#ff8f00"],
];

const WINTER_COLORS = ["#e8f0f8", "#d0e4f4", "#f0f8ff", "#e3f2fd", "#bbdefb"];

// Irregular petal path for spring — varied organic shapes
function petalPath(seed: number): string {
  const s = seed % 7;
  const paths = [
    "M0,-8 C3,-6 5,-2 4,2 C3,6 0,8 0,8 C0,8 -3,6 -4,2 C-5,-2 -3,-6 0,-8 Z",
    "M0,-7 C4,-5 6,-1 3,3 C1,7 0,8 0,8 C0,8 -2,6 -4,2 C-6,-2 -4,-5 0,-7 Z",
    "M0,-9 C2,-6 6,-3 5,1 C4,5 1,8 0,8 C-1,8 -4,5 -5,1 C-6,-3 -2,-6 0,-9 Z",
    "M0,-7 C5,-5 5,0 3,4 C1,7 0,8 0,8 C-1,7 -3,5 -4,2 C-5,-1 -4,-5 0,-7 Z",
    "M0,-8 C3,-7 6,-2 4,2 C2,6 0,9 0,9 C-1,7 -4,4 -4,0 C-4,-4 -3,-7 0,-8 Z",
    "M0,-6 C4,-5 7,-1 5,3 C3,7 0,8 0,8 C-1,7 -4,5 -5,1 C-6,-3 -3,-5 0,-6 Z",
    "M0,-8 C2,-5 5,-2 5,2 C5,5 2,8 0,8 C-2,8 -5,5 -5,2 C-5,-2 -2,-5 0,-8 Z",
  ];
  return paths[s];
}

// Irregular multi-lobed leaf path for autumn
function leafPath(seed: number): string {
  const s = seed % 6;
  const paths = [
    "M0,-10 C4,-8 8,-4 7,0 C6,4 3,8 0,10 C-3,8 -6,4 -7,0 C-8,-4 -4,-8 0,-10 Z",
    "M0,-10 C5,-7 9,-2 7,2 C5,7 2,10 0,10 C-2,9 -5,6 -6,2 C-8,-3 -4,-8 0,-10 Z",
    "M0,-9 C3,-7 7,-3 8,1 C9,5 5,9 0,10 C-3,8 -6,4 -7,0 C-8,-4 -3,-8 0,-9 Z",
    "M0,-10 C6,-7 8,-1 6,3 C4,8 1,10 0,10 C-2,9 -5,6 -7,2 C-9,-2 -5,-8 0,-10 Z",
    "M0,-8 C4,-6 8,-2 8,2 C8,6 4,9 0,10 C-3,8 -7,5 -8,1 C-9,-3 -4,-7 0,-8 Z",
    "M0,-10 C3,-8 6,-4 7,0 C8,4 5,8 0,10 C-4,8 -7,4 -7,0 C-7,-4 -3,-8 0,-10 Z",
  ];
  return paths[s];
}

function generateParticles(season: Season, count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const seed = i * 137 + 42;
    const isSpring = season === "spring";
    const isAutumn = season === "autumn";

    let color = "#ffffff", color2 = "#ffffff", color3 = "#ffffff";
    if (isSpring) {
      const palette = SPRING_PALETTES[seed % SPRING_PALETTES.length];
      [color, color2, color3] = palette;
    } else if (isAutumn) {
      const palette = AUTUMN_PALETTES[seed % AUTUMN_PALETTES.length];
      [color, color2, color3] = palette;
    } else {
      color = WINTER_COLORS[seed % WINTER_COLORS.length];
      color2 = WINTER_COLORS[(seed + 2) % WINTER_COLORS.length];
      color3 = WINTER_COLORS[(seed + 4) % WINTER_COLORS.length];
    }

    return {
      id: i,
      x: (seed * 31 + 17) % 100,
      delay: (seed * 7 % 8000) / 1000,
      duration: season === "winter" ? 5 + (seed % 4) : 6 + (seed % 8),
      size: season === "winter" ? 4 + (seed % 4) : 6 + (seed % 10),
      rotation: seed % 360,
      color,
      color2,
      color3,
      swayAmount: 20 + (seed % 40),
      seed,
    };
  });
}

// Spring petal — irregular SVG shape with multi-layer watercolor fills
function PetalShape({ color, color2, color3, size, seed }: {
  color: string; color2: string; color3: string; size: number; seed: number;
}) {
  const filterId = `petal-wc-${seed}`;
  return (
    <svg width={size * 2} height={size * 2.5} viewBox="-10 -10 20 22" fill="none">
      <defs>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.08 0.1" numOctaves={3} seed={seed % 20} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.5} xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="0.4" result="blurred" />
          <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
        </filter>
      </defs>
      {/* Base wash */}
      <path d={petalPath(seed)} fill={color} fillOpacity="0.82" filter={`url(#${filterId})`} />
      {/* Mid pigment pool */}
      <g transform="scale(0.65)">
        <path d={petalPath(seed)} fill={color2} fillOpacity="0.38" filter={`url(#${filterId})`} />
      </g>
      {/* Tip highlight */}
      <g transform="scale(0.4) translate(0,-3)">
        <path d={petalPath(seed)} fill={color3} fillOpacity="0.32" filter={`url(#${filterId})`} />
      </g>
      {/* Vein */}
      <line x1="0" y1="-6" x2="0" y2="6" stroke={color2} strokeWidth="0.5" strokeOpacity="0.35" />
    </svg>
  );
}

// Autumn leaf — irregular multi-lobed silhouette with layered warm-tone fills
function LeafShape({ color, color2, color3, size, seed }: {
  color: string; color2: string; color3: string; size: number; seed: number;
}) {
  const filterId = `leaf-wc-${seed}`;
  return (
    <svg width={size * 2} height={size * 2.5} viewBox="-12 -12 24 26" fill="none">
      <defs>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.07 0.09" numOctaves={3} seed={(seed + 5) % 20} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={3} xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="0.5" result="blurred" />
          <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
        </filter>
      </defs>
      {/* Base wash */}
      <path d={leafPath(seed)} fill={color} fillOpacity="0.82" filter={`url(#${filterId})`} />
      {/* Mid tone */}
      <g transform="scale(0.7)">
        <path d={leafPath(seed)} fill={color2} fillOpacity="0.35" filter={`url(#${filterId})`} />
      </g>
      {/* Highlight */}
      <g transform="scale(0.45) translate(0,-2)">
        <path d={leafPath(seed)} fill={color3} fillOpacity="0.28" filter={`url(#${filterId})`} />
      </g>
      {/* Midrib */}
      <line x1="0" y1="-8" x2="0" y2="8" stroke={color2} strokeWidth="0.6" strokeOpacity="0.4" />
      {/* Side veins */}
      <line x1="0" y1="-3" x2="-4" y2="0" stroke={color2} strokeWidth="0.4" strokeOpacity="0.28" />
      <line x1="0" y1="-3" x2="4" y2="0" stroke={color2} strokeWidth="0.4" strokeOpacity="0.28" />
      <line x1="0" y1="2" x2="-4" y2="5" stroke={color2} strokeWidth="0.4" strokeOpacity="0.22" />
      <line x1="0" y1="2" x2="4" y2="5" stroke={color2} strokeWidth="0.4" strokeOpacity="0.22" />
    </svg>
  );
}

// Snowflake — crystalline with watercolor-soft edges
function SnowflakeShape({ color, size, seed }: { color: string; size: number; seed: number }) {
  const filterId = `snow-wc-${seed}`;
  return (
    <svg width={size * 2} height={size * 2} viewBox="-10 -10 20 20" fill="none">
      <defs>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves={2} seed={(seed + 3) % 20} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={1.5} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      {[0, 60, 120].map((a, idx) => {
        const r = (a * Math.PI) / 180;
        const x2 = Math.cos(r) * 8;
        const y2 = Math.sin(r) * 8;
        return (
          <g key={idx} filter={`url(#${filterId})`}>
            <line x1={-x2} y1={-y2} x2={x2} y2={y2} stroke={color} strokeWidth="1" strokeOpacity="0.72" />
          </g>
        );
      })}
      <circle cx="0" cy="0" r="1.5" fill={color} fillOpacity="0.75" />
    </svg>
  );
}

interface FallingParticlesProps {
  season: Season;
}

export function FallingParticles({ season }: FallingParticlesProps) {
  const particlesRef = useRef<Particle[]>([]);

  if (season === "summer") return null;

  const count = season === "winter" ? 10 : 16;

  if (particlesRef.current.length === 0 || particlesRef.current.length !== count) {
    particlesRef.current = generateParticles(season, count);
  }

  const particles = particlesRef.current;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 7 }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className={
            season === "autumn"
              ? "particle-tumble"
              : season === "winter"
              ? "particle-snow"
              : "particle-drift"
          }
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: "-40px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            transform: `rotate(${p.rotation}deg)`,
            "--sway": `${p.swayAmount}px`,
          } as React.CSSProperties}
        >
          {season === "spring" && (
            <PetalShape color={p.color} color2={p.color2} color3={p.color3} size={p.size} seed={p.seed} />
          )}
          {season === "autumn" && (
            <LeafShape color={p.color} color2={p.color2} color3={p.color3} size={p.size} seed={p.seed} />
          )}
          {season === "winter" && (
            <SnowflakeShape color={p.color} size={p.size} seed={p.seed} />
          )}
        </div>
      ))}
    </div>
  );
}
