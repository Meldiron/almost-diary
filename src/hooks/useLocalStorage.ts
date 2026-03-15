import { useCallback, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
	window.addEventListener("storage", callback);
	return () => window.removeEventListener("storage", callback);
}

export function useLocalStorage<T>(
	key: string,
	initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
	const getSnapshot = useCallback(() => {
		try {
			return localStorage.getItem(key);
		} catch {
			return null;
		}
	}, [key]);

	const getServerSnapshot = useCallback(() => null, []);

	const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

	const value: T = raw !== null ? (JSON.parse(raw) as T) : initialValue;

	const setValue = useCallback(
		(newValue: T | ((prev: T) => T)) => {
			const current = (() => {
				try {
					const r = localStorage.getItem(key);
					return r !== null ? (JSON.parse(r) as T) : initialValue;
				} catch {
					return initialValue;
				}
			})();
			const resolved =
				typeof newValue === "function"
					? (newValue as (prev: T) => T)(current)
					: newValue;
			localStorage.setItem(key, JSON.stringify(resolved));
			window.dispatchEvent(new StorageEvent("storage", { key }));
		},
		[key, initialValue],
	);

	return [value, setValue];
}
