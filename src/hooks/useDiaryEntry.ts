import { useCallback } from "react";
import type { DiaryEntry } from "#/lib/types";
import { useLocalStorage } from "./useLocalStorage";

export function useDiaryEntry(date: string) {
	const [entries, setEntries] = useLocalStorage<Record<string, DiaryEntry>>(
		"diary-entries",
		{},
	);

	const entry: DiaryEntry = entries[date] ?? { date };

	const updateEntry = useCallback(
		(partial: Partial<DiaryEntry>) => {
			setEntries((prev) => ({
				...prev,
				[date]: { ...prev[date], date, ...partial },
			}));
		},
		[date, setEntries],
	);

	return { entry, updateEntry };
}
