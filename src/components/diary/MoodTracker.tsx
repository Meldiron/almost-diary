import { MOOD_META, MOOD_OPTIONS, type MoodOption } from "#/lib/types";
import { cn } from "#/lib/utils";

interface MoodTrackerProps {
	value?: MoodOption;
	onChange: (value: MoodOption | undefined) => void;
}

export function MoodTracker({ value, onChange }: MoodTrackerProps) {
	const visibleOptions = value ? [value] : MOOD_OPTIONS;

	return (
		<div className="flex flex-wrap gap-2">
			{visibleOptions.map((option) => {
				const meta = MOOD_META[option];
				const Icon = meta.icon;
				const isActive = value === option;

				return (
					<button
						key={option}
						type="button"
						onClick={() => onChange(isActive ? undefined : option)}
						className={cn(
							"flex items-center gap-1.5 rounded-lg border border-dashed px-3 py-2 transition-all",
							isActive
								? "border-[var(--accent)] bg-[var(--accent-bg)]"
								: "border-[var(--dash-color)] text-[var(--ink-soft)] hover:border-[var(--accent-soft)] hover:text-[var(--ink)]",
						)}
					>
						<Icon
							className={cn(
								"h-4 w-4",
								isActive ? "text-[var(--accent-vivid)]" : "",
							)}
						/>
						<span
							className={cn(
								"diary-title text-sm font-medium",
								isActive ? "text-[var(--accent-vivid)]" : "",
							)}
						>
							{meta.label}
						</span>
					</button>
				);
			})}
		</div>
	);
}
