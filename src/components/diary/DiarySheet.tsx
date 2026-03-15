import {
	Activity,
	CheckCircle2,
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
import { MoodTracker } from "#/components/diary/MoodTracker";
import { NotesInput } from "#/components/diary/NotesInput";
import { RangeTracker } from "#/components/diary/RangeTracker";
import { TrackerSection } from "#/components/diary/TrackerSection";
import { WeatherTracker } from "#/components/diary/WeatherTracker";
import { useDiaryEntry } from "#/hooks/useDiaryEntry";
import { useLocalStorage } from "#/hooks/useLocalStorage";
import { useStamps } from "#/hooks/useStamps";
import {
	effectConfetti,
	moneyEffects,
	selfCareEffects,
	sleepEffects,
	stepsEffects,
} from "#/lib/effects";
import {
	moneySounds,
	playConfetti,
	selfCareSounds,
	sleepSounds,
	stepsSounds,
} from "#/lib/sounds";
import {
	MONEY_COLORS,
	MONEY_LABELS,
	MONEY_OPTIONS,
	SELFCARE_COLORS,
	SELFCARE_LABELS,
	SELFCARE_OPTIONS,
	SLEEP_COLORS,
	SLEEP_LABELS,
	SLEEP_OPTIONS,
	STEPS_COLORS,
	STEPS_LABELS,
	STEPS_OPTIONS,
} from "#/lib/types";

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
	const { stamps, addStamp, removeStamp } = useStamps();
	const [apiKey] = useLocalStorage("diary-openrouter-key", "");
	const finished = !!entry.finished;

	function markComplete() {
		updateEntry({ finished: true });
		effectConfetti();
		playConfetti();
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
						<CheckCircle2 className="h-6 w-6 text-[var(--accent-vivid)]" />
					) : (
						<Circle className="h-6 w-6 text-[var(--ink-faint)]" />
					)}
				</button>
			</div>

			<hr className="diary-divider mt-5 mb-6" />

			{finished ? (
				<>
					{/* ── Finished: compact grid ──────────────────────── */}
					<div className="grid grid-cols-2 gap-x-8 gap-y-6">
						<TrackerSection
							title="Weather"
							icon={Cloud}
							finished
							noRecord={!entry.weather}
						>
							<WeatherTracker value={entry.weather} onChange={() => {}} />
						</TrackerSection>

						<TrackerSection
							title="Mood"
							icon={Heart}
							finished
							noRecord={!entry.mood}
						>
							<MoodTracker value={entry.mood} onChange={() => {}} />
						</TrackerSection>

						<TrackerSection
							title="Money Spent"
							icon={Coins}
							finished
							noRecord={!entry.money}
						>
							<RangeTracker
								options={MONEY_OPTIONS}
								labels={MONEY_LABELS}
								colors={MONEY_COLORS}
								value={entry.money}
								onChange={() => {}}
							/>
						</TrackerSection>

						<TrackerSection
							title="Steps"
							icon={Footprints}
							finished
							noRecord={!entry.steps}
						>
							<RangeTracker
								options={STEPS_OPTIONS}
								labels={STEPS_LABELS}
								colors={STEPS_COLORS}
								value={entry.steps}
								onChange={() => {}}
							/>
						</TrackerSection>

						<TrackerSection
							title="Sleep"
							icon={Moon}
							finished
							noRecord={!entry.sleep}
						>
							<RangeTracker
								options={SLEEP_OPTIONS}
								labels={SLEEP_LABELS}
								colors={SLEEP_COLORS}
								value={entry.sleep}
								onChange={() => {}}
							/>
						</TrackerSection>

						<TrackerSection
							title="Self-Care"
							icon={Sparkles}
							finished
							noRecord={!entry.selfCare}
						>
							<RangeTracker
								options={SELFCARE_OPTIONS}
								labels={SELFCARE_LABELS}
								colors={SELFCARE_COLORS}
								value={entry.selfCare}
								onChange={() => {}}
							/>
						</TrackerSection>
					</div>

					<hr className="diary-divider mt-7 mb-6" />

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

					<hr className="diary-divider mt-7 mb-6" />

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
					<TrackerSection
						title="Weather"
						icon={Cloud}
						hasValue={!!entry.weather}
						onReset={() => updateEntry({ weather: undefined })}
					>
						<WeatherTracker
							value={entry.weather}
							onChange={(v) => updateEntry({ weather: v })}
						/>
					</TrackerSection>

					<hr className="diary-divider mt-7 mb-6" />

					<TrackerSection
						title="Mood"
						icon={Heart}
						hasValue={!!entry.mood}
						onReset={() => updateEntry({ mood: undefined })}
					>
						<MoodTracker
							value={entry.mood}
							onChange={(v) => updateEntry({ mood: v })}
						/>
					</TrackerSection>

					<hr className="diary-divider mt-7 mb-6" />

					<TrackerSection
						title="Money Spent"
						icon={Coins}
						hasValue={!!entry.money}
						onReset={() => updateEntry({ money: undefined })}
					>
						<RangeTracker
							options={MONEY_OPTIONS}
							labels={MONEY_LABELS}
							colors={MONEY_COLORS}
							value={entry.money}
							onChange={(v) => updateEntry({ money: v })}
							effects={moneyEffects}
							sounds={moneySounds}
						/>
					</TrackerSection>

					<hr className="diary-divider mt-7 mb-6" />

					<TrackerSection
						title="Steps"
						icon={Footprints}
						hasValue={!!entry.steps}
						onReset={() => updateEntry({ steps: undefined })}
					>
						<RangeTracker
							options={STEPS_OPTIONS}
							labels={STEPS_LABELS}
							colors={STEPS_COLORS}
							value={entry.steps}
							onChange={(v) => updateEntry({ steps: v })}
							effects={stepsEffects}
							sounds={stepsSounds}
						/>
					</TrackerSection>

					<hr className="diary-divider mt-7 mb-6" />

					<TrackerSection
						title="Sleep"
						icon={Moon}
						hasValue={!!entry.sleep}
						onReset={() => updateEntry({ sleep: undefined })}
					>
						<RangeTracker
							options={SLEEP_OPTIONS}
							labels={SLEEP_LABELS}
							colors={SLEEP_COLORS}
							value={entry.sleep}
							onChange={(v) => updateEntry({ sleep: v })}
							effects={sleepEffects}
							sounds={sleepSounds}
						/>
					</TrackerSection>

					<hr className="diary-divider mt-7 mb-6" />

					<TrackerSection
						title="Self-Care"
						icon={Sparkles}
						hasValue={!!entry.selfCare}
						onReset={() => updateEntry({ selfCare: undefined })}
					>
						<RangeTracker
							options={SELFCARE_OPTIONS}
							labels={SELFCARE_LABELS}
							colors={SELFCARE_COLORS}
							value={entry.selfCare}
							onChange={(v) => updateEntry({ selfCare: v })}
							effects={selfCareEffects}
							sounds={selfCareSounds}
						/>
					</TrackerSection>

					<hr className="diary-divider mt-7 mb-6" />

					<TrackerSection title="Notes" icon={Notebook}>
						<NotesInput
							value={entry.notes}
							onChange={(v) => updateEntry({ notes: v })}
						/>
					</TrackerSection>

					<hr className="diary-divider mt-7 mb-6" />

					<TrackerSection title="Activity Log" icon={Activity}>
						<ActivityLog
							stamps={stamps}
							completedStamps={entry.completedStamps ?? []}
							apiKey={apiKey}
							onToggleStamp={handleToggleStamp}
							onDeleteStamp={removeStamp}
							onAddStamp={addStamp}
						/>
					</TrackerSection>

					<hr className="diary-divider mt-7 mb-6" />

					<button
						type="button"
						onClick={markComplete}
						className="diary-title flex w-full items-center justify-center gap-2.5 rounded-lg border-2 border-dashed border-[var(--accent-soft)] bg-[var(--accent-bg)] py-4 text-lg font-semibold text-[var(--accent)] transition hover:border-[var(--accent-vivid)] hover:bg-[rgba(196,123,107,0.15)]"
					>
						<CheckCircle2 className="h-6 w-6" />
						Mark day as complete
					</button>
				</>
			)}
		</div>
	);
}
