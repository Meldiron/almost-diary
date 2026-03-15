import { WEATHER_META, WEATHER_OPTIONS, type WeatherOption } from "#/lib/types";
import { cn } from "#/lib/utils";

interface WeatherTrackerProps {
	value?: WeatherOption;
	onChange: (value: WeatherOption | undefined) => void;
}

export function WeatherTracker({ value, onChange }: WeatherTrackerProps) {
	const visibleOptions = value ? [value] : WEATHER_OPTIONS;

	return (
		<div className="flex flex-wrap gap-3">
			{visibleOptions.map((option) => {
				const meta = WEATHER_META[option];
				const Icon = meta.icon;
				const isActive = value === option;

				return (
					<button
						key={option}
						type="button"
						onClick={() => onChange(isActive ? undefined : option)}
						className={cn(
							"flex items-center gap-2 rounded-lg border border-dashed px-4 py-2.5 transition-all",
							isActive
								? "border-[var(--accent)] bg-[var(--accent-bg)]"
								: "border-[var(--dash-color)] text-[var(--ink-soft)] hover:border-[var(--accent-soft)] hover:text-[var(--ink)]",
						)}
					>
						<Icon
							className={cn(
								"h-5 w-5",
								isActive ? "text-[var(--accent-vivid)]" : "",
							)}
						/>
						<span
							className={cn(
								"diary-title text-base font-medium",
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
