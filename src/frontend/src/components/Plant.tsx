import { useState, useEffect } from "react";
import type { GratitudeEntry } from "../backend";
import type { GrowthStage, PlantType } from "../utils/plantGrouping";
import type { Season } from "../hooks/useSeason";
import {
  getPlantImage,
  getPlantSize,
  getPlantLabel,
  getBranchPosition,
  getFlowerVariety,
} from "../utils/plantGrouping";
import { Branch } from "./Branch";
import { CherryBlossom } from "./flowers/CherryBlossom";
import { CitrusBlossom } from "./flowers/CitrusBlossom";
import { Lavender } from "./flowers/Lavender";
import { Poppy } from "./flowers/Poppy";
import { Rose } from "./flowers/Rose";

interface PlantProps {
  category: string;
  entries: GratitudeEntry[];
  stage: GrowthStage;
  plantType?: PlantType;
  season?: Season;
  isNew?: boolean;
}

function categoryHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(h);
}

// Seasonal foliage colors for canopy overlays
function getSeasonalCanopyColor(season?: Season): { fill1: string; fill2: string; fill3: string } {
  switch (season) {
    case "spring":  return { fill1: "oklch(0.72 0.18 145)", fill2: "oklch(0.78 0.16 140)", fill3: "oklch(0.82 0.14 135)" };
    case "summer":  return { fill1: "oklch(0.42 0.22 145)", fill2: "oklch(0.48 0.24 140)", fill3: "oklch(0.52 0.26 145)" };
    case "autumn":  return { fill1: "oklch(0.55 0.20 55)",  fill2: "oklch(0.60 0.22 50)",  fill3: "oklch(0.65 0.18 45)" };
    case "winter":  return { fill1: "oklch(0.72 0.06 220)", fill2: "oklch(0.78 0.05 215)", fill3: "oklch(0.82 0.04 210)" };
    default:        return { fill1: "oklch(0.48 0.20 145)", fill2: "oklch(0.52 0.22 140)", fill3: "oklch(0.55 0.24 145)" };
  }
}

// Flower component selector
function FlowerDecoration({ variety, x, y, scale }: { variety: number; x: number; y: number; scale: number }) {
  switch (variety) {
    case 0: return <CherryBlossom x={x} y={y} scale={scale} />;
    case 1: return <CitrusBlossom x={x} y={y} scale={scale} />;
    case 2: return <Lavender x={x} y={y} scale={scale} />;
    case 3: return <Poppy x={x} y={y} scale={scale} />;
    case 4: return <Rose x={x} y={y} scale={scale} />;
    default: return <CherryBlossom x={x} y={y} scale={scale} />;
  }
}

