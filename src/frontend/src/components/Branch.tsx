import { useState, useRef } from 'react';
import type { GratitudeEntry } from '../backend';
import type { PlantType } from '../utils/plantGrouping';
import type { Season } from '../hooks/useSeason';
import { formatRelativeTime } from '@/utils/formatDate';

interface BranchProps {
  entry: GratitudeEntry;
  index: number;
  plantType?: PlantType;
  season?: Season;
}

// Seasonal leaf color palettes
const SPRING_COLORS = ['#a5d6a7', '#c8e6c9', '#f8bbd0', '#f48fb1', '#ce93d8', '#80cbc4', '#b2dfdb'];
const SUMMER_COLORS = ['#2e7d32', '#388e3c', '#43a047', '#1b5e20', '#33691e', '#558b2f', '#689f38'];
const AUTUMN_COLORS = ['#e65100', '#bf360c', '#f57f17', '#ff8f00', '#6d4c41', '#d84315', '#ff6f00', '#e64a19'];
const WINTER_COLORS = ['#90a4ae', '#b0bec5', '#cfd8dc', '#78909c', '#546e7a', '#eceff1', '#b3e5fc'];

// Per-plant-type color palettes
const OAK_COLORS = ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#D2691E', '#FF8C00', '#FFA500'];
const CYPRESS_COLORS = ['#2E8B57', '#3CB371', '#228B22', '#006400', '#32CD32', '#90EE90', '#00FA9A'];
const LOLLIPOP_COLORS = ['#FF1493', '#FF69B4', '#FFB6C1', '#FF6347', '#FF4500', '#FF8C00', '#FFD700', '#DA70D6'];
const CITRUS_COLORS = ['#ff8f00', '#f57f17', '#e65100', '#2e7d32', '#388e3c', '#ff6f00'];
const SHRUB_COLORS = ['#7b1fa2', '#8e24aa', '#9c27b0', '#ab47bc', '#ce93d8', '#4a148c'];
const WILLOW_COLORS = ['#558b2f', '#689f38', '#7cb342', '#8bc34a', '#aed581', '#c5e1a5'];
const MAGNOLIA_COLORS = ['#fce4ec', '#f8bbd0', '#f48fb1', '#f06292', '#ec407a', '#e91e63'];

const DEFAULT_COLORS = [
  '#FF4444', '#FF6B35', '#FFD700', '#FF69B4', '#DC143C',
  '#FF8C42', '#FFC300', '#FF1493', '#9B59B6', '#FF7F50',
  '#FA8072', '#E74C3C', '#F39C12', '#8E44AD', '#FF6347',
  '#FFB347', '#E91E63', '#00BCD4', '#4CAF50', '#FF5722',
];

function getLeafColor(index: number, plantType?: PlantType, season?: Season): string {
  // Season overrides plant type for foliage color
  if (season === 'spring') return SPRING_COLORS[index % SPRING_COLORS.length];
  if (season === 'summer') return SUMMER_COLORS[index % SUMMER_COLORS.length];
  if (season === 'autumn') return AUTUMN_COLORS[index % AUTUMN_COLORS.length];
  if (season === 'winter') return WINTER_COLORS[index % WINTER_COLORS.length];

  if (plantType === 'oak') return OAK_COLORS[index % OAK_COLORS.length];
  if (plantType === 'cypress') return CYPRESS_COLORS[index % CYPRESS_COLORS.length];
  if (plantType === 'lollipop') return LOLLIPOP_COLORS[index % LOLLIPOP_COLORS.length];
  if (plantType === 'citrus') return CITRUS_COLORS[index % CITRUS_COLORS.length];
  if (plantType === 'shrub') return SHRUB_COLORS[index % SHRUB_COLORS.length];
  if (plantType === 'willow') return WILLOW_COLORS[index % WILLOW_COLORS.length];
  if (plantType === 'magnolia') return MAGNOLIA_COLORS[index % MAGNOLIA_COLORS.length];

  const colorIndex = (index * 3 + Math.floor(index / 4) * 2) % DEFAULT_COLORS.length;
  return DEFAULT_COLORS[colorIndex];
}

