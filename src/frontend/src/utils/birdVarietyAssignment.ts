import type { Season } from "../hooks/useSeason";

export type AllBirdVariety = "sparrow" | "robin" | "bluetit" | "canary" | "cardinal" | "parakeet";

// Seasonal weights for each bird variety (higher = more likely)
const seasonalWeights: Record<Season, Record<AllBirdVariety, number>> = {
  spring: {
    sparrow: 3,
    robin: 4,
    bluetit: 3,
    canary: 4,
    cardinal: 2,
    parakeet: 3,
  },
  summer: {
    sparrow: 2,
    robin: 2,
    bluetit: 2,
    canary: 5,
    cardinal: 2,
    parakeet: 5,
  },
  autumn: {
    sparrow: 4,
    robin: 3,
    bluetit: 3,
    canary: 2,
    cardinal: 4,
    parakeet: 2,
  },
  winter: {
    sparrow: 3,
    robin: 5,
    bluetit: 4,
    canary: 2,
    cardinal: 5,
    parakeet: 1,
  },
};

export function getWeightedBirdVariety(season: Season): AllBirdVariety {
  const weights = seasonalWeights[season];
  const entries = Object.entries(weights) as [AllBirdVariety, number][];
  const totalWeight = entries.reduce((sum, [, w]) => sum + w, 0);
  let rand = Math.random() * totalWeight;
  for (const [variety, weight] of entries) {
    rand -= weight;
    if (rand <= 0) return variety;
  }
  return "sparrow";
}

export function getSeasonalBirdVarieties(season: Season): AllBirdVariety[] {
  return Object.keys(seasonalWeights[season]) as AllBirdVariety[];
}
