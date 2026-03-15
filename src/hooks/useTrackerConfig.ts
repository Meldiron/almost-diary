import { useCallback, useMemo } from "react";
import {
	DEFAULT_CONFIG,
	type TrackerCategory,
	type TrackerConfig,
} from "#/lib/tracker-config";
import { useLocalStorage } from "./useLocalStorage";

export function useTrackerConfig() {
	const [config, setConfig] = useLocalStorage<TrackerConfig>(
		"diary-tracker-config",
		DEFAULT_CONFIG,
	);

	const getCategory = useCallback(
		(id: string): TrackerCategory => {
			return (
				config.categories.find((c) => c.id === id) ??
				DEFAULT_CONFIG.categories.find((c) => c.id === id)!
			);
		},
		[config],
	);

	const updateCategory = useCallback(
		(categoryId: string, updated: TrackerCategory) => {
			setConfig((prev) => ({
				...prev,
				categories: prev.categories.map((c) =>
					c.id === categoryId ? updated : c,
				),
			}));
		},
		[setConfig],
	);

	const resetToDefaults = useCallback(() => {
		setConfig(DEFAULT_CONFIG);
	}, [setConfig]);

	// Build lookup maps for each category
	const optionsMap = useMemo(() => {
		const map: Record<
			string,
			{
				options: string[];
				labels: Record<string, string>;
				colors: Record<string, string>;
			}
		> = {};
		for (const cat of config.categories) {
			map[cat.id] = {
				options: cat.options.map((o) => o.id),
				labels: Object.fromEntries(cat.options.map((o) => [o.id, o.label])),
				colors: Object.fromEntries(cat.options.map((o) => [o.id, o.color])),
			};
		}
		return map;
	}, [config]);

	return { config, getCategory, updateCategory, resetToDefaults, optionsMap };
}
