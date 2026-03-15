import type { MouseEvent } from "react";
import { moodEffects } from "#/lib/effects";
import { moodSounds } from "#/lib/sounds";
import { MOOD_META, MOOD_OPTIONS, type MoodOption } from "#/lib/types";
import { cn } from "#/lib/utils";

interface MoodTrackerProps {
	value?: MoodOption;
	onChange: (value: MoodOption | undefined) => void;
}

export function MoodTracker({ value, onChange }: MoodTrackerProps) {
	const visibleOptions = value ? [value] : MOOD_OPTIONS;

	function handleClick(e: MouseEvent, option: MoodOption, isActive: boolean) {
		if (!isActive) {
			const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
			moodEffects[option]?.(rect);
			moodSounds[option]?.();
		}
		onChange(isActive ? undefined : option);
	}

	return (
		<div className="flex flex-wrap gap-3">
			{visibleOptions.map((option) => {
				const meta = MOOD_META[option];
				const isActive = value === option;

				return (
					<button
						key={option}
						type="button"
						onClick={(e) => handleClick(e, option, isActive)}
						className={cn(
							"flex items-center gap-2 rounded-full border border-dashed px-4 py-1.5 transition-all",
							isActive
								? "border-[var(--accent)] bg-[var(--accent-bg-solid)]"
								: "border-[var(--dash-color)] bg-[var(--paper)] text-[var(--ink-soft)] hover:border-[var(--accent-soft)] hover:text-[var(--ink)]",
						)}
					>
						<span
							className="inline-block h-4 w-4 rounded-sm"
							style={{ backgroundColor: meta.color }}
						/>
						<span className="diary-title text-base font-medium">
							{meta.label}
						</span>
					</button>
				);
			})}
		</div>
	);
}
