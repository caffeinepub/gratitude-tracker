import { useState } from 'react';
import type { GratitudeEntry } from '../backend';
import { formatRelativeTime } from '@/utils/formatDate';

interface BranchProps {
  entry: GratitudeEntry;
  index: number;
  total: number;
  stageSize: { width: number; height: number };
}

// Generate a deterministic position for a leaf based on index and total
function getLeafPosition(index: number, total: number, stageWidth: number, stageHeight: number) {
  // Distribute leaves around the plant in a semi-circle arc
  const spread = Math.min(total, 8);
  const angle = (index / Math.max(spread - 1, 1)) * 160 - 80; // -80 to +80 degrees
  const radians = (angle * Math.PI) / 180;
  const radius = stageWidth * 0.55 + (index % 2) * 14;
  const cx = stageWidth / 2;
  const cy = stageHeight * 0.35;

  const x = cx + Math.sin(radians) * radius;
  const y = cy - Math.cos(radians) * radius * 0.5;

  return { x, y, angle };
}

// SVG leaf shape
function LeafSvg({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 22 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 2 C18 2 21 8 21 14 C21 20 16 26 11 26 C6 26 1 20 1 14 C1 8 4 2 11 2 Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M11 4 L11 24"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M11 10 C8 12 6 14 7 17"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <path
        d="M11 10 C14 12 16 14 15 17"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const LEAF_COLORS = [
  '#5a8a3c',
  '#4a7a2c',
  '#6a9a4c',
  '#7aaa5c',
  '#3a6a2c',
  '#8aba6c',
  '#4a8a4c',
  '#5a9a5c',
];

export function Branch({ entry, index, total, stageSize }: BranchProps) {
  const [open, setOpen] = useState(false);
  const pos = getLeafPosition(index, total, stageSize.width, stageSize.height);
  const leafColor = LEAF_COLORS[index % LEAF_COLORS.length];
  const leafSize = 20 + (index % 3) * 4;

  return (
    <div
      className="absolute"
      style={{
        left: pos.x - leafSize / 2,
        top: pos.y - (leafSize * 1.3) / 2,
        transform: `rotate(${pos.angle * 0.4}deg)`,
        zIndex: open ? 30 : 10,
      }}
    >
      {/* Tooltip popover */}
      {open && (
        <div
          className="absolute z-40 bg-card border border-border rounded-xl shadow-card-hover p-3 text-xs text-foreground leading-relaxed"
          style={{
            width: 180,
            bottom: leafSize * 1.3 + 6,
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }}
        >
          <p className="font-sans text-foreground/90 mb-1 line-clamp-4">{entry.text}</p>
          <p className="text-muted-foreground text-[10px]">{formatRelativeTime(entry.timestamp)}</p>
          {/* Arrow */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-card border-r border-b border-border rotate-45"
          />
        </div>
      )}

      {/* Leaf button */}
      <button
        type="button"
        className="leaf-btn focus:outline-none cursor-pointer transition-transform hover:scale-125 active:scale-110"
        style={{ display: 'block', animation: `leaf-sway ${2.5 + (index % 3) * 0.7}s ease-in-out infinite alternate` }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        aria-label={`Gratitude: ${entry.text}`}
      >
        <LeafSvg color={leafColor} size={leafSize} />
      </button>
    </div>
  );
}
