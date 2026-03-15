import type { LucideIcon } from "lucide-react";
import {
	Activity,
	Check,
	Circle,
	Cloud,
	Coins,
	Footprints,
	Heart,
	Moon,
	Notebook,
	Sparkles,
} from "lucide-react";
import { ActivityLog } from "#/components/diary/ActivityLog";
import { ConfigTracker } from "#/components/diary/ConfigTracker";
import { NotesInput } from "#/components/diary/NotesInput";
import { TrackerSection } from "#/components/diary/TrackerSection";
import { useDiaryEntry } from "#/hooks/useDiaryEntry";
import { useLocalStorage } from "#/hooks/useLocalStorage";
import { useStamps } from "#/hooks/useStamps";
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
	const { stamps, addStamp, updateStamp, removeStamp } = useStamps();
	const [apiKey] = useLocalStorage("diary-openrouter-key", "");
	const { optionsMap, config } = useTrackerConfig();
	const finished = !!entry.finished;

	function markComplete(e: React.MouseEvent) {
		updateEntry({ finished: true });
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

	function handleToggleStamp(stampId: string) {
		const current = entry.completedStamps ?? [];
		const updated = current.includes(stampId)
			? current.filter((id) => id !== stampId)
			: [...current, stampId];
		updateEntry({ completedStamps: updated });
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

			<div className="diary-divider mt-10 mb-10" />

			{finished ? (
				<>
					{/* ── Finished: compact grid ──────────────────────── */}
					<div className="grid grid-cols-2 gap-x-8 gap-y-6">
						{trackerCategories.map((cat) => {
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

					<div className="diary-divider mt-10 mb-10" />

					<TrackerSection
						title="Notes"
						icon={Notebook}
						finished
						noRecord={!entry.notes}
					>
						<p className="diary-title text-lg text-[var(--ink)]">
							{entry.notes}
						</p>
					</TrackerSection>

					<div className="diary-divider mt-10 mb-10" />

					<TrackerSection title="Activity Log" icon={Activity} finished>
						<ActivityLog
							stamps={stamps}
							completedStamps={entry.completedStamps ?? []}
							apiKey={apiKey}
							onToggleStamp={() => {}}
							onDeleteStamp={() => {}}
							onAddStamp={() => {}}
						/>
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
								{idx > 0 && <div className="diary-divider mt-14 mb-10" />}
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

					<div className="diary-divider mt-14 mb-10" />

					<TrackerSection title="Notes" icon={Notebook}>
						<NotesInput
							value={entry.notes}
							onChange={(v) => updateEntry({ notes: v })}
						/>
					</TrackerSection>

					<div className="diary-divider mt-14 mb-10" />

					<TrackerSection title="Activity Log" icon={Activity}>
						<ActivityLog
							stamps={stamps}
							completedStamps={entry.completedStamps ?? []}
							apiKey={apiKey}
							onToggleStamp={handleToggleStamp}
							onDeleteStamp={removeStamp}
							onAddStamp={addStamp}
							onUpdateStamp={updateStamp}
						/>
					</TrackerSection>

					<div className="diary-divider mt-14 mb-10" />

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
