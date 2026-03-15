import { useCallback } from "react";
import type { Habit } from "#/lib/types";
import { useLocalStorage } from "./useLocalStorage";

export function useHabits() {
	const [habits, setHabits] = useLocalStorage<Habit[]>("diary-habits", []);

	const addHabit = useCallback(
		(name: string, color: string) => {
			const habit: Habit = {
				id: crypto.randomUUID(),
				name,
				color,
			};
			setHabits((prev) => [...prev, habit]);
		},
		[setHabits],
	);

	const updateHabit = useCallback(
		(id: string, name: string, color: string) => {
			setHabits((prev) =>
				prev.map((h) => (h.id === id ? { ...h, name, color } : h)),
			);
		},
		[setHabits],
	);

	const removeHabit = useCallback(
		(id: string) => {
			setHabits((prev) => prev.filter((h) => h.id !== id));
		},
		[setHabits],
	);

	return { habits, addHabit, updateHabit, removeHabit };
}
