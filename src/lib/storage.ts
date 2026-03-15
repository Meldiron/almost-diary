import type { DiaryEntry, Stamp } from "./types";
import { DEFAULT_STAMPS } from "./types";

export const STORAGE_KEYS = {
	entries: "diary-entries",
	stamps: "diary-stamps",
	openrouterKey: "diary-openrouter-key",
} as const;

function getItem<T>(key: string, fallback: T): T {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : fallback;
	} catch {
		return fallback;
	}
}

function setItem<T>(key: string, value: T): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(key, JSON.stringify(value));
}

// ── Entries ──────────────────────────────────────────────────────────────────

export function getAllEntries(): Record<string, DiaryEntry> {
	return getItem(STORAGE_KEYS.entries, {});
}

export function getEntry(date: string): DiaryEntry {
	const entries = getAllEntries();
	return entries[date] ?? { date };
}

export function saveEntry(entry: DiaryEntry): void {
	const entries = getAllEntries();
	entries[entry.date] = entry;
	setItem(STORAGE_KEYS.entries, entries);
}

// ── Stamps ───────────────────────────────────────────────────────────────────

export function getStamps(): Stamp[] {
	const stamps = getItem<Stamp[] | null>(STORAGE_KEYS.stamps, null);
	if (stamps !== null) return stamps;
	// Seed defaults on first access
	const defaults: Stamp[] = DEFAULT_STAMPS.map((s) => ({
		...s,
		id: crypto.randomUUID(),
		createdAt: new Date().toISOString(),
	}));
	setItem(STORAGE_KEYS.stamps, defaults);
	return defaults;
}

export function saveStamps(stamps: Stamp[]): void {
	setItem(STORAGE_KEYS.stamps, stamps);
}

// ── API Key ──────────────────────────────────────────────────────────────────

export function getApiKey(): string {
	if (typeof window === "undefined") return "";
	return localStorage.getItem(STORAGE_KEYS.openrouterKey) ?? "";
}

export function saveApiKey(key: string): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(STORAGE_KEYS.openrouterKey, key);
}
