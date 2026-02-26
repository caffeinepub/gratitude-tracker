import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Id = bigint;
export interface Goal {
    id: Id;
    createdAt: bigint;
    text: string;
    completed: boolean;
}
export interface GratitudeEntry {
    id: Id;
    text: string;
    timestamp: bigint;
    category?: string;
}
export interface backendInterface {
    addEntry(text: string, category: string | null): Promise<GratitudeEntry>;
    addGoal(text: string): Promise<Goal>;
    deleteEntry(id: Id): Promise<void>;
    deleteGoal(id: Id): Promise<void>;
    getEntries(): Promise<Array<GratitudeEntry>>;
    getGoals(): Promise<Array<Goal>>;
    getSuggestedGoals(): Promise<Array<string>>;
    updateGoal(id: Id, completed: boolean): Promise<Goal>;
}
