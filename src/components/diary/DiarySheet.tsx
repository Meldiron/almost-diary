import type { LucideIcon } from "lucide-react";
import {
	Check,
	Circle,
	Cloud,
	Coins,
	Footprints,
	Heart,
	ListChecks,
	Moon,
	Notebook,
	Sparkles,
} from "lucide-react";
import { ConfigTracker } from "#/components/diary/ConfigTracker";
import { HabitList } from "#/components/diary/HabitList";
import { NotesInput } from "#/components/diary/NotesInput";
import { TrackerSection } from "#/components/diary/TrackerSection";
import { useDiaryEntry } from "#/hooks/useDiaryEntry";
import { useHabits } from "#/hooks/useHabits";
import { useTrackerConfig } from "#/hooks/useTrackerConfig";
import {
	effectConfetti,
	moneyEffects,
	moodEffects,
	selfCareEffects,
	sleepEffects,
	stepsEffects,
	weatherEffects,
} from "#/lib/effects";
import {
	moneySounds,
	moodSounds,
	playConfetti,
	selfCareSounds,
	sleepSounds,
	stepsSounds,
	weatherSounds,
} from "#/lib/sounds";
import type {
	DaySnapshot,
	HabitSnapshot,
	TrackerSnapshot,
} from "#/lib/types";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
	weather: Cloud,
	mood: Heart,
	money: Coins,
	steps: Footprints,
	sleep: Moon,
	selfCare: Sparkles,
};

const CATEGORY_EFFECTS: Record<string, Record<string, (r: DOMRect) => void>> = {
	weather: weatherEffects,
	mood: moodEffects,
	money: moneyEffects,
	steps: stepsEffects,
	sleep: sleepEffects,
	selfCare: selfCareEffects,
};

const CATEGORY_SOUNDS: Record<string, Record<string, () => void>> = {
	weather: weatherSounds,
	mood: moodSounds,
	money: moneySounds,
	steps: stepsSounds,
	sleep: sleepSounds,
	selfCare: selfCareSounds,
};

// Map category IDs to diary entry field names
const CATEGORY_FIELD: Record<string, string> = {
	weather: "weather",
	mood: "mood",
	money: "money",
	steps: "steps",
	sleep: "sleep",
	selfCare: "selfCare",
};