// Watercolor-style leaf with soft edges
function LeafSvg({ color, size = 22, rotation = 0, season }: { color: string; size?: number; rotation?: number; season?: Season }) {
  const filterId = `leaf-wc-${color.replace('#', '')}-${Math.round(rotation)}`;
  // Winter: bare/muted, spring: soft rounded, others: maple
  const isWinter = season === 'winter';
  const isSpring = season === 'spring';

  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 40 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)`, filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.15))' }}
    >
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      {isSpring ? (
        // Soft rounded petal-like leaf for spring
        <>
          <ellipse cx="20" cy="26" rx="14" ry="20" fill={color} opacity="0.82" filter={`url(#${filterId})`} />
          <ellipse cx="20" cy="20" rx="9" ry="13" fill={color} opacity="0.4" />
          <path d="M20 8 L20 40" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" />
          <ellipse cx="15" cy="18" rx="3" ry="5" fill="rgba(255,255,255,0.18)" transform="rotate(-15 15 18)" />
        </>
      ) : isWinter ? (
        // Bare/skeletal leaf for winter
        <>
          <path
            d="M20 4 C20 4 24 8 28 7 C32 6 34 10 32 13 C36 12 39 15 37 18 C35 21 31 20 31 20 C33 23 32 27 29 27 C27 27 26 25 26 25 C25 29 23 32 20 34 C17 32 15 29 14 25 C14 25 13 27 11 27 C8 27 7 23 9 20 C9 20 5 21 3 18 C1 15 4 12 8 13 C6 10 8 6 12 7 C16 8 20 4 20 4 Z"
            fill={color}
            opacity="0.55"
            filter={`url(#${filterId})`}
          />
          <path d="M20 6 L20 30" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M20 12 C16 14 14 17 14.5 20" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" strokeLinecap="round" />
          <path d="M20 12 C24 14 26 17 25.5 20" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" strokeLinecap="round" />
        </>
      ) : (
        // Maple-style leaf with watercolor texture
        <>
          <path
            d="M20 2 C20 2 24 6 28 5 C32 4 34 8 32 11 C36 10 39 13 37 16 C35 19 31 18 31 18 C33 21 32 25 29 25 C27 25 26 23 26 23 C25 27 23 30 20 32 C17 30 15 27 14 23 C14 23 13 25 11 25 C8 25 7 21 9 18 C9 18 5 19 3 16 C1 13 4 10 8 11 C6 8 8 4 12 5 C16 6 20 2 20 2 Z"
            fill={color}
            opacity="0.88"
            filter={`url(#${filterId})`}
          />
          {/* Watercolor bleed layer */}
          <path
            d="M20 2 C20 2 24 6 28 5 C32 4 34 8 32 11 C36 10 39 13 37 16 C35 19 31 18 31 18 C33 21 32 25 29 25 C27 25 26 23 26 23 C25 27 23 30 20 32 C17 30 15 27 14 23 C14 23 13 25 11 25 C8 25 7 21 9 18 C9 18 5 19 3 16 C1 13 4 10 8 11 C6 8 8 4 12 5 C16 6 20 2 20 2 Z"
            fill="white"
            opacity="0.12"
          />
          <path d="M20 6 L20 30" stroke="rgba(255,255,255,0.45)" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M20 12 C16 14 14 17 14.5 20" stroke="rgba(255,255,255,0.3)" strokeWidth="0.9" strokeLinecap="round" />
          <path d="M20 18 C16 20 14 22 14.5 25" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" strokeLinecap="round" />
          <path d="M20 12 C24 14 26 17 25.5 20" stroke="rgba(255,255,255,0.3)" strokeWidth="0.9" strokeLinecap="round" />
          <path d="M20 18 C24 20 26 22 25.5 25" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" strokeLinecap="round" />
          <ellipse cx="16" cy="13" rx="2.5" ry="4" fill="rgba(255,255,255,0.15)" transform="rotate(-15 16 13)" />
        </>
      )}
      {/* Stem */}
      <line x1="20" y1={isSpring ? 44 : 30} x2="20" y2={isSpring ? 50 : 38} stroke="#7B4F2E" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Branch({ entry, index, plantType, season }: BranchProps) {
  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const leafColor = getLeafColor(index, plantType, season);
  const leafSize = 20 + (index % 3) * 3;
  const leafRotation = (index * 45) % 360;

  function handleOpen() {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setOpen(true);
  }

  function handleClose() {
    closeTimerRef.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <div className="relative inline-block">
      {open && (
        <div
          className="absolute z-50 bg-card border border-border rounded-xl shadow-card-hover p-3 text-xs text-foreground leading-relaxed pointer-events-none"
          style={{
            width: 190,
            bottom: leafSize * 1.3 + 10,
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'normal',
          }}
        >
          <p className="font-sans text-foreground/90 mb-1.5 line-clamp-5 leading-snug">{entry.text}</p>
          <p className="text-muted-foreground text-[10px] font-medium">{formatRelativeTime(entry.timestamp)}</p>
          <div
            className="absolute -bottom-1.5 w-3 h-3 bg-card border-r border-b border-border rotate-45"
            style={{ left: '50%', transform: 'translateX(-50%) rotate(45deg)' }}
          />
        </div>
      )}

      <button
        type="button"
        className="focus:outline-none cursor-pointer transition-transform hover:scale-125 active:scale-110 focus-visible:ring-2 focus-visible:ring-ring rounded-full"
        style={{
          display: 'block',
          animation: `leaf-sway ${2.2 + (index % 5) * 0.6}s ease-in-out infinite alternate`,
          animationDelay: `${(index * 0.3) % 2}s`,
        }}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        onFocus={handleOpen}
        onBlur={handleClose}
        onClick={() => setOpen((v) => !v)}
        aria-label={`Gratitude leaf: ${entry.text}`}
      >
        <LeafSvg color={leafColor} size={leafSize} rotation={leafRotation} season={season} />
      </button>
    </div>
  );
}
