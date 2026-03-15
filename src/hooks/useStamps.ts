import { useCallback } from "react";
import type { Stamp } from "#/lib/types";
import { useLocalStorage } from "./useLocalStorage";

export function useStamps() {
	const [stamps, setStamps] = useLocalStorage<Stamp[]>("diary-stamps", []);

	const addStamp = useCallback(
		(description: string, imageUrl?: string) => {
			const stamp: Stamp = {
				id: crypto.randomUUID(),
				description,
				imageUrl,
				createdAt: new Date().toISOString(),
			};
			setStamps((prev) => [...prev, stamp]);
			return stamp;
		},
		[setStamps],
	);

	const updateStamp = useCallback(
		(id: string, description: string, imageUrl?: string) => {
			setStamps((prev) =>
				prev.map((s) => (s.id === id ? { ...s, description, imageUrl } : s)),
			);
		},
		[setStamps],
	);

	const removeStamp = useCallback(
		(id: string) => {
			setStamps((prev) => prev.filter((s) => s.id !== id));
		},
		[setStamps],
	);

	return { stamps, addStamp, updateStamp, removeStamp };
}
