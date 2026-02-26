import type { GratitudeEntry } from "../backend";

export type PlantType = "tree" | "flower" | "bush" | "oak" | "cypress" | "lollipop" | "citrus" | "shrub" | "willow" | "magnolia";
export type GrowthStage = "seed" | "sprout" | "sapling" | "full";

export interface PlantGroup {
  category: string;
  entries: GratitudeEntry[];
  stage: GrowthStage;
  plantType: PlantType;
}

export interface BranchPosition {
  angle: number;
  radius: number;
  x: number;
  y: number;
  scale: number;
  zIndex: number;
}

// Deterministically assign a plant type based on category name
export function getPlantType(category: string): PlantType {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash * 31 + category.charCodeAt(i)) & 0xffffffff;
  }
  const types: PlantType[] = ["tree", "flower", "bush", "oak", "cypress", "lollipop", "citrus", "shrub", "willow", "magnolia"];
  return types[Math.abs(hash) % types.length];
}

// Deterministically assign a flower variety index (0–4) per category
export function getFlowerVariety(category: string): number {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash * 37 + category.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash) % 5;
}

export function groupEntriesByCategory(
  entries: GratitudeEntry[]
): PlantGroup[] {
  const map = new Map<string, GratitudeEntry[]>();

  for (const entry of entries) {
    const cat = entry.category ?? "General";
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat)!.push(entry);
  }

  return Array.from(map.entries()).map(([category, catEntries]) => ({
    category,
    entries: catEntries,
    stage: getGrowthStage(catEntries.length),
    plantType: getPlantType(category),
  }));
}

export function getGrowthStage(entryCount: number): GrowthStage {
  if (entryCount === 0) return "seed";
  if (entryCount <= 2) return "sprout";
  if (entryCount <= 5) return "sapling";
  return "full";
}

export function getPlantImage(stage: GrowthStage, plantType: PlantType = "tree"): string {
  if (stage === "seed") return "/assets/generated/plant-seed.dim_128x128.png";
  if (stage === "sprout") return "/assets/generated/plant-sprout.dim_128x128.png";

  if (plantType === "flower") {
    if (stage === "sapling") return "/assets/generated/plant-flower-daisy.dim_200x300.png";
    return "/assets/generated/plant-flower-sunflower.dim_200x300.png";
  }

  if (plantType === "bush" || plantType === "shrub") {
    return "/assets/generated/plant-bush.dim_200x300.png";
  }

  if (plantType === "oak" || plantType === "citrus" || plantType === "magnolia") {
    if (stage === "sapling") return "/assets/generated/plant-sapling.dim_200x256.png";
    return "/assets/generated/plant-tree.dim_256x320.png";
  }

  if (plantType === "cypress" || plantType === "willow") {
    if (stage === "sapling") return "/assets/generated/plant-sapling.dim_200x256.png";
    return "/assets/generated/plant-sapling.dim_200x256.png";
  }

  if (plantType === "lollipop") {
    if (stage === "sapling") return "/assets/generated/plant-bush.dim_200x300.png";
    return "/assets/generated/plant-tree.dim_256x320.png";
  }

  // tree (default)
  if (stage === "sapling") return "/assets/generated/plant-sapling.dim_200x256.png";
  return "/assets/generated/plant-tree.dim_256x320.png";
}

export function getPlantSize(
  stage: GrowthStage,
  plantType: PlantType = "tree"
): { width: number; height: number } {
  if (stage === "seed") return { width: 64, height: 64 };
  if (stage === "sprout") return { width: 80, height: 80 };

  if (plantType === "flower") {
    if (stage === "sapling") return { width: 100, height: 150 };
    return { width: 120, height: 180 };
  }

  if (plantType === "bush" || plantType === "shrub") {
    if (stage === "sapling") return { width: 110, height: 100 };
    return { width: 140, height: 120 };
  }

  if (plantType === "oak" || plantType === "citrus") {
    if (stage === "sapling") return { width: 140, height: 140 };
    return { width: 190, height: 180 };
  }

  if (plantType === "cypress") {
    if (stage === "sapling") return { width: 80, height: 180 };
    return { width: 90, height: 220 };
  }

  if (plantType === "willow") {
    if (stage === "sapling") return { width: 100, height: 160 };
    return { width: 150, height: 210 };
  }

  if (plantType === "magnolia") {
    if (stage === "sapling") return { width: 130, height: 150 };
    return { width: 175, height: 190 };
  }

  if (plantType === "lollipop") {
    if (stage === "sapling") return { width: 110, height: 130 };
    return { width: 140, height: 160 };
  }

  // tree
  if (stage === "sapling") return { width: 120, height: 150 };
  return { width: 160, height: 200 };
}

export function getPlantLabel(stage: GrowthStage): string {
  switch (stage) {
    case "seed": return "Seed";
    case "sprout": return "Sprout";
    case "sapling": return "Sapling";
    case "full": return "Full Bloom";
  }
}

// Golden-angle phyllotaxis for organic branch/leaf placement
export function getBranchPosition(
  index: number,
  total: number,
  plantType: PlantType = "tree"
): BranchPosition {
  const goldenAngle = 137.508;
  const angle = index * goldenAngle;

  let maxRadius: number;
  if (plantType === "oak" || plantType === "citrus") {
    maxRadius = 85;
  } else if (plantType === "cypress") {
    maxRadius = 45;
  } else if (plantType === "willow") {
    maxRadius = 70;
  } else if (plantType === "magnolia") {
    maxRadius = 75;
  } else if (plantType === "lollipop") {
    maxRadius = 60;
  } else if (plantType === "tree") {
    maxRadius = 70;
  } else if (plantType === "flower") {
    maxRadius = 55;
  } else if (plantType === "shrub") {
    maxRadius = 55;
  } else {
    maxRadius = 50;
  }

  const minRadius = 20;
  const radius =
    total <= 1
      ? minRadius
      : minRadius + ((maxRadius - minRadius) * index) / Math.max(total - 1, 1);

  const rad = (angle * Math.PI) / 180;
  const xFlatten = plantType === "cypress" ? 0.4 : plantType === "willow" ? 0.8 : 1;
  const yFlatten = (plantType === "oak" || plantType === "citrus") ? 0.5 : 0.6;
  const x = Math.cos(rad) * radius * xFlatten;
  const y = Math.sin(rad) * radius * yFlatten;

  const scale = 0.6 + (index / Math.max(total, 1)) * 0.4;
  const zIndex = Math.round(scale * 10);

  return { angle, radius, x, y, scale, zIndex };
}
