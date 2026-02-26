import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type { GratitudeEntry, Goal } from "../backend";

export function useGetEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<GratitudeEntry[]>({
    queryKey: ["entries"],
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
    mutationFn: async ({
      text,
      category,
    }: {
      text: string;
      category: string | null;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.addEntry(text, category);
    },
    onSuccess: (newEntry) => {
      queryClient.setQueryData<GratitudeEntry[]>(["entries"], (old = []) => [
        newEntry,
        ...old,
      ]);
    },
  });
}

export function useDeleteEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.deleteEntry(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["entries"] });
      const previous = queryClient.getQueryData<GratitudeEntry[]>(["entries"]);
      queryClient.setQueryData<GratitudeEntry[]>(["entries"], (old = []) =>
        old.filter((e) => e.id !== id)
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["entries"], context.previous);
      }
    },
  });
}

export function useGoals() {
  const { actor, isFetching } = useActor();

  return useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGoals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (text: string) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.addGoal(text);
    },
    onSuccess: (newGoal) => {
      queryClient.setQueryData<Goal[]>(["goals"], (old = []) => [
        newGoal,
        ...old,
      ]);
    },
  });
}

export function useUpdateGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      completed,
    }: {
      id: bigint;
      completed: boolean;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.updateGoal(id, completed);
    },
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: ["goals"] });
      const previous = queryClient.getQueryData<Goal[]>(["goals"]);
      queryClient.setQueryData<Goal[]>(["goals"], (old = []) =>
        old.map((g) => (g.id === id ? { ...g, completed } : g))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["goals"], context.previous);
      }
    },
  });
}

export function useDeleteGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.deleteGoal(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["goals"] });
      const previous = queryClient.getQueryData<Goal[]>(["goals"]);
      queryClient.setQueryData<Goal[]>(["goals"], (old = []) =>
        old.filter((g) => g.id !== id)
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["goals"], context.previous);
      }
    },
  });
}

export function useSuggestedGoals() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ["suggestedGoals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSuggestedGoals();
    },
    enabled: !!actor && !isFetching,
  });
}
