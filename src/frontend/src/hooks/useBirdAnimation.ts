import { useState, useEffect, useRef, useCallback } from "react";
import type { BirdData } from "../components/Bird";
import type { PlantGroup } from "../utils/plantGrouping";
import type { Season } from "./useSeason";
import { getWeightedBirdVariety } from "../utils/birdVarietyAssignment";

const BIRD_COUNT = 5;

// For dev/demo: shorter intervals (10–30 seconds) so birds are visible
const DEV_MIN = 10_000;
const DEV_MAX = 30_000;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function randomPerchPosition(plantGroups: PlantGroup[]): { x: number; y: number } {
  if (plantGroups.length === 0) {
    return {
      x: 10 + Math.random() * 80,
      y: 30 + Math.random() * 40,
    };
  }
  const idx = Math.floor(Math.random() * plantGroups.length);
  const plantX = 10 + (idx / Math.max(plantGroups.length - 1, 1)) * 80;
  const plantY = 25 + Math.random() * 30;
  return {
    x: Math.max(5, Math.min(95, plantX + (Math.random() - 0.5) * 15)),
    y: Math.max(15, Math.min(70, plantY + (Math.random() - 0.5) * 10)),
  };
}

function initBirds(plantGroups: PlantGroup[], season: Season): BirdData[] {
  return Array.from({ length: BIRD_COUNT }, (_, i) => {
    const pos = randomPerchPosition(plantGroups);
    return {
      id: i,
      variety: getWeightedBirdVariety(season),
      x: pos.x,
      y: pos.y,
      state: "perched" as const,
      flipX: Math.random() > 0.5,
    };
  });
}

export function useBirdAnimation(plantGroups: PlantGroup[], season: Season) {
  const [birds, setBirds] = useState<BirdData[]>(() => initBirds(plantGroups, season));
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const plantGroupsRef = useRef(plantGroups);
  const seasonRef = useRef(season);

  useEffect(() => {
    plantGroupsRef.current = plantGroups;
  }, [plantGroups]);

  useEffect(() => {
    seasonRef.current = season;
  }, [season]);

  const scheduleFlight = useCallback((birdId: number) => {
    const delay = randomBetween(DEV_MIN, DEV_MAX);
    const timer = setTimeout(() => {
      setBirds((prev) =>
        prev.map((b) =>
          b.id === birdId ? { ...b, state: "flying" as const } : b
        )
      );

      const moveTimer = setTimeout(() => {
        const newPos = randomPerchPosition(plantGroupsRef.current);
        setBirds((prev) =>
          prev.map((b) =>
            b.id === birdId
              ? {
                  ...b,
                  x: newPos.x,
                  y: newPos.y,
                  flipX: Math.random() > 0.5,
                  variety: Math.random() > 0.85
                    ? getWeightedBirdVariety(seasonRef.current)
                    : b.variety,
                }
              : b
          )
        );

        const landTimer = setTimeout(() => {
          setBirds((prev) =>
            prev.map((b) =>
              b.id === birdId ? { ...b, state: "perched" as const } : b
            )
          );
          scheduleFlight(birdId);
        }, 2800);

        timersRef.current.set(birdId * 100 + 2, landTimer);
      }, 400);

      timersRef.current.set(birdId * 100 + 1, moveTimer);
    }, delay);

    timersRef.current.set(birdId, timer);
  }, []);

  useEffect(
    () => {
      const staggerTimers: ReturnType<typeof setTimeout>[] = [];
      birds.forEach((bird, i) => {
        const stagger = setTimeout(() => {
          scheduleFlight(bird.id);
        }, i * randomBetween(2000, 6000));
        staggerTimers.push(stagger);
      });

      return () => {
        staggerTimers.forEach(clearTimeout);
        timersRef.current.forEach(clearTimeout);
        timersRef.current.clear();
      };
    },
    []
  );

  const prevLengthRef = useRef(plantGroups.length);
  useEffect(() => {
    if (prevLengthRef.current === 0 && plantGroups.length > 0) {
      setBirds(initBirds(plantGroups, seasonRef.current));
    }
    prevLengthRef.current = plantGroups.length;
  }, [plantGroups]);

  return birds;
}
