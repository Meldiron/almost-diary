import {
	Activity,
	Cloud,
	Coins,
	Footprints,
	Heart,
	Moon,
	Music,
	Sparkles,
	Star,
} from "lucide-react";
import { ActivityLog } from "#/components/diary/ActivityLog";
import { HighlightInput } from "#/components/diary/HighlightInput";
import { MoodTracker } from "#/components/diary/MoodTracker";
import { RangeTracker } from "#/components/diary/RangeTracker";
import { SongInput } from "#/components/diary/SongInput";
import { TrackerSection } from "#/components/diary/TrackerSection";
import { WeatherTracker } from "#/components/diary/WeatherTracker";
import { useDiaryEntry } from "#/hooks/useDiaryEntry";
import { useLocalStorage } from "#/hooks/useLocalStorage";
import { useStamps } from "#/hooks/useStamps";
import {
	MONEY_LABELS,
	MONEY_OPTIONS,
	SELFCARE_LABELS,
	SELFCARE_OPTIONS,
	SLEEP_LABELS,
	SLEEP_OPTIONS,
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

	function handleToggleStamp(stampId: string) {
		const current = entry.completedStamps ?? [];
		const updated = current.includes(stampId)
			? current.filter((id) => id !== stampId)
			: [...current, stampId];
		updateEntry({ completedStamps: updated });
	}

	return (
		<div
			className={`diary-sheet flex-shrink-0 rounded-sm p-6 pl-14 sm:p-8 sm:pl-16 transition-opacity duration-300 ${
				isCenter ? "opacity-100" : "opacity-40"
			}`}
			style={{ width: "min(680px, 85vw)" }}
		>
			<div className="mb-4 text-center">
				<h2 className="diary-title text-2xl font-bold text-[var(--ink)]">
					{formatDisplayDate(date)}
				</h2>
			</div>

			<hr className="diary-divider mt-4 mb-5" />

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

			<hr className="diary-divider mt-6 mb-5" />

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

			<hr className="diary-divider mt-6 mb-5" />

			<TrackerSection
				title="Money Spent"
				icon={Coins}
				hasValue={!!entry.money}
				onReset={() => updateEntry({ money: undefined })}
			>
				<RangeTracker
					options={MONEY_OPTIONS}
					labels={MONEY_LABELS}
					value={entry.money}
					onChange={(v) => updateEntry({ money: v })}
				/>
			</TrackerSection>

			<hr className="diary-divider mt-6 mb-5" />

			<TrackerSection
				title="Steps"
				icon={Footprints}
				hasValue={!!entry.steps}
				onReset={() => updateEntry({ steps: undefined })}
			>
				<RangeTracker
					options={STEPS_OPTIONS}
					labels={STEPS_LABELS}
					value={entry.steps}
					onChange={(v) => updateEntry({ steps: v })}
				/>
			</TrackerSection>

			<hr className="diary-divider mt-6 mb-5" />

			<TrackerSection
				title="Sleep"
				icon={Moon}
				hasValue={!!entry.sleep}
				onReset={() => updateEntry({ sleep: undefined })}
			>
				<RangeTracker
					options={SLEEP_OPTIONS}
					labels={SLEEP_LABELS}
					value={entry.sleep}
					onChange={(v) => updateEntry({ sleep: v })}
				/>
			</TrackerSection>

			<hr className="diary-divider mt-6 mb-5" />

			<TrackerSection
				title="Self-Care"
				icon={Sparkles}
				hasValue={!!entry.selfCare}
				onReset={() => updateEntry({ selfCare: undefined })}
			>
				<RangeTracker
					options={SELFCARE_OPTIONS}
					labels={SELFCARE_LABELS}
					value={entry.selfCare}
					onChange={(v) => updateEntry({ selfCare: v })}
				/>
			</TrackerSection>

			<hr className="diary-divider mt-6 mb-5" />

			<TrackerSection title="Song of the Day" icon={Music}>
				<SongInput
					value={entry.songOfTheDay}
					onChange={(v) => updateEntry({ songOfTheDay: v })}
				/>
			</TrackerSection>

			<hr className="diary-divider mt-6 mb-5" />

			<TrackerSection title="Highlight of the Day" icon={Star}>
				<HighlightInput
					value={entry.highlightOfTheDay}
					onChange={(v) => updateEntry({ highlightOfTheDay: v })}
				/>
			</TrackerSection>

			<hr className="diary-divider mt-6 mb-5" />

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
		</div>
	);
}
