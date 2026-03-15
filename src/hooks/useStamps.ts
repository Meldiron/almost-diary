import { useCallback, useEffect } from "react";
import type { Stamp } from "#/lib/types";
import { DEFAULT_STAMPS } from "#/lib/types";
import { useLocalStorage } from "./useLocalStorage";

export function useStamps() {
	const [stamps, setStamps] = useLocalStorage<Stamp[]>("diary-stamps", []);

	// Seed defaults on first mount if empty
	useEffect(() => {
		if (stamps.length === 0) {
			const defaults: Stamp[] = DEFAULT_STAMPS.map((s) => ({
				...s,
				id: crypto.randomUUID(),
				createdAt: new Date().toISOString(),
			}));
			setStamps(defaults);
		}
	}, [stamps.length, setStamps]);

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

	const removeStamp = useCallback(
		(id: string) => {
			setStamps((prev) => prev.filter((s) => s.id !== id));
		},
		[setStamps],
	);

	return { stamps, addStamp, removeStamp };
}
