import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface GratitudeEntry {
    id: Id;
    text: string;
    timestamp: bigint;
    category?: string;
}
export type Id = bigint;
export interface backendInterface {
    addEntry(text: string, category: string | null): Promise<GratitudeEntry>;
    deleteEntry(id: Id): Promise<void>;
    getEntries(): Promise<Array<GratitudeEntry>>;
}
