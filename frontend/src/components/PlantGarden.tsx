import { useMemo, useRef } from 'react';
import { useGetEntries } from '@/hooks/useQueries';
import { Plant } from './Plant';
import { groupEntriesByCategory } from '@/utils/plantGrouping';
import { Skeleton } from '@/components/ui/skeleton';
import { Leaf } from 'lucide-react';

function GardenSkeleton() {
  return (
    <div className="flex gap-10 px-8 py-6 items-end">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col items-center gap-3">
          <Skeleton className="rounded-2xl" style={{ width: 120 + i * 20, height: 120 + i * 30 }} />
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-3 w-14 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function EmptyGarden() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-5">
        <Leaf className="w-9 h-9 text-accent-foreground/60" />
      </div>
      <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
        Your garden is waiting
      </h3>
      <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
        Plant your first seed of gratitude above. Each category you add will grow into its own unique plant — water it with more entries and watch it flourish!
      </p>
    </div>
  );
}

export function PlantGarden() {
  const { data: entries = [], isLoading } = useGetEntries();
  const prevGroupsRef = useRef<Set<string>>(new Set());

  const groups = useMemo(() => groupEntriesByCategory(entries), [entries]);

  // Track which categories are newly added
  const newCategories = useMemo(() => {
    const current = new Set(groups.map((g) => g.category));
    const newOnes = new Set<string>();
    current.forEach((cat) => {
      if (!prevGroupsRef.current.has(cat)) newOnes.add(cat);
    });
    prevGroupsRef.current = current;
    return newOnes;
  }, [groups]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border shadow-warm">
      {/* Sky background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/assets/generated/garden-sky.dim_1200x600.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      />
      {/* Warm sky overlay for cohesion */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/10" />

      {/* Ground strip */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{
          height: 72,
          backgroundImage: 'url(/assets/generated/garden-ground.dim_1200x120.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
        }}
      />

      {/* Content */}
      <div className="relative z-20 min-h-[320px]">
        {isLoading ? (
          <GardenSkeleton />
        ) : groups.length === 0 ? (
          <EmptyGarden />
        ) : (
          <div
            className="overflow-x-auto pb-20 pt-8 px-8"
            style={{ scrollbarWidth: 'thin' }}
          >
            <div className="flex gap-10 items-end" style={{ minWidth: 'max-content' }}>
              {groups.map((group) => (
                <div
                  key={group.category}
                  className="animate-fade-in-up"
                >
                  <Plant
                    category={group.category}
                    entries={group.entries}
                    stage={group.stage}
                    isNew={newCategories.has(group.category)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
