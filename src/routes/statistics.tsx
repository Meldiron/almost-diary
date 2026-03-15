import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useLocalStorage } from "#/hooks/useLocalStorage";
import { useTrackerConfig } from "#/hooks/useTrackerConfig";
import { normalizeTrackerValue, type DiaryEntry } from "#/lib/types";
import { cn } from "#/lib/utils";

export const Route = createFileRoute("/statistics")({
	component: Statistics,
});

const MONTH_LABELS = [
	"J",
	"F",
	"M",
	"A",
	"M",
	"J",
	"J",
	"A",
	"S",
	"O",
	"N",
	"D",
];

const CATEGORY_FIELD: Record<string, string> = {
	weather: "weather",
	mood: "mood",
	money: "money",
	steps: "steps",
	sleep: "sleep",
	selfCare: "selfCare",
};

function getDaysInMonth(year: number, month: number): number {
	return new Date(year, month + 1, 0).getDate();
}

function pad(n: number): string {
	return n < 10 ? `0${n}` : `${n}`;
}

function Statistics() {
	const [entries] = useLocalStorage<Record<string, DiaryEntry>>(
		"diary-entries",
		{},
	);
	const { config, optionsMap } = useTrackerConfig();
	const [selectedCat, setSelectedCat] = useState(
		config.categories[0]?.id ?? "weather",
	);

	const year = new Date().getFullYear();

	// Build grid data: 12 months × up to 31 days
	// Each cell stores { id, label, color } or undefined
	const grid = useMemo(() => {
		const field = CATEGORY_FIELD[selectedCat];
		if (!field) return [];
		const map = optionsMap[selectedCat];

		const months: ({ id: string; label: string; color: string } | undefined)[][] = [];
		for (let m = 0; m < 12; m++) {
			const daysInMonth = getDaysInMonth(year, m);
			const column: ({ id: string; label: string; color: string } | undefined)[] = [];
			for (let d = 1; d <= 31; d++) {
				if (d > daysInMonth) {
					column.push(undefined);
				} else {
					const key = `${year}-${pad(m + 1)}-${pad(d)}`;
					const entry = entries[key];
					const raw = entry
						? (entry as unknown as Record<string, unknown>)[field]
						: undefined;
					column.push(
						normalizeTrackerValue(raw, map?.labels, map?.colors) ?? undefined,
					);
				}
			}
			months.push(column);
		}
		return months;
	}, [entries, selectedCat, year, optionsMap]);

	const legendColors = optionsMap[selectedCat]?.colors ?? {};
	const legendLabels = optionsMap[selectedCat]?.labels ?? {};
	const options = optionsMap[selectedCat]?.options ?? [];
	return (
		<main className="diary-page min-h-screen px-4 py-8">
			<div className="mx-auto max-w-3xl">
				<h1 className="diary-title mb-6 text-center text-4xl font-bold text-[var(--ink)]">
					{year} in Pixels
				</h1>

				{/* Category selector */}
				<div className="mb-8 flex flex-wrap justify-center gap-2">
					{config.categories.map((cat) => (
						<button
							key={cat.id}
							type="button"
							onClick={() => setSelectedCat(cat.id)}
							className={cn(
								"diary-title rounded-full border border-dashed px-4 py-1.5 text-base font-semibold transition",
								selectedCat === cat.id
									? "border-[var(--accent)] bg-[var(--accent-bg-solid)] text-[var(--accent)]"
									: "border-[var(--dash-color)] bg-[var(--paper)] text-[var(--ink-soft)] hover:border-[var(--accent-soft)] hover:text-[var(--ink)]",
							)}
						>
							{cat.title}
						</button>
					))}
				</div>

				{/* Pixel grid */}
				<div className="overflow-x-auto">
					<div className="mx-auto w-fit">
						{/* Month headers */}
						<div className="flex">
							<div className="w-8 shrink-0" />
							{MONTH_LABELS.map((label, i) => (
								<div
									key={i}
									className="diary-title w-7 shrink-0 text-center text-sm font-semibold text-[var(--ink-soft)]"
								>
									{label}
								</div>
							))}
						</div>

						{/* Day rows */}
						{Array.from({ length: 31 }, (_, dayIdx) => (
							<div key={dayIdx} className="flex">
								{/* Day number */}
								<div className="diary-title flex w-8 shrink-0 items-center justify-end pr-2 text-sm text-[var(--ink-faint)]">
									{dayIdx + 1}
								</div>
								{/* Month cells */}
								{grid.map((month, mIdx) => {
									const tv = month[dayIdx];
									const isOutOfRange = dayIdx >= getDaysInMonth(year, mIdx);

									return (
										<div
											key={mIdx}
											className="h-7 w-7 shrink-0 p-[2px]"
										>
											{isOutOfRange ? (
												<div className="h-full w-full" />
											) : (
												<div
													className={cn(
														"h-full w-full rounded-[3px] border transition",
														tv
															? "border-transparent"
															: "border-[var(--dash-color)] bg-[var(--paper)]",
													)}
													style={
														tv
															? { backgroundColor: tv.color }
															: undefined
													}
													title={
														tv
															? `${dayIdx + 1}/${mIdx + 1}: ${tv.label}`
															: `${dayIdx + 1}/${mIdx + 1}: No data`
													}
												/>
											)}
										</div>
									);
								})}
							</div>
						))}
					</div>
				</div>

				{/* Legend */}
				<div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2">
					{options.map((opt) => (
						<div key={opt} className="flex items-center gap-1.5">
							<span
								className="inline-block h-3.5 w-3.5 rounded-[3px]"
								style={{ backgroundColor: legendColors[opt] }}
							/>
							<span className="diary-title text-sm text-[var(--ink-soft)]">
								{legendLabels[opt] ?? opt}
							</span>
						</div>
					))}
					<div className="flex items-center gap-1.5">
						<span className="inline-block h-3.5 w-3.5 rounded-[3px] border border-[var(--dash-color)] bg-[var(--paper)]" />
						<span className="diary-title text-sm text-[var(--ink-faint)]">
							No data
						</span>
					</div>
				</div>
			</div>
		</main>
	);
}
