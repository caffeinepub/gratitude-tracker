import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { GratitudeEntry } from '../backend';

const ENTRIES_KEY = ['gratitude-entries'];

export function useGetEntries() {
    const { actor, isFetching } = useActor();

    return useQuery<GratitudeEntry[]>({
        queryKey: ENTRIES_KEY,
        queryFn: async () => {
            if (!actor) return [];
            return actor.getEntries();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useAddEntry() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ text, category }: { text: string; category: string | null }) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.addEntry(text, category);
        },
        onSuccess: (newEntry) => {
            queryClient.setQueryData<GratitudeEntry[]>(ENTRIES_KEY, (old = []) => {
                return [newEntry, ...old];
            });
        },
    });
}

export function useDeleteEntry() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: bigint) => {
            if (!actor) throw new Error('Actor not initialized');
            return actor.deleteEntry(id);
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ENTRIES_KEY });
            const previous = queryClient.getQueryData<GratitudeEntry[]>(ENTRIES_KEY);
            queryClient.setQueryData<GratitudeEntry[]>(ENTRIES_KEY, (old = []) =>
                old.filter((e) => e.id !== id)
            );
            return { previous };
        },
        onError: (_err, _id, context) => {
            if (context?.previous) {
                queryClient.setQueryData(ENTRIES_KEY, context.previous);
            }
        },
    });
}