function formatDisplayDate(dateStr: string): string {
	const d = new Date(`${dateStr}T00:00:00`);
	return d.toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

interface DiarySheetProps {
	date: string;
	isCenter?: boolean;
}

export function DiarySheet({ date, isCenter }: DiarySheetProps) {
	const { entry, updateEntry } = useDiaryEntry(date);
	const { habits, addHabit, updateHabit, removeHabit } = useHabits();
	const { optionsMap, config } = useTrackerConfig();
	const finished = !!entry.finished;

	function buildSnapshot(): DaySnapshot {
		const trackers: TrackerSnapshot[] = [];
		for (const cat of config.categories) {
			const field = CATEGORY_FIELD[cat.id];
			if (!field) continue;
			const value = (entry as Record<string, unknown>)[field] as
				| string
				| undefined;
			if (!value) continue;
			const opt = cat.options.find((o) => o.id === value);
			if (!opt) continue;
			trackers.push({
				categoryId: cat.id,
				title: cat.title,
				value: opt.id,
				label: opt.label,
				color: opt.color,
			});
		}

		const completedIds = entry.completedHabits ?? [];
		const habitSnapshots: HabitSnapshot[] = [];
		for (const id of completedIds) {
			const habit = habits.find((h) => h.id === id);
			if (habit) {
				habitSnapshots.push({ name: habit.name, color: habit.color });
			}
		}

		return {
			trackers,
			habits: habitSnapshots,
			notes: entry.notes,
		};
	}

	function markComplete(e: React.MouseEvent) {
		const snapshot = buildSnapshot();
		updateEntry({ finished: true, snapshot });
		effectConfetti();
		playConfetti();
		const sheet = (e.currentTarget as HTMLElement).closest(".diary-sheet");
		sheet?.scrollIntoView({ behavior: "smooth", block: "start" });
	}

	function toggleFinished() {
		if (finished) {
			updateEntry({ finished: false });
		} else {
			markComplete();
		}
	}

	function handleToggleHabit(habitId: string) {
		const current = entry.completedHabits ?? [];
		const updated = current.includes(habitId)
			? current.filter((id) => id !== habitId)
			: [...current, habitId];
		updateEntry({ completedHabits: updated });
	}

	function getEntryValue(categoryId: string): string | undefined {
		const field = CATEGORY_FIELD[categoryId];
		if (!field) return undefined;
		return (entry as Record<string, unknown>)[field] as string | undefined;
	}

	function setEntryValue(categoryId: string, value: string | undefined) {
		const field = CATEGORY_FIELD[categoryId];
		if (!field) return;
		updateEntry({ [field]: value });
	}

	const trackerCategories = config.categories;
	const snapshot = entry.snapshot;

	return (
		<div
			className={`diary-sheet flex-shrink-0 rounded-sm p-8 pl-16 sm:p-10 sm:pl-20 transition-opacity duration-300 ${
				isCenter ? "opacity-100" : "opacity-40"
			}`}
			style={{ width: "min(820px, 90vw)" }}
		>
			{/* ── Date header ─────────────────────────────────────────── */}
			<div className="mb-5 flex items-center justify-center gap-3">
				<h2 className="diary-title text-3xl font-bold text-[var(--ink)]">
					{formatDisplayDate(date)}
				</h2>
				<button
					type="button"
					onClick={toggleFinished}
					className="rounded-full p-1 transition hover:bg-[var(--accent-bg)]"
					aria-label={finished ? "Mark as unfinished" : "Mark as finished"}
				>
					{finished ? (
						<Check className="h-6 w-6 text-[var(--accent-vivid)]" />
					) : (
						<Circle className="h-6 w-6 text-[var(--ink-faint)]" />
					)}
				</button>
			</div>

			<div className="diary-divider mt-6 mb-6" />

			{finished ? (
				<>
					{/* ── Finished: render from snapshot ──────────────────── */}
					<div className="grid grid-cols-2 gap-x-8 gap-y-6">
						{snapshot
							? snapshot.trackers.map((t) => (
									<TrackerSection
										key={t.categoryId}
										title={t.title}
										icon={CATEGORY_ICONS[t.categoryId]}
										finished
									>
										<ConfigTracker
											options={[t.value]}
											labels={{ [t.value]: t.label }}
											colors={{ [t.value]: t.color }}
											value={t.value}
											onChange={() => {}}
										/>
									</TrackerSection>
								))
							: // Fallback for entries finished before snapshot existed
								trackerCategories.map((cat) => {
									const val = getEntryValue(cat.id);
									const map = optionsMap[cat.id];
									return (
										<TrackerSection
											key={cat.id}
											title={cat.title}
											icon={CATEGORY_ICONS[cat.id]}
											finished
											noRecord={!val}
										>
											<ConfigTracker
												options={map.options}
												labels={map.labels}
												colors={map.colors}
												value={val}
												onChange={() => {}}
											/>
										</TrackerSection>
									);
								})}
					</div>

					<div className="diary-divider mt-6 mb-6" />

					<TrackerSection title="Habits" icon={ListChecks} finished>
						<HabitList
							habits={habits}
							completedHabits={entry.completedHabits ?? []}
							onToggle={() => {}}
							onAdd={() => {}}
							onUpdate={() => {}}
							onDelete={() => {}}
							readOnly
							snapshot={snapshot?.habits}
						/>
					</TrackerSection>

					<div className="diary-divider mt-6 mb-6" />

					<TrackerSection
						title="Notes"
						icon={Notebook}
						finished
						noRecord={!(snapshot?.notes ?? entry.notes)}
					>
						<p className="diary-title text-lg text-[var(--ink)]">
							{snapshot?.notes ?? entry.notes}
						</p>
					</TrackerSection>
				</>
			) : (
				<>
					{/* ── Editing: vertical list ─────────────────────── */}
					{trackerCategories.map((cat, idx) => {
						const val = getEntryValue(cat.id);
						const map = optionsMap[cat.id];
						return (
							<div key={cat.id}>
								{idx > 0 && <div className="diary-divider mt-8 mb-6" />}
								<TrackerSection
									title={cat.title}
									icon={CATEGORY_ICONS[cat.id]}
									hasValue={!!val}
									onReset={() => setEntryValue(cat.id, undefined)}
								>
									<ConfigTracker
										options={map.options}
										labels={map.labels}
										colors={map.colors}
										value={val}
										onChange={(v) => setEntryValue(cat.id, v)}
										effects={CATEGORY_EFFECTS[cat.id]}
										sounds={CATEGORY_SOUNDS[cat.id]}
									/>
								</TrackerSection>
							</div>
						);
					})}

					<div className="diary-divider mt-8 mb-6" />

					<TrackerSection title="Habits" icon={ListChecks}>
						<HabitList
							habits={habits}
							completedHabits={entry.completedHabits ?? []}
							onToggle={handleToggleHabit}
							onAdd={addHabit}
							onUpdate={updateHabit}
							onDelete={removeHabit}
						/>
					</TrackerSection>

					<div className="diary-divider mt-8 mb-6" />

					<TrackerSection title="Notes" icon={Notebook}>
						<NotesInput
							value={entry.notes}
							onChange={(v) => updateEntry({ notes: v })}
						/>
					</TrackerSection>

					<div className="diary-divider mt-8 mb-6" />

					<button
						type="button"
						onClick={markComplete}
						className="group flex w-full items-center gap-4 rounded-lg border border-[var(--dash-color)] bg-[var(--paper)] px-5 py-4 transition hover:border-[var(--accent-soft)] hover:bg-[var(--accent-bg-solid)]"
					>
						<span className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-[var(--dash-color)] transition group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white">
							<Check className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
						</span>
						<span className="diary-title text-lg text-[var(--ink-soft)] transition group-hover:text-[var(--ink)]">
							Mark day as complete
						</span>
					</button>
				</>
			)}
		</div>
	);
}