// Returns a decorative SVG overlay for special tree types with seasonal colors and advanced watercolor fills
function PlantOverlay({ plantType, stage, width, height, season, flowerVariety }: {
  plantType: PlantType;
  stage: GrowthStage;
  width: number;
  height: number;
  season?: Season;
  flowerVariety: number;
}) {
  if (stage === "seed" || stage === "sprout") return null;

  const colors = getSeasonalCanopyColor(season);
  const showFlowers = (stage === "sapling" || stage === "full") && (season === "spring" || season === "summer");
  const showFruits = (plantType === "citrus") && (stage === "full") && (season === "summer" || season === "autumn");

  if (plantType === "oak") {
    return (
      <svg
        width={width * 1.4}
        height={height * 0.7}
        viewBox="0 0 200 140"
        className="absolute pointer-events-none"
        style={{ bottom: height * 0.35, left: "50%", transform: "translateX(-50%)", zIndex: 9 }}
        aria-hidden="true"
      >
        <defs>
          {/* Oak: warm dense pigment pools, strong displacement */}
          <filter id="oak-wc" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.035 0.04" numOctaves={4} seed={12} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={9} xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="1.2" result="blurred" />
            <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
          </filter>
          {/* Bleed/feather edge for oak */}
          <filter id="oak-bleed" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
            <feTurbulence type="turbulence" baseFrequency="0.05 0.07" numOctaves={3} seed={22} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={16} xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="2.5" result="blurred" />
            <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
          </filter>
          <radialGradient id="oak-cg" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor={colors.fill3} stopOpacity="0.9" />
            <stop offset="55%" stopColor={colors.fill1} stopOpacity="0.85" />
            <stop offset="100%" stopColor={colors.fill2} stopOpacity="0.8" />
          </radialGradient>
        </defs>
        {/* Bleed outer wash */}
        <ellipse cx="100" cy="80" rx="92" ry="58" fill={colors.fill1} opacity="0.15" filter="url(#oak-bleed)" />
        {/* Main canopy body */}
        <ellipse cx="100" cy="80" rx="88" ry="54" fill="url(#oak-cg)" opacity="0.68" filter="url(#oak-wc)" />
        {/* Mid-tone pigment pools */}
        <ellipse cx="60" cy="88" rx="55" ry="38" fill={colors.fill2} opacity="0.32" filter="url(#oak-wc)" />
        <ellipse cx="140" cy="88" rx="55" ry="38" fill={colors.fill2} opacity="0.32" filter="url(#oak-wc)" />
        {/* Highlight wash */}
        <ellipse cx="100" cy="60" rx="62" ry="40" fill={colors.fill3} opacity="0.25" filter="url(#oak-wc)" />
        {/* Dark shadow pooling at base */}
        <ellipse cx="100" cy="100" rx="55" ry="18" fill={colors.fill2} opacity="0.2" filter="url(#oak-wc)" />
        {/* Accent blobs */}
        <ellipse cx="75" cy="70" rx="22" ry="16" fill={colors.fill1} opacity="0.18" filter="url(#oak-wc)" />
        <ellipse cx="125" cy="68" rx="20" ry="15" fill={colors.fill3} opacity="0.18" filter="url(#oak-wc)" />
        {showFlowers && (
          <>
            <FlowerDecoration variety={flowerVariety} x={70} y={55} scale={0.9} />
            <FlowerDecoration variety={flowerVariety} x={120} y={60} scale={0.8} />
            <FlowerDecoration variety={flowerVariety} x={95} y={40} scale={0.85} />
          </>
        )}
      </svg>
    );
  }

  if (plantType === "cypress") {
    return (
      <svg
        width={width * 0.8}
        height={height * 0.9}
        viewBox="0 0 80 200"
        className="absolute pointer-events-none"
        style={{ bottom: height * 0.1, left: "50%", transform: "translateX(-50%)", zIndex: 9 }}
        aria-hidden="true"
      >
        <defs>
          <filter id="cyp-wc" x="-15%" y="-10%" width="130%" height="120%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.04 0.03" numOctaves={3} seed={8} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={6} xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="0.9" result="blurred" />
            <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
          </filter>
          <filter id="cyp-bleed" x="-25%" y="-15%" width="150%" height="130%" colorInterpolationFilters="sRGB">
            <feTurbulence type="turbulence" baseFrequency="0.06 0.04" numOctaves={3} seed={18} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={12} xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="2" result="blurred" />
            <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
          </filter>
          <linearGradient id="cyp-cg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.fill3} stopOpacity="0.9" />
            <stop offset="55%" stopColor={colors.fill1} stopOpacity="0.85" />
            <stop offset="100%" stopColor={colors.fill2} stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {/* Bleed outer wash */}
        <ellipse cx="40" cy="100" rx="32" ry="94" fill={colors.fill1} opacity="0.15" filter="url(#cyp-bleed)" />
        {/* Main body */}
        <ellipse cx="40" cy="100" rx="28" ry="90" fill="url(#cyp-cg)" opacity="0.7" filter="url(#cyp-wc)" />
        {/* Mid-tone layer */}
        <ellipse cx="40" cy="80" rx="20" ry="70" fill={colors.fill2} opacity="0.32" filter="url(#cyp-wc)" />
        {/* Highlight */}
        <ellipse cx="38" cy="60" rx="12" ry="48" fill={colors.fill3} opacity="0.25" filter="url(#cyp-wc)" />
        {/* Dark base */}
        <ellipse cx="40" cy="155" rx="18" ry="22" fill={colors.fill2} opacity="0.2" filter="url(#cyp-wc)" />
      </svg>
    );
  }

  if (plantType === "lollipop") {
    return (
      <svg
        width={width * 1.1}
        height={height * 0.75}
        viewBox="0 0 160 120"
        className="absolute pointer-events-none"
        style={{ bottom: height * 0.3, left: "50%", transform: "translateX(-50%)", zIndex: 9 }}
        aria-hidden="true"
      >
        <defs>
          <filter id="lol-wc" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.028 0.05" numOctaves={5} seed={6} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={10} xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="1.5" result="blurred" />
            <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
          </filter>
          <filter id="lol-bleed" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
            <feTurbulence type="turbulence" baseFrequency="0.04 0.06" numOctaves={3} seed={25} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={18} xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="3" result="blurred" />
            <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
          </filter>
          <radialGradient id="lol-cg" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor={colors.fill3} stopOpacity="0.9" />
            <stop offset="55%" stopColor={colors.fill1} stopOpacity="0.85" />
            <stop offset="100%" stopColor={colors.fill2} stopOpacity="0.8" />
          </radialGradient>
        </defs>
        {/* Bleed outer wash */}
        <circle cx="80" cy="60" r="58" fill={colors.fill1} opacity="0.15" filter="url(#lol-bleed)" />
        {/* Main canopy */}
        <circle cx="80" cy="60" r="54" fill="url(#lol-cg)" opacity="0.68" filter="url(#lol-wc)" />
        {/* Mid-tone layer */}
        <circle cx="80" cy="60" r="42" fill={colors.fill2} opacity="0.28" filter="url(#lol-wc)" />
        {/* Highlight */}
        <circle cx="72" cy="50" r="26" fill={colors.fill3} opacity="0.22" filter="url(#lol-wc)" />
        {/* Dark base */}
        <ellipse cx="80" cy="88" rx="32" ry="14" fill={colors.fill2} opacity="0.2" filter="url(#lol-wc)" />
        {/* Fruit dots */}
        <circle cx="60" cy="45" r="5" fill="oklch(0.78 0.22 50)" opacity="0.55" />
        <circle cx="95" cy="40" r="4" fill="oklch(0.75 0.20 30)" opacity="0.55" />
        <circle cx="55" cy="68" r="4" fill="oklch(0.80 0.18 80)" opacity="0.55" />
        <circle cx="105" cy="65" r="5" fill="oklch(0.72 0.22 60)" opacity="0.55" />
        <circle cx="80" cy="35" r="3.5" fill="oklch(0.76 0.24 20)" opacity="0.55" />
        {showFlowers && (
          <>
            <FlowerDecoration variety={flowerVariety} x={65} y={50} scale={0.8} />
            <FlowerDecoration variety={flowerVariety} x={95} y={55} scale={0.75} />
          </>
        )}
      </svg>
    );
  }

  if (plantType === "citrus") {
    return (
      <svg
        width={width * 1.4}
        height={height * 0.75}
        viewBox="0 0 200 150"
        className="absolute pointer-events-none"
        style={{ bottom: height * 0.3, left: "50%", transform: "translateX(-50%)", zIndex: 9 }}
        aria-hidden="true"
      >
        <defs>
          {/* Citrus: warmer denser pigment pools */}
          <filter id="cit-wc" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.038 0.038" numOctaves={4} seed={14} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={9} xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="1.2" result="blurred" />
            <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
          </filter>
          <filter id="cit-bleed" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
            <feTurbulence type="turbulence" baseFrequency="0.055 0.065" numOctaves={3} seed={28} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={16} xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="2.5" result="blurred" />
            <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
          </filter>
          <radialGradient id="cit-cg" cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor={colors.fill3} stopOpacity="0.9" />
            <stop offset="55%" stopColor={colors.fill1} stopOpacity="0.85" />
            <stop offset="100%" stopColor={colors.fill2} stopOpacity="0.8" />
          </radialGradient>
        </defs>
        {/* Bleed outer wash */}
        <ellipse cx="100" cy="85" rx="90" ry="62" fill={colors.fill1} opacity="0.15" filter="url(#cit-bleed)" />
        {/* Main canopy */}
        <ellipse cx="100" cy="85" rx="86" ry="58" fill="url(#cit-cg)" opacity="0.7" filter="url(#cit-wc)" />
        {/* Mid-tone pigment pools */}
        <ellipse cx="80" cy="90" rx="60" ry="42" fill={colors.fill2} opacity="0.32" filter="url(#cit-wc)" />
        <ellipse cx="120" cy="88" rx="58" ry="40" fill={colors.fill2} opacity="0.32" filter="url(#cit-wc)" />
        {/* Highlight */}
        <ellipse cx="100" cy="65" rx="62" ry="38" fill={colors.fill3} opacity="0.25" filter="url(#cit-wc)" />
        {/* Dark base */}
        <ellipse cx="100" cy="115" rx="50" ry="16" fill={colors.fill2} opacity="0.2" filter="url(#cit-wc)" />
        {/* Accent blobs */}
        <ellipse cx="72" cy="72" rx="20" ry="14" fill={colors.fill1} opacity="0.18" filter="url(#cit-wc)" />
        <ellipse cx="128" cy="70" rx="18" ry="13" fill={colors.fill3} opacity="0.18" filter="url(#cit-wc)" />
        {showFlowers && (
          <>
            <CitrusBlossom x={70} y={60} scale={1.0} />
            <CitrusBlossom x={115} y={55} scale={0.9} />
            <CitrusBlossom x={90} y={40} scale={0.85} />
            <CitrusBlossom x={130} y={75} scale={0.8} />
          </>
        )}
        {showFruits && (
          <>
            <circle cx="75" cy="90" r="10" fill="#FF8F00" opacity="0.88" />
            <circle cx="75" cy="90" r="10" fill="white" opacity="0.1" />
            <circle cx="72" cy="87" r="3" fill="#FFA000" opacity="0.5" />
            <circle cx="120" cy="95" r="11" fill="#FF8F00" opacity="0.85" />
            <circle cx="120" cy="95" r="11" fill="white" opacity="0.1" />
            <circle cx="100" cy="105" r="9" fill="#FF6F00" opacity="0.82" />
          </>
        )}
      </svg>
    );
  }

  if (plantType === "shrub") {
    return (
      <svg
        width={width * 1.3}
        height={height * 0.65}
        viewBox="0 0 180 120"
        className="absolute pointer-events-none"
        style={{ bottom: height * 0.2, left: "50%", transform: "translateX(-50%)", zIndex: 9 }}
        aria-hidden="true"
      >
        <defs>
          <filter id="shrub-wc" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.055 0.065" numOctaves={4} seed={16} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={10} xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="1.2" result="blurred" />
            <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
          </filter>
          <filter id="shrub-bleed" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
            <feTurbulence type="turbulence" baseFrequency="0.07 0.08" numOctaves={3} seed={30} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={18} xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="2.8" result="blurred" />
            <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
          </filter>
          <radialGradient id="shrub-cg" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor={colors.fill3} stopOpacity="0.9" />
            <stop offset="55%" stopColor={colors.fill1} stopOpacity="0.85" />
            <stop offset="100%" stopColor={colors.fill2} stopOpacity="0.8" />
          </radialGradient>
        </defs>
        {/* Bleed outer wash */}
        <ellipse cx="90" cy="75" rx="82" ry="44" fill={colors.fill1} opacity="0.15" filter="url(#shrub-bleed)" />
        {/* Main canopy */}
        <ellipse cx="90" cy="75" rx="78" ry="40" fill="url(#shrub-cg)" opacity="0.7" filter="url(#shrub-wc)" />
        {/* Mid-tone pools */}
        <ellipse cx="60" cy="70" rx="50" ry="32" fill={colors.fill2} opacity="0.32" filter="url(#shrub-wc)" />
        <ellipse cx="120" cy="68" rx="52" ry="30" fill={colors.fill2} opacity="0.32" filter="url(#shrub-wc)" />
        {/* Highlight */}
        <ellipse cx="90" cy="55" rx="52" ry="26" fill={colors.fill3} opacity="0.25" filter="url(#shrub-wc)" />
        {/* Dark base */}
        <ellipse cx="90" cy="95" rx="45" ry="12" fill={colors.fill2} opacity="0.2" filter="url(#shrub-wc)" />
        {showFlowers && (
          <>
            <Lavender x={60} y={50} scale={1.1} />
            <Lavender x={90} y={42} scale={1.0} />
            <Lavender x={120} y={48} scale={1.05} />
            <Lavender x={75} y={60} scale={0.9} />
          </>
        )}
      </svg>
    );
  }

  if (plantType === "willow") {
    return (
      <svg
        width={width * 1.5}
        height={height * 0.9}
        viewBox="0 0 220 200"
        className="absolute pointer-events-none"
        style={{ bottom: height * 0.1, left: "50%", transform: "translateX(-50%)", zIndex: 9 }}
        aria-hidden="true"
      >
        <defs>
          {/* Willow: softer diffuse washes, more displacement */}
          <filter id="wil-wc" x="-15%" y="-10%" width="130%" height="120%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.025 0.055" numOctaves={5} seed={10} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={12} xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="1.5" result="blurred" />
            <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
          </filter>
          <filter id="wil-bleed" x="-30%" y="-20%" width="160%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence type="turbulence" baseFrequency="0.035 0.07" numOctaves={4} seed={32} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={22} xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="3.5" result="blurred" />
            <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
          </filter>
          <radialGradient id="wil-cg" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor={colors.fill3} stopOpacity="0.85" />
            <stop offset="55%" stopColor={colors.fill1} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colors.fill2} stopOpacity="0.75" />
          </radialGradient>
        </defs>
        {/* Drooping branches — layered feather strokes */}
        {([30, 60, 90, 110, 130, 160, 190] as const).map((x, idx) => (
          <g key={`willow-branch-${x}`}>
            <path
              d={`M${x} 20 Q${x - 15 + idx * 3} 80 ${x - 20 + idx * 5} 180`}
              stroke={colors.fill2}
              strokeWidth="3.5"
              fill="none"
              opacity="0.5"
              filter="url(#wil-wc)"
            />
            <path
              d={`M${x} 20 Q${x - 12 + idx * 2} 75 ${x - 16 + idx * 4} 170`}
              stroke={colors.fill3}
              strokeWidth="2"
              fill="none"
              opacity="0.28"
              filter="url(#wil-wc)"
            />
          </g>
        ))}
        {/* Bleed outer wash */}
        <ellipse cx="110" cy="30" rx="94" ry="32" fill={colors.fill1} opacity="0.15" filter="url(#wil-bleed)" />
        {/* Canopy top */}
        <ellipse cx="110" cy="30" rx="90" ry="28" fill="url(#wil-cg)" opacity="0.65" filter="url(#wil-wc)" />
        {/* Mid-tone layer */}
        <ellipse cx="110" cy="22" rx="68" ry="20" fill={colors.fill2} opacity="0.28" filter="url(#wil-wc)" />
        {/* Highlight */}
        <ellipse cx="108" cy="16" rx="45" ry="14" fill={colors.fill3} opacity="0.22" filter="url(#wil-wc)" />
      </svg>
    );
  }

  if (plantType === "magnolia") {
    return (
      <svg
        width={width * 1.35}
        height={height * 0.75}
        viewBox="0 0 200 150"
        className="absolute pointer-events-none"
        style={{ bottom: height * 0.3, left: "50%", transform: "translateX(-50%)", zIndex: 9 }}
        aria-hidden="true"
      >
        <defs>
          <filter id="mag-wc" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.03 0.045" numOctaves={4} seed={20} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={9} xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="1.2" result="blurred" />
            <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
          </filter>
          <filter id="mag-bleed" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
            <feTurbulence type="turbulence" baseFrequency="0.045 0.06" numOctaves={3} seed={35} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={18} xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation="2.8" result="blurred" />
            <feComposite in="blurred" in2="SourceGraphic" operator="atop" />
          </filter>
          <radialGradient id="mag-cg" cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor={colors.fill3} stopOpacity="0.9" />
            <stop offset="55%" stopColor={colors.fill1} stopOpacity="0.85" />
            <stop offset="100%" stopColor={colors.fill2} stopOpacity="0.8" />
          </radialGradient>
        </defs>
        {/* Bleed outer wash */}
        <ellipse cx="100" cy="80" rx="88" ry="58" fill={colors.fill1} opacity="0.15" filter="url(#mag-bleed)" />
        {/* Main canopy */}
        <ellipse cx="100" cy="80" rx="84" ry="54" fill="url(#mag-cg)" opacity="0.68" filter="url(#mag-wc)" />
        {/* Mid-tone pools */}
        <ellipse cx="70" cy="85" rx="55" ry="38" fill={colors.fill2} opacity="0.3" filter="url(#mag-wc)" />
        <ellipse cx="130" cy="83" rx="55" ry="36" fill={colors.fill2} opacity="0.3" filter="url(#mag-wc)" />
        {/* Highlight */}
        <ellipse cx="100" cy="60" rx="58" ry="36" fill={colors.fill3} opacity="0.24" filter="url(#mag-wc)" />
        {/* Dark base */}
        <ellipse cx="100" cy="108" rx="48" ry="16" fill={colors.fill2} opacity="0.2" filter="url(#mag-wc)" />
        {/* Accent blobs */}
        <ellipse cx="75" cy="68" rx="20" ry="14" fill={colors.fill1} opacity="0.18" filter="url(#mag-wc)" />
        <ellipse cx="125" cy="66" rx="18" ry="13" fill={colors.fill3} opacity="0.18" filter="url(#mag-wc)" />
        {showFlowers && (
          <>
            <Rose x={65} y={55} scale={1.2} />
            <Rose x={105} y={45} scale={1.3} />
            <Rose x={140} y={60} scale={1.1} />
            <Rose x={85} y={70} scale={1.0} />
          </>
        )}
      </svg>
    );
  }

  return null;
}

