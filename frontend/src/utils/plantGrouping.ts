import type { GratitudeEntry } from '../backend';

export type PlantStage = 'seed' | 'sprout' | 'sapling' | 'tree';

export interface PlantGroup {
  category: string;
  entries: GratitudeEntry[];
  stage: PlantStage;
}

export function groupEntriesByCategory(entries: GratitudeEntry[]): PlantGroup[] {
  const map: Record<string, GratitudeEntry[]> = {};

  for (const entry of entries) {
    const key = entry.category?.trim() || 'General';
    if (!map[key]) map[key] = [];
    map[key].push(entry);
  }

  return Object.entries(map).map(([category, catEntries]) => ({
    category,
    entries: catEntries,
    stage: getPlantStage(catEntries.length),
  }));
}

export function getPlantStage(count: number): PlantStage {
  if (count <= 1) return 'seed';
  if (count <= 3) return 'sprout';
  if (count <= 6) return 'sapling';
  return 'tree';
}

export function getPlantImage(stage: PlantStage): string {
  switch (stage) {
    case 'seed':
      return '/assets/generated/plant-seed.dim_128x128.png';
    case 'sprout':
      return '/assets/generated/plant-sprout.dim_128x128.png';
    case 'sapling':
      return '/assets/generated/plant-sapling.dim_200x256.png';
    case 'tree':
      return '/assets/generated/plant-tree.dim_256x320.png';
  }
}

export function getPlantSize(stage: PlantStage): { width: number; height: number } {
  switch (stage) {
    case 'seed':
      return { width: 80, height: 80 };
    case 'sprout':
      return { width: 96, height: 96 };
    case 'sapling':
      return { width: 140, height: 180 };
    case 'tree':
      return { width: 180, height: 224 };
  }
}

export function getStageLabel(stage: PlantStage): string {
  switch (stage) {
    case 'seed':
      return 'Seed';
    case 'sprout':
      return 'Sprout';
    case 'sapling':
      return 'Sapling';
    case 'tree':
      return 'Tree';
  }
}
