import type { DiaryEntry, Habit } from "./types";

export const STORAGE_KEYS = {
	entries: "diary-entries",
	habits: "diary-habits",
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

// ── Habits ───────────────────────────────────────────────────────────────────

export function getHabits(): Habit[] {
	return getItem<Habit[]>(STORAGE_KEYS.habits, []);
}

export function saveHabits(habits: Habit[]): void {
	setItem(STORAGE_KEYS.habits, habits);
}
