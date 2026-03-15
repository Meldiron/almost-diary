import type { Stamp } from "#/lib/types";
import { AddStampDialog } from "./AddStampDialog";
import { StampCard } from "./StampCard";

interface ActivityLogProps {
	stamps: Stamp[];
	completedStamps: string[];
	apiKey: string;
	onToggleStamp: (stampId: string) => void;
	onDeleteStamp: (stampId: string) => void;
	onAddStamp: (description: string, imageUrl?: string) => void;
}

export function ActivityLog({
	stamps,
	completedStamps,
	apiKey,
	onToggleStamp,
	onDeleteStamp,
	onAddStamp,
}: ActivityLogProps) {
	return (
		<div className="flex flex-wrap gap-4">
			{stamps.map((stamp) => (
				<StampCard
					key={stamp.id}
					stamp={stamp}
					isCompleted={completedStamps.includes(stamp.id)}
					onToggle={() => onToggleStamp(stamp.id)}
					onDelete={() => onDeleteStamp(stamp.id)}
				/>
			))}
			<div className="flex flex-col items-center gap-2">
				<AddStampDialog apiKey={apiKey} onAdd={onAddStamp} />
				<span className="text-[0.65rem] font-medium text-[var(--sea-ink-soft)]">
					Add new
				</span>
			</div>
		</div>
	);
}
