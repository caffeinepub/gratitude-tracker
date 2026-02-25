import { useEffect, useRef, useState } from 'react';
import type { GratitudeEntry } from '../backend';
import { Branch } from './Branch';
import { getPlantImage, getPlantSize, getStageLabel, type PlantStage } from '@/utils/plantGrouping';

interface PlantProps {
  category: string;
  entries: GratitudeEntry[];
  stage: PlantStage;
  isNew?: boolean;
}

export function Plant({ category, entries, stage, isNew }: PlantProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [growing, setGrowing] = useState(false);
  const prevCountRef = useRef(entries.length);

  // Trigger grow animation when a new entry is added
  useEffect(() => {
    if (entries.length > prevCountRef.current) {
      setGrowing(true);
      const t = setTimeout(() => setGrowing(false), 900);
      prevCountRef.current = entries.length;
      return () => clearTimeout(t);
    }
    prevCountRef.current = entries.length;
  }, [entries.length]);

  // Also animate on mount if isNew
  useEffect(() => {
    if (isNew) {
      setGrowing(true);
      const t = setTimeout(() => setGrowing(false), 900);
      return () => clearTimeout(t);
    }
  }, [isNew]);

  const size = getPlantSize(stage);
  const imgSrc = getPlantImage(stage);
  const stageLabel = getStageLabel(stage);

  // Container needs extra space for leaves
  const containerW = size.width + 80;
  const containerH = size.height + 80;

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      {/* Plant visual area */}
      <div
        className="relative flex items-end justify-center"
        style={{ width: containerW, height: containerH }}
      >
        {/* Branches/leaves for sprout and above */}
        {stage !== 'seed' &&
          entries.slice(0, 12).map((entry, i) => (
            <Branch
              key={String(entry.id)}
              entry={entry}
              index={i}
              total={Math.min(entries.length, 12)}
              stageSize={{ width: containerW, height: containerH }}
            />
          ))}

        {/* Plant image */}
        <img
          ref={imgRef}
          src={imgSrc}
          alt={`${category} plant - ${stageLabel}`}
          className="relative z-20 drop-shadow-md object-contain"
          style={{
            width: size.width,
            height: size.height,
            animation: growing
              ? 'plant-grow 0.9s ease-out'
              : `plant-sway ${3 + (category.length % 3) * 0.8}s ease-in-out infinite alternate`,
          }}
        />
      </div>

      {/* Category label */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="font-serif text-sm font-semibold text-foreground text-center leading-tight max-w-[120px] truncate">
          {category}
        </span>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          {stageLabel} · {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>
    </div>
  );
}