export default function Plant({
  category,
  entries,
  stage,
  plantType = "tree",
  season,
  isNew = false,
}: PlantProps) {
  const [isGrowing, setIsGrowing] = useState(isNew);

  useEffect(() => {
    if (isNew) {
      const t = setTimeout(() => setIsGrowing(false), 1000);
      return () => clearTimeout(t);
    }
  }, [isNew]);

  const plantImage = getPlantImage(stage, plantType);
  const plantSize = getPlantSize(stage, plantType);
  const flowerVariety = getFlowerVariety(category);

  const hash = categoryHash(category);
  const swayDelay = (hash % 30) / 10;
  const swayDuration = 4 + (hash % 20) / 10;

  const swayStyle: React.CSSProperties = {
    transformOrigin: "center bottom",
    animation: isGrowing
      ? `plant-grow 0.8s ease-out forwards`
      : `plant-sway ${swayDuration}s ease-in-out ${swayDelay}s infinite`,
  };

  const branchPositions = entries.map((_, i) =>
    getBranchPosition(i, entries.length, plantType)
  );

  let branchOffsetY: number;
  if (plantType === "bush" || plantType === "shrub") {
    branchOffsetY = -plantSize.height * 0.5;
  } else if (plantType === "cypress") {
    branchOffsetY = -plantSize.height * 0.6;
  } else if (plantType === "oak" || plantType === "citrus") {
    branchOffsetY = -plantSize.height * 0.65;
  } else if (plantType === "willow") {
    branchOffsetY = -plantSize.height * 0.55;
  } else {
    branchOffsetY = -plantSize.height * 0.7;
  }

  return (
    <div className="flex flex-col items-center gap-1 relative">
      <div className="text-center mb-1">
        <span className="text-xs font-sans text-muted-foreground bg-background/70 px-2 py-0.5 rounded-full border border-border/30">
          {category}
        </span>
        <div className="text-xs text-primary/70 font-sans mt-0.5">
          {getPlantLabel(stage)}
        </div>
      </div>

      <div style={swayStyle} className="relative flex items-end justify-center">
        <PlantOverlay
          plantType={plantType}
          stage={stage}
          width={plantSize.width}
          height={plantSize.height}
          season={season}
          flowerVariety={flowerVariety}
        />

        {entries.length > 0 && stage !== "seed" && (
          <div
            className="absolute pointer-events-none"
            style={{
              width: 0,
              height: 0,
              left: "50%",
              top: `${branchOffsetY}px`,
            }}
          >
            {entries.map((entry, i) => {
              const pos = branchPositions[i];
              return (
                <div
                  key={String(entry.id)}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    transform: `translate(-50%, -50%) scale(${pos.scale})`,
                    zIndex: pos.zIndex,
                  }}
                >
                  <Branch entry={entry} index={i} plantType={plantType} season={season} />
                </div>
              );
            })}
          </div>
        )}

        <img
          src={plantImage}
          alt={`${category} plant - ${stage}`}
          style={{
            width: plantSize.width,
            height: plantSize.height,
            objectFit: "contain",
          }}
          className="relative z-10 drop-shadow-md"
        />
      </div>

      <div className="text-xs font-sans text-muted-foreground mt-1">
        {entries.length} {entries.length === 1 ? "entry" : "entries"}
      </div>
    </div>
  );
}
