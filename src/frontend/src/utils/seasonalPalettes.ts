import type { Season } from "../hooks/useSeason";

export interface SeasonalPalette {
  skyTop: string;
  skyBottom: string;
  groundTop: string;
  groundBottom: string;
  horizonFoliage1: string;
  horizonFoliage2: string;
  foliageColors: string[];
  accentColors: string[];
  overlayOpacity: number;
}

const palettes: Record<Season, SeasonalPalette> = {
  spring: {
    skyTop: "oklch(0.72 0.12 240)",
    skyBottom: "oklch(0.90 0.08 80)",
    groundTop: "oklch(0.65 0.20 145)",
    groundBottom: "oklch(0.55 0.18 140)",
    horizonFoliage1: "oklch(0.68 0.18 145)",
    horizonFoliage2: "oklch(0.72 0.16 140)",
    foliageColors: ["#a8d8a8", "#c8e6c9", "#f8bbd0", "#f48fb1", "#ce93d8"],
    accentColors: ["#f8bbd0", "#f48fb1", "#fce4ec", "#e1bee7"],
    overlayOpacity: 0,
  },
  summer: {
    skyTop: "oklch(0.60 0.16 240)",
    skyBottom: "oklch(0.85 0.10 200)",
    groundTop: "oklch(0.55 0.22 145)",
    groundBottom: "oklch(0.45 0.20 140)",
    horizonFoliage1: "oklch(0.50 0.22 145)",
    horizonFoliage2: "oklch(0.55 0.20 140)",
    foliageColors: ["#2e7d32", "#388e3c", "#43a047", "#1b5e20", "#33691e"],
    accentColors: ["#f9a825", "#f57f17", "#e65100"],
    overlayOpacity: 0,
  },
  autumn: {
    skyTop: "oklch(0.65 0.10 55)",
    skyBottom: "oklch(0.82 0.12 70)",
    groundTop: "oklch(0.55 0.16 60)",
    groundBottom: "oklch(0.45 0.14 55)",
    horizonFoliage1: "oklch(0.58 0.18 55)",
    horizonFoliage2: "oklch(0.62 0.16 50)",
    foliageColors: ["#e65100", "#bf360c", "#f57f17", "#e65100", "#6d4c41"],
    accentColors: ["#ff8f00", "#e65100", "#bf360c", "#4e342e"],
    overlayOpacity: 0,
  },
  winter: {
    skyTop: "oklch(0.55 0.06 240)",
    skyBottom: "oklch(0.80 0.04 220)",
    groundTop: "oklch(0.88 0.04 220)",
    groundBottom: "oklch(0.78 0.06 215)",
    horizonFoliage1: "oklch(0.60 0.06 220)",
    horizonFoliage2: "oklch(0.65 0.05 215)",
    foliageColors: ["#90a4ae", "#b0bec5", "#cfd8dc", "#78909c", "#546e7a"],
    accentColors: ["#e3f2fd", "#bbdefb", "#90caf9"],
    overlayOpacity: 0.08,
  },
};

export function getSeasonalPalette(season: Season): SeasonalPalette {
  return palettes[season];
}

export function getSeasonalLeafColors(season: Season): string[] {
  return palettes[season].foliageColors;
}
