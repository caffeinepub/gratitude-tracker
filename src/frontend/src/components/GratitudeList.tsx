import { Trash2, Tag, Clock, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetEntries, useDeleteEntry } from '@/hooks/useQueries';
import { formatDate, formatRelativeTime } from '@/utils/formatDate';

function EntryCardSkeleton() {
    return (
        <div className="bg-card rounded-2xl shadow-card border border-border p-5 space-y-3">
            <Skeleton className="h-4 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded-lg" />
            <div className="flex justify-between items-center pt-1">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-5">
                <Leaf className="w-9 h-9 text-accent-foreground/60" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                Your gratitude journal is empty
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                Begin by adding something you're grateful for today — no matter how small, every moment of gratitude matters.
            </p>
        </div>
    );
}

export function GratitudeList() {
    const { data: entries = [], isLoading } = useGetEntries();
    const deleteEntry = useDeleteEntry();

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <EntryCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (entries.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="space-y-4">
            {entries.map((entry) => (
                <article
                    key={String(entry.id)}
                    className="group bg-card rounded-2xl shadow-card hover:shadow-card-hover border border-border p-5 transition-all duration-200 animate-fade-in-up"
                >
                    {/* Gratitude text */}
                    <p className="text-foreground text-base leading-relaxed font-sans mb-3 whitespace-pre-wrap">
                        {entry.text}
                    </p>

                    {/* Footer row */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3 flex-wrap">
                            {/* Category badge */}
                            {entry.category && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/25 text-accent-foreground border border-accent/30">
                                    <Tag className="w-3 h-3" />
                                    {entry.category}
                                </span>
                            )}

                            {/* Timestamp */}
                            <span
                                className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                                title={formatDate(entry.timestamp)}
                            >
                                <Clock className="w-3 h-3" />
                                {formatRelativeTime(entry.timestamp)}
                            </span>
                        </div>

                        {/* Delete button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteEntry.mutate(entry.id)}
                            disabled={deleteEntry.isPending && deleteEntry.variables === entry.id}
                            className="opacity-0 group-hover:opacity-100 focus:opacity-100 h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                            aria-label="Delete entry"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </article>
            ))}
        </div>
    );
}
