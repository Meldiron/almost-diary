import type { MouseEvent } from "react";
import { effectSelect } from "#/lib/effects";
import { playSelect } from "#/lib/sounds";
import { cn } from "#/lib/utils";

interface RangeTrackerProps<T extends string> {
	options: readonly T[];
	labels: Record<T, string>;
	value?: T;
	onChange: (value: T | undefined) => void;
	effects?: Record<string, (r: DOMRect) => void>;
	sounds?: Record<string, () => void>;
	colors?: Record<T, string>;
}

export function RangeTracker<T extends string>({
	options,
	labels,
	value,
	onChange,
	effects,
	sounds,
	colors,
}: RangeTrackerProps<T>) {
	const visibleOptions = value ? [value] : options;

	function handleClick(e: MouseEvent, option: T, isActive: boolean) {
		if (!isActive) {
			const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
			if (effects?.[option]) {
				effects[option](rect);
			} else {
				effectSelect(rect);
			}
			if (sounds?.[option]) {
				sounds[option]();
			} else {
				playSelect();
			}
		}
		onChange(isActive ? undefined : option);
	}

	return (
		<div className="flex flex-wrap gap-3">
			{visibleOptions.map((option) => {
				const isActive = value === option;
				const color = colors?.[option];

				return (
					<button
						key={option}
						type="button"
						onClick={(e) => handleClick(e, option, isActive)}
						className={cn(
							"diary-title flex items-center gap-2 rounded-full border border-dashed px-4 py-1.5 text-base font-semibold transition-all",
							isActive
								? "border-[var(--accent)] bg-[var(--accent-bg-solid)] text-[var(--accent)]"
								: "border-[var(--dash-color)] bg-[var(--paper)] text-[var(--ink-soft)] hover:border-[var(--accent-soft)] hover:text-[var(--ink)]",
						)}
					>
						{color && (
							<span
								className="inline-block h-3.5 w-3.5 rounded-sm"
								style={{ backgroundColor: color }}
							/>
						)}
						{labels[option]}
					</button>
				);
			})}
		</div>
	);
}
