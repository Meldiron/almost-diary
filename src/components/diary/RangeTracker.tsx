import { cn } from "#/lib/utils";

interface RangeTrackerProps<T extends string> {
	options: readonly T[];
	labels: Record<T, string>;
	value?: T;
	onChange: (value: T | undefined) => void;
}

export function RangeTracker<T extends string>({
	options,
	labels,
	value,
	onChange,
}: RangeTrackerProps<T>) {
	const visibleOptions = value ? [value] : options;

	return (
		<div className="flex flex-wrap gap-3">
			{visibleOptions.map((option) => {
				const isActive = value === option;

				return (
					<button
						key={option}
						type="button"
						onClick={() => onChange(isActive ? undefined : option)}
						className={cn(
							"diary-title rounded-full border border-dashed px-4 py-1.5 text-base font-semibold transition-all",
							isActive
								? "border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent)]"
								: "border-[var(--dash-color)] text-[var(--ink-soft)] hover:border-[var(--accent-soft)] hover:text-[var(--ink)]",
						)}
					>
						{labels[option]}
					</button>
				);
			})}
		</div>
	);
}
