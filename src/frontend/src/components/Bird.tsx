import type { AllBirdVariety } from "../utils/birdVarietyAssignment";

export type BirdVariety = AllBirdVariety;
export type BirdState = "perched" | "flying";

export interface BirdData {
  id: number;
  variety: BirdVariety;
  x: number;
  y: number;
  state: BirdState;
  flipX: boolean;
}

// Per-bird watercolor filter — unique id per variety to avoid SVG filter collisions
function WatercolorDefs({ id }: { id: string }) {
  return (
    <defs>
      <filter id={id} x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.06 0.08" numOctaves={3} seed={5} result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.5} xChannelSelector="R" yChannelSelector="G" result="displaced" />
        <feGaussianBlur in="displaced" stdDeviation="0.4" result="blurred" />
        <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
      </filter>
    </defs>
  );
}

function ShadowDefs({ id }: { id: string }) {
  return (
    <defs>
      <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.5" />
      </filter>
    </defs>
  );
}

// Sparrow — warm brown/tan, 3-layer watercolor body
function SparrowSvg({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 40 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="sp-wc" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.06 0.08" numOctaves={3} seed={5} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.5} xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="0.4" result="blurred" />
          <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
        </filter>
        <filter id="sp-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
        <radialGradient id="sp-bg" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#e8c89a" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#c8956c" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#a0714f" stopOpacity="0.8" />
        </radialGradient>
      </defs>
      {/* Ground shadow */}
      <ellipse cx="18" cy="32" rx="10" ry="2.5" fill="#2a1a08" fillOpacity="0.15" filter="url(#sp-shadow)" />
      {/* Tail — layered feather strokes */}
      <path d="M 8 18 Q 2 22 1 27 Q 4 23 6 25 Q 7 21 9 20 Z" fill="#8a6840" fillOpacity="0.82" filter="url(#sp-wc)" />
      <path d="M 9 17 Q 3 20 2 25 Q 5 21 7 23 Q 8 19 10 18 Z" fill="#b08860" fillOpacity="0.55" filter="url(#sp-wc)" />
      <path d="M 10 16 Q 5 19 4 22 Q 7 20 8 21 Q 9 18 11 17 Z" fill="#d0a878" fillOpacity="0.35" filter="url(#sp-wc)" />
      {/* Wing — overlapping feather layers */}
      <path d="M 10 14 Q 14 8 22 10 Q 18 16 10 14 Z" fill="#b08860" fillOpacity="0.78" filter="url(#sp-wc)" />
      <path d="M 11 15 Q 16 10 23 12 Q 19 17 11 15 Z" fill="#8a6840" fillOpacity="0.42" filter="url(#sp-wc)" />
      <path d="M 12 13 Q 17 9 21 11 Q 17 14 12 13 Z" fill="#d0a878" fillOpacity="0.28" filter="url(#sp-wc)" />
      <line x1="13" y1="13" x2="20" y2="11" stroke="#7a5830" strokeWidth="0.6" strokeOpacity="0.38" />
      <line x1="13" y1="14.5" x2="20" y2="12.5" stroke="#7a5830" strokeWidth="0.5" strokeOpacity="0.28" />
      {/* Body — 3 wash layers */}
      <ellipse cx="17" cy="18" rx="9" ry="7" fill="url(#sp-bg)" fillOpacity="0.85" filter="url(#sp-wc)" />
      <ellipse cx="16" cy="19" rx="6" ry="4.5" fill="#c8956c" fillOpacity="0.28" filter="url(#sp-wc)" />
      <ellipse cx="19" cy="16" rx="4" ry="3" fill="#e8c89a" fillOpacity="0.22" filter="url(#sp-wc)" />
      {/* Belly highlight */}
      <ellipse cx="18" cy="20" rx="4" ry="3" fill="#e8d8b8" fillOpacity="0.48" filter="url(#sp-wc)" />
      {/* Head */}
      <circle cx="25" cy="13" r="6" fill="#9a7850" fillOpacity="0.88" filter="url(#sp-wc)" />
      <ellipse cx="24" cy="10" r={3.5} fill="#c8956c" fillOpacity="0.32" filter="url(#sp-wc)" />
      {/* Beak */}
      <path d="M 30 13 L 34 12.5 L 30 14 Z" fill="#c8a040" fillOpacity="0.9" />
      {/* Eye */}
      <circle cx="27" cy="12" r="1.8" fill="#2a1a08" />
      <circle cx="27.6" cy="11.4" r="0.55" fill="white" fillOpacity="0.9" />
      {/* Feet */}
      <line x1="16" y1="24" x2="14" y2="28" stroke="#c8a040" strokeWidth="1" strokeLinecap="round" />
      <line x1="14" y1="28" x2="12" y2="29" stroke="#c8a040" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="14" y1="28" x2="14" y2="30" stroke="#c8a040" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="20" y1="24" x2="22" y2="28" stroke="#c8a040" strokeWidth="1" strokeLinecap="round" />
      <line x1="22" y1="28" x2="24" y2="29" stroke="#c8a040" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="22" y1="28" x2="22" y2="30" stroke="#c8a040" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

// Robin — dark body with red breast, 3-layer watercolor
function RobinSvg({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 40 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="rb-wc" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.06 0.08" numOctaves={3} seed={7} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.5} xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="0.4" result="blurred" />
          <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
        </filter>
        <filter id="rb-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
        <radialGradient id="rb-bg" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#7a8aaa" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#5a6a8a" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#3a4a6a" stopOpacity="0.8" />
        </radialGradient>
      </defs>
      <ellipse cx="18" cy="32" rx="10" ry="2.5" fill="#1a1a2a" fillOpacity="0.15" filter="url(#rb-shadow)" />
      {/* Tail */}
      <path d="M 8 18 Q 2 22 1 27 Q 4 23 6 25 Q 7 21 9 20 Z" fill="#2a3a5a" fillOpacity="0.82" filter="url(#rb-wc)" />
      <path d="M 9 17 Q 3 20 2 25 Q 5 21 7 23 Q 8 19 10 18 Z" fill="#4a5a7a" fillOpacity="0.55" filter="url(#rb-wc)" />
      <path d="M 10 16 Q 5 19 4 22 Q 7 20 8 21 Q 9 18 11 17 Z" fill="#8a9aba" fillOpacity="0.32" filter="url(#rb-wc)" />
      {/* Wing */}
      <path d="M 10 14 Q 14 8 22 10 Q 18 16 10 14 Z" fill="#4a5a7a" fillOpacity="0.78" filter="url(#rb-wc)" />
      <path d="M 11 15 Q 16 10 23 12 Q 19 17 11 15 Z" fill="#3a4a6a" fillOpacity="0.42" filter="url(#rb-wc)" />
      <path d="M 12 13 Q 17 9 21 11 Q 17 14 12 13 Z" fill="#8a9aba" fillOpacity="0.28" filter="url(#rb-wc)" />
      <line x1="13" y1="13" x2="20" y2="11" stroke="#2a3a5a" strokeWidth="0.6" strokeOpacity="0.38" />
      {/* Body */}
      <ellipse cx="17" cy="18" rx="9" ry="7" fill="url(#rb-bg)" fillOpacity="0.85" filter="url(#rb-wc)" />
      <ellipse cx="16" cy="19" rx="6" ry="4.5" fill="#5a6a8a" fillOpacity="0.28" filter="url(#rb-wc)" />
      <ellipse cx="19" cy="16" rx="4" ry="3" fill="#7a8aaa" fillOpacity="0.22" filter="url(#rb-wc)" />
      {/* Red breast — 3 layers */}
      <ellipse cx="17" cy="20" rx="6" ry="5" fill="#e06030" fillOpacity="0.82" filter="url(#rb-wc)" />
      <ellipse cx="16" cy="21" rx="4" ry="3.5" fill="#c04020" fillOpacity="0.35" filter="url(#rb-wc)" />
      <ellipse cx="17" cy="19" rx="3" ry="2.5" fill="#f09060" fillOpacity="0.28" filter="url(#rb-wc)" />
      {/* Head */}
      <circle cx="25" cy="13" r="6" fill="#3a4a6a" fillOpacity="0.88" filter="url(#rb-wc)" />
      <circle cx="24" cy="10" r={3.5} fill="#5a6a8a" fillOpacity="0.32" filter="url(#rb-wc)" />
      <path d="M 30 13 L 34 12.5 L 30 14 Z" fill="#c8a040" fillOpacity="0.9" />
      <circle cx="27" cy="12" r="1.8" fill="#1a1a2a" />
      <circle cx="27.6" cy="11.4" r="0.55" fill="white" fillOpacity="0.9" />
      <line x1="16" y1="24" x2="14" y2="28" stroke="#c8a040" strokeWidth="1" strokeLinecap="round" />
      <line x1="14" y1="28" x2="12" y2="29" stroke="#c8a040" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="14" y1="28" x2="14" y2="30" stroke="#c8a040" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="20" y1="24" x2="22" y2="28" stroke="#c8a040" strokeWidth="1" strokeLinecap="round" />
      <line x1="22" y1="28" x2="24" y2="29" stroke="#c8a040" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="22" y1="28" x2="22" y2="30" stroke="#c8a040" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

// Blue Tit — blue/yellow, 3-layer watercolor
function BlueTitSvg({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 40 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="bt-wc" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.06 0.08" numOctaves={3} seed={9} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.5} xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="0.4" result="blurred" />
          <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
        </filter>
        <filter id="bt-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
        <radialGradient id="bt-bg" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#6aaad0" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#4a8ab0" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#2a6a90" stopOpacity="0.8" />
        </radialGradient>
      </defs>
      <ellipse cx="18" cy="32" rx="10" ry="2.5" fill="#0a0a1a" fillOpacity="0.15" filter="url(#bt-shadow)" />
      {/* Tail */}
      <path d="M 8 18 Q 2 22 1 27 Q 4 23 6 25 Q 7 21 9 20 Z" fill="#1a5a80" fillOpacity="0.82" filter="url(#bt-wc)" />
      <path d="M 9 17 Q 3 20 2 25 Q 5 21 7 23 Q 8 19 10 18 Z" fill="#3a7aa0" fillOpacity="0.55" filter="url(#bt-wc)" />
      <path d="M 10 16 Q 5 19 4 22 Q 7 20 8 21 Q 9 18 11 17 Z" fill="#8abcd0" fillOpacity="0.32" filter="url(#bt-wc)" />
      {/* Wing */}
      <path d="M 10 14 Q 14 8 22 10 Q 18 16 10 14 Z" fill="#3a7aa0" fillOpacity="0.78" filter="url(#bt-wc)" />
      <path d="M 11 15 Q 16 10 23 12 Q 19 17 11 15 Z" fill="#2a6a90" fillOpacity="0.42" filter="url(#bt-wc)" />
      <path d="M 12 13 Q 17 9 21 11 Q 17 14 12 13 Z" fill="#8abcd0" fillOpacity="0.28" filter="url(#bt-wc)" />
      <line x1="13" y1="13" x2="20" y2="11" stroke="#1a5a80" strokeWidth="0.6" strokeOpacity="0.38" />
      {/* Body */}
      <ellipse cx="17" cy="18" rx="9" ry="7" fill="url(#bt-bg)" fillOpacity="0.85" filter="url(#bt-wc)" />
      <ellipse cx="16" cy="19" rx="6" ry="4.5" fill="#4a8ab0" fillOpacity="0.28" filter="url(#bt-wc)" />
      <ellipse cx="19" cy="16" rx="4" ry="3" fill="#6aaad0" fillOpacity="0.22" filter="url(#bt-wc)" />
      {/* Yellow belly — 3 layers */}
      <ellipse cx="17" cy="20" rx="6" ry="4.5" fill="#e8e040" fillOpacity="0.82" filter="url(#bt-wc)" />
      <ellipse cx="16" cy="21" rx="4" ry="3" fill="#c0b820" fillOpacity="0.35" filter="url(#bt-wc)" />
      <ellipse cx="17" cy="19" rx="3" ry="2.2" fill="#f8f060" fillOpacity="0.28" filter="url(#bt-wc)" />
      {/* Head — dark blue cap */}
      <circle cx="25" cy="13" r="6" fill="#1a3a60" fillOpacity="0.88" filter="url(#bt-wc)" />
      <ellipse cx="24" cy="15" rx="3.5" ry="2.5" fill="#f5f5f5" fillOpacity="0.75" filter="url(#bt-wc)" />
      <circle cx="24" cy="10" r={3} fill="#4a8ab0" fillOpacity="0.32" filter="url(#bt-wc)" />
      <path d="M 30 13 L 34 12.5 L 30 14 Z" fill="#8a8a70" fillOpacity="0.9" />
      <circle cx="27" cy="12" r="1.8" fill="#0a0a1a" />
      <circle cx="27.6" cy="11.4" r="0.55" fill="white" fillOpacity="0.9" />
      <line x1="16" y1="24" x2="14" y2="28" stroke="#8a8a70" strokeWidth="1" strokeLinecap="round" />
      <line x1="14" y1="28" x2="12" y2="29" stroke="#8a8a70" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="14" y1="28" x2="14" y2="30" stroke="#8a8a70" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="20" y1="24" x2="22" y2="28" stroke="#8a8a70" strokeWidth="1" strokeLinecap="round" />
      <line x1="22" y1="28" x2="24" y2="29" stroke="#8a8a70" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="22" y1="28" x2="22" y2="30" stroke="#8a8a70" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

// Canary — bright yellow, 3-layer watercolor
function CanarySvg({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 40 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="cn-wc" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.06 0.08" numOctaves={3} seed={11} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.5} xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="0.4" result="blurred" />
          <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
        </filter>
        <filter id="cn-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
        <radialGradient id="cn-bg" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#f8e860" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#e8d020" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#c8b010" stopOpacity="0.8" />
        </radialGradient>
      </defs>
      <ellipse cx="18" cy="32" rx="10" ry="2.5" fill="#1a1000" fillOpacity="0.15" filter="url(#cn-shadow)" />
      {/* Tail */}
      <path d="M 8 18 Q 2 22 1 27 Q 4 23 6 25 Q 7 21 9 20 Z" fill="#a08000" fillOpacity="0.82" filter="url(#cn-wc)" />
      <path d="M 9 17 Q 3 20 2 25 Q 5 21 7 23 Q 8 19 10 18 Z" fill="#c0a010" fillOpacity="0.55" filter="url(#cn-wc)" />
      <path d="M 10 16 Q 5 19 4 22 Q 7 20 8 21 Q 9 18 11 17 Z" fill="#f0d840" fillOpacity="0.32" filter="url(#cn-wc)" />
      {/* Wing */}
      <path d="M 10 14 Q 14 8 22 10 Q 18 16 10 14 Z" fill="#c0a010" fillOpacity="0.78" filter="url(#cn-wc)" />
      <path d="M 11 15 Q 16 10 23 12 Q 19 17 11 15 Z" fill="#b09000" fillOpacity="0.42" filter="url(#cn-wc)" />
      <path d="M 12 13 Q 17 9 21 11 Q 17 14 12 13 Z" fill="#f0d840" fillOpacity="0.28" filter="url(#cn-wc)" />
      <line x1="13" y1="13" x2="20" y2="11" stroke="#a08000" strokeWidth="0.6" strokeOpacity="0.38" />
      {/* Body */}
      <ellipse cx="17" cy="18" rx="9" ry="7" fill="url(#cn-bg)" fillOpacity="0.85" filter="url(#cn-wc)" />
      <ellipse cx="16" cy="19" rx="6" ry="4.5" fill="#e8d020" fillOpacity="0.28" filter="url(#cn-wc)" />
      <ellipse cx="19" cy="16" rx="4" ry="3" fill="#f8e860" fillOpacity="0.22" filter="url(#cn-wc)" />
      {/* Belly */}
      <ellipse cx="18" cy="20" rx="4" ry="3" fill="#f8f0a0" fillOpacity="0.48" filter="url(#cn-wc)" />
      {/* Head */}
      <circle cx="25" cy="13" r="6" fill="#d0b810" fillOpacity="0.88" filter="url(#cn-wc)" />
      <circle cx="24" cy="10" r={3.5} fill="#f8e860" fillOpacity="0.32" filter="url(#cn-wc)" />
      <path d="M 30 13 L 34 12.5 L 30 14 Z" fill="#e09030" fillOpacity="0.9" />
      <circle cx="27" cy="12" r="1.8" fill="#1a1000" />
      <circle cx="27.6" cy="11.4" r="0.55" fill="white" fillOpacity="0.9" />
      <line x1="16" y1="24" x2="14" y2="28" stroke="#e09030" strokeWidth="1" strokeLinecap="round" />
      <line x1="14" y1="28" x2="12" y2="29" stroke="#e09030" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="14" y1="28" x2="14" y2="30" stroke="#e09030" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="20" y1="24" x2="22" y2="28" stroke="#e09030" strokeWidth="1" strokeLinecap="round" />
      <line x1="22" y1="28" x2="24" y2="29" stroke="#e09030" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="22" y1="28" x2="22" y2="30" stroke="#e09030" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

// Cardinal — bold red with crest, 3-layer watercolor
function CardinalSvg({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 40 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="cd-wc" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.06 0.08" numOctaves={3} seed={13} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.5} xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="0.4" result="blurred" />
          <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
        </filter>
        <filter id="cd-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
        <radialGradient id="cd-bg" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#e84040" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#c82020" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#a81010" stopOpacity="0.8" />
        </radialGradient>
      </defs>
      <ellipse cx="18" cy="32" rx="10" ry="2.5" fill="#1a0808" fillOpacity="0.15" filter="url(#cd-shadow)" />
      {/* Tail */}
      <path d="M 8 18 Q 2 22 1 27 Q 4 23 6 25 Q 7 21 9 20 Z" fill="#780808" fillOpacity="0.82" filter="url(#cd-wc)" />
      <path d="M 9 17 Q 3 20 2 25 Q 5 21 7 23 Q 8 19 10 18 Z" fill="#a01818" fillOpacity="0.55" filter="url(#cd-wc)" />
      <path d="M 10 16 Q 5 19 4 22 Q 7 20 8 21 Q 9 18 11 17 Z" fill="#d84040" fillOpacity="0.32" filter="url(#cd-wc)" />
      {/* Wing */}
      <path d="M 10 14 Q 14 8 22 10 Q 18 16 10 14 Z" fill="#b02020" fillOpacity="0.78" filter="url(#cd-wc)" />
      <path d="M 11 15 Q 16 10 23 12 Q 19 17 11 15 Z" fill="#881010" fillOpacity="0.42" filter="url(#cd-wc)" />
      <path d="M 12 13 Q 17 9 21 11 Q 17 14 12 13 Z" fill="#d84040" fillOpacity="0.28" filter="url(#cd-wc)" />
      <line x1="13" y1="13" x2="20" y2="11" stroke="#780808" strokeWidth="0.6" strokeOpacity="0.38" />
      {/* Body */}
      <ellipse cx="17" cy="18" rx="9" ry="7" fill="url(#cd-bg)" fillOpacity="0.85" filter="url(#cd-wc)" />
      <ellipse cx="16" cy="19" rx="6" ry="4.5" fill="#c82020" fillOpacity="0.28" filter="url(#cd-wc)" />
      <ellipse cx="19" cy="16" rx="4" ry="3" fill="#e84040" fillOpacity="0.22" filter="url(#cd-wc)" />
      {/* Belly */}
      <ellipse cx="18" cy="20" rx="4" ry="3" fill="#e86060" fillOpacity="0.45" filter="url(#cd-wc)" />
      {/* Head + crest */}
      <circle cx="25" cy="13" r="6" fill="#a01010" fillOpacity="0.88" filter="url(#cd-wc)" />
      <path d="M 25 7 L 23 3 L 27 5 L 29 1 L 28 6 Z" fill="#c82020" fillOpacity="0.9" filter="url(#cd-wc)" />
      <circle cx="24" cy="10" r={3.5} fill="#e84040" fillOpacity="0.28" filter="url(#cd-wc)" />
      {/* Black mask */}
      <ellipse cx="23" cy="14" rx="4" ry="2.5" fill="#1a0808" fillOpacity="0.55" filter="url(#cd-wc)" />
      <path d="M 30 13 L 34 12.5 L 30 14 Z" fill="#e08020" fillOpacity="0.9" />
      <circle cx="27" cy="12" r="1.8" fill="#1a0808" />
      <circle cx="27.6" cy="11.4" r="0.55" fill="white" fillOpacity="0.9" />
      <line x1="16" y1="24" x2="14" y2="28" stroke="#e08020" strokeWidth="1" strokeLinecap="round" />
      <line x1="14" y1="28" x2="12" y2="29" stroke="#e08020" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="14" y1="28" x2="14" y2="30" stroke="#e08020" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="20" y1="24" x2="22" y2="28" stroke="#e08020" strokeWidth="1" strokeLinecap="round" />
      <line x1="22" y1="28" x2="24" y2="29" stroke="#e08020" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="22" y1="28" x2="22" y2="30" stroke="#e08020" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

// Parakeet — green/teal with long tail, 3-layer watercolor
function ParakeetSvg({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 40 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="pk-wc" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.06 0.08" numOctaves={3} seed={15} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.5} xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="0.4" result="blurred" />
          <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
        </filter>
        <filter id="pk-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
        <radialGradient id="pk-bg" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#50d860" stopOpacity="0.9" />
          <stop offset="55%" stopColor="#30b840" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#108020" stopOpacity="0.8" />
        </radialGradient>
      </defs>
      <ellipse cx="18" cy="32" rx="10" ry="2.5" fill="#0a1808" fillOpacity="0.15" filter="url(#pk-shadow)" />
      {/* Long tail */}
      <path d="M 6 18 Q -2 20 -3 28 Q 1 22 4 25 Q 5 20 8 19 Z" fill="#0a6018" fillOpacity="0.82" filter="url(#pk-wc)" />
      <path d="M 7 17 Q 0 19 -1 26 Q 3 21 5 23 Q 6 19 9 18 Z" fill="#208030" fillOpacity="0.55" filter="url(#pk-wc)" />
      <path d="M 8 16 Q 2 18 2 23 Q 5 20 7 21 Q 8 18 10 17 Z" fill="#60c870" fillOpacity="0.32" filter="url(#pk-wc)" />
      {/* Wing */}
      <path d="M 10 14 Q 14 8 22 10 Q 18 16 10 14 Z" fill="#30a840" fillOpacity="0.78" filter="url(#pk-wc)" />
      <path d="M 11 15 Q 16 10 23 12 Q 19 17 11 15 Z" fill="#108020" fillOpacity="0.42" filter="url(#pk-wc)" />
      <path d="M 12 13 Q 17 9 21 11 Q 17 14 12 13 Z" fill="#60c870" fillOpacity="0.28" filter="url(#pk-wc)" />
      <line x1="13" y1="13" x2="20" y2="11" stroke="#0a6018" strokeWidth="0.6" strokeOpacity="0.38" />
      {/* Body */}
      <ellipse cx="17" cy="18" rx="9" ry="7" fill="url(#pk-bg)" fillOpacity="0.85" filter="url(#pk-wc)" />
      <ellipse cx="16" cy="19" rx="6" ry="4.5" fill="#30b840" fillOpacity="0.28" filter="url(#pk-wc)" />
      <ellipse cx="19" cy="16" rx="4" ry="3" fill="#50d860" fillOpacity="0.22" filter="url(#pk-wc)" />
      {/* Belly */}
      <ellipse cx="18" cy="20" rx="4" ry="3" fill="#a8e8a0" fillOpacity="0.48" filter="url(#pk-wc)" />
      {/* Head */}
      <circle cx="25" cy="13" r="6" fill="#208030" fillOpacity="0.88" filter="url(#pk-wc)" />
      <ellipse cx="24" cy="10" r={3.5} fill="#00897b" fillOpacity="0.55" filter="url(#pk-wc)" />
      {/* Cheek patch */}
      <circle cx="22" cy="14" r="2" fill="#80cbc4" fillOpacity="0.7" filter="url(#pk-wc)" />
      <path d="M 30 13 L 34 12.5 L 30 14 Z" fill="#e0c020" fillOpacity="0.9" />
      <circle cx="27" cy="12" r="1.8" fill="#0a1808" />
      <circle cx="27.6" cy="11.4" r="0.55" fill="white" fillOpacity="0.9" />
      <line x1="16" y1="24" x2="14" y2="28" stroke="#e0c020" strokeWidth="1" strokeLinecap="round" />
      <line x1="14" y1="28" x2="12" y2="29" stroke="#e0c020" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="14" y1="28" x2="14" y2="30" stroke="#e0c020" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="20" y1="24" x2="22" y2="28" stroke="#e0c020" strokeWidth="1" strokeLinecap="round" />
      <line x1="22" y1="28" x2="24" y2="29" stroke="#e0c020" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="22" y1="28" x2="22" y2="30" stroke="#e0c020" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

// Flying bird — layered feather-stroke wings, watercolor style
function FlyingSvg({ variety, size = 22 }: { variety: BirdVariety; size?: number }) {
  const colors: Record<BirdVariety, { body: string; wing1: string; wing2: string; wing3: string; belly: string; tail: string }> = {
    sparrow:  { body: "#c8956c", wing1: "#8a6840", wing2: "#b08860", wing3: "#d0a878", belly: "#e8d8b8", tail: "#7a5830" },
    robin:    { body: "#5a6a8a", wing1: "#3a4a6a", wing2: "#5a6a8a", wing3: "#8a9aba", belly: "#e06030", tail: "#2a3a5a" },
    bluetit:  { body: "#4a8ab0", wing1: "#2a6a90", wing2: "#4a8ab0", wing3: "#8abcd0", belly: "#e8e040", tail: "#1a5a80" },
    canary:   { body: "#e8d020", wing1: "#b09000", wing2: "#d0b020", wing3: "#f0d840", belly: "#f8f0a0", tail: "#a08000" },
    cardinal: { body: "#c82020", wing1: "#881010", wing2: "#b02020", wing3: "#d84040", belly: "#e86060", tail: "#780808" },
    parakeet: { body: "#30b840", wing1: "#108020", wing2: "#30a840", wing3: "#60c870", belly: "#a8e8a0", tail: "#0a6018" },
  };
  const c = colors[variety] ?? colors.sparrow;

  return (
    <svg width={size * 1.8} height={size} viewBox="0 0 50 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="fly-wc" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.07 0.09" numOctaves={3} seed={17} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.2} xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="0.4" result="blurred" />
          <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
        </filter>
        <radialGradient id="fly-bg" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={c.wing3} stopOpacity="0.9" />
          <stop offset="55%" stopColor={c.body} stopOpacity="0.85" />
          <stop offset="100%" stopColor={c.wing1} stopOpacity="0.8" />
        </radialGradient>
      </defs>
      {/* Upper wing — 3 feather layers */}
      <path d="M 14 14 Q 18 3 32 5 Q 26 11 14 14 Z" fill="url(#fly-bg)" fillOpacity="0.78" filter="url(#fly-wc)" />
      <path d="M 15 14 Q 20 5 30 7 Q 24 12 15 14 Z" fill={c.wing2} fillOpacity="0.38" filter="url(#fly-wc)" />
      <path d="M 16 13 Q 22 6 28 8 Q 22 11 16 13 Z" fill={c.wing3} fillOpacity="0.25" filter="url(#fly-wc)" />
      <line x1="18" y1="12" x2="28" y2="7" stroke={c.wing1} strokeWidth="0.6" strokeOpacity="0.32" />
      <line x1="18" y1="13" x2="27" y2="8.5" stroke={c.wing1} strokeWidth="0.5" strokeOpacity="0.22" />
      {/* Lower wing */}
      <path d="M 14 14 Q 18 22 30 20 Q 24 15 14 14 Z" fill={c.wing1} fillOpacity="0.65" filter="url(#fly-wc)" />
      <path d="M 15 14 Q 19 20 28 18 Q 23 15 15 14 Z" fill={c.wing2} fillOpacity="0.32" filter="url(#fly-wc)" />
      {/* Body */}
      <ellipse cx="12" cy="14" rx="8" ry="5" fill={c.body} fillOpacity="0.85" filter="url(#fly-wc)" />
      <ellipse cx="11" cy="14" rx="5" ry="3" fill={c.body} fillOpacity="0.28" filter="url(#fly-wc)" />
      <ellipse cx="13" cy="13" rx="3.5" ry="2.5" fill={c.wing3} fillOpacity="0.22" filter="url(#fly-wc)" />
      {/* Belly */}
      <ellipse cx="12" cy="15" rx="4" ry="2.5" fill={c.belly} fillOpacity="0.45" filter="url(#fly-wc)" />
      {/* Tail */}
      <path d="M 4 14 Q 0 11 1 7 Q 3 11 5 10 Q 4 12 4 14 Z" fill={c.tail} fillOpacity="0.8" filter="url(#fly-wc)" />
      <path d="M 4 14 Q 0 16 1 20 Q 3 16 5 17 Q 4 15 4 14 Z" fill={c.wing2} fillOpacity="0.6" filter="url(#fly-wc)" />
      {/* Head */}
      <circle cx="20" cy="13" r="5" fill={c.body} fillOpacity="0.88" filter="url(#fly-wc)" />
      <circle cx="19" cy="11" r="3" fill={c.wing3} fillOpacity="0.28" filter="url(#fly-wc)" />
      {/* Beak */}
      <path d="M 24 13 L 28 12.5 L 24 14 Z" fill="#c8a040" fillOpacity="0.9" />
      {/* Eye */}
      <circle cx="22" cy="12" r="1.5" fill="#1a0a00" />
      <circle cx="22.5" cy="11.5" r="0.45" fill="white" fillOpacity="0.9" />
    </svg>
  );
}

interface BirdProps {
  bird: BirdData;
}

export function Bird({ bird }: BirdProps) {
  const isFlying = bird.state === "flying";
  const animClass = isFlying ? "bird-flying" : "bird-perched";

  const renderPerched = () => {
    switch (bird.variety) {
      case "sparrow":  return <SparrowSvg size={26} />;
      case "robin":    return <RobinSvg size={26} />;
      case "bluetit":  return <BlueTitSvg size={26} />;
      case "canary":   return <CanarySvg size={26} />;
      case "cardinal": return <CardinalSvg size={26} />;
      case "parakeet": return <ParakeetSvg size={26} />;
      default:         return <SparrowSvg size={26} />;
    }
  };

  return (
    <div
      className={`absolute pointer-events-none select-none ${animClass}`}
      style={{
        left: `${bird.x}%`,
        top: `${bird.y}%`,
        transform: `translate(-50%, -50%) scaleX(${bird.flipX ? -1 : 1})`,
        zIndex: 6,
        transition: isFlying
          ? "left 2.5s cubic-bezier(0.4,0,0.2,1), top 2.5s cubic-bezier(0.4,0,0.2,1)"
          : "none",
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
      }}
      aria-hidden="true"
    >
      {isFlying ? <FlyingSvg variety={bird.variety} size={20} /> : renderPerched()}
    </div>
  );
}
