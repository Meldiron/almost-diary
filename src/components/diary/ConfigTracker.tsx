import type { MouseEvent } from "react";
import { effectSelect } from "#/lib/effects";
import { playSelect } from "#/lib/sounds";
import { cn } from "#/lib/utils";

interface ConfigTrackerProps {
	options: string[];
	labels: Record<string, string>;
	colors: Record<string, string>;
	value?: string;
	onChange: (value: string | undefined) => void;
	effects?: Record<string, (r: DOMRect) => void>;
	sounds?: Record<string, () => void>;
	disabled?: boolean;
}

export function ConfigTracker({
	options,
	labels,
	colors,
	value,
	onChange,
	effects,
	sounds,
	disabled,
}: ConfigTrackerProps) {
	const visibleOptions = value ? [value] : options;

	function handleClick(e: MouseEvent, option: string, isActive: boolean) {
		if (disabled) return;
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
		<div className={cn("flex flex-wrap gap-3", disabled && "opacity-50 pointer-events-none")}>
			{visibleOptions.map((option) => {
				const isActive = value === option;
				const color = colors[option];

				return (
					<button
						key={option}
						type="button"
						onClick={(e) => handleClick(e, option, isActive)}
						disabled={disabled}
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
						{labels[option] ?? option}
					</button>
				);
			})}
		</div>
	);
}
