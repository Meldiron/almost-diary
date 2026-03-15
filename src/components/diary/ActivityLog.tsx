import { Plus } from "lucide-react";
import { useState } from "react";
import type { Stamp } from "#/lib/types";
import { StampCard } from "./StampCard";
import { StampDialog } from "./StampDialog";

interface ActivityLogProps {
	stamps: Stamp[];
	completedStamps: string[];
	apiKey: string;
	onToggleStamp: (stampId: string) => void;
	onDeleteStamp: (stampId: string) => void;
	onAddStamp: (description: string, imageUrl?: string) => void;
	onUpdateStamp?: (id: string, description: string, imageUrl?: string) => void;
}

export function ActivityLog({
	stamps,
	completedStamps,
	apiKey,
	onToggleStamp,
	onDeleteStamp,
	onAddStamp,
	onUpdateStamp,
}: ActivityLogProps) {
	const [createOpen, setCreateOpen] = useState(false);
	const [editingStamp, setEditingStamp] = useState<Stamp>();
	const [editOpen, setEditOpen] = useState(false);

	function handleEdit(stamp: Stamp) {
		setEditingStamp(stamp);
		setEditOpen(true);
	}

	return (
		<>
			<div className="flex flex-wrap gap-4">
				{stamps.map((stamp) => (
					<StampCard
						key={stamp.id}
						stamp={stamp}
						isCompleted={completedStamps.includes(stamp.id)}
						onToggle={() => onToggleStamp(stamp.id)}
						onEdit={() => handleEdit(stamp)}
					/>
				))}
				<div className="flex flex-col items-center gap-2">
					<button
						type="button"
						onClick={() => setCreateOpen(true)}
						className="flex h-18 w-18 items-center justify-center rounded-xl border-2 border-dashed border-[var(--dash-color)] bg-[var(--paper)] text-[var(--ink-soft)] transition hover:border-[var(--accent-vivid)] hover:text-[var(--accent-vivid)]"
					>
						<Plus className="h-7 w-7" />
					</button>
					<span className="diary-title text-sm font-medium text-[var(--ink-soft)]">
						Add new
					</span>
				</div>
			</div>

			{/* Create stamp dialog */}
			<StampDialog
				open={createOpen}
				onOpenChange={setCreateOpen}
				apiKey={apiKey}
				onSave={onAddStamp}
			/>

			{/* Edit stamp dialog */}
			<StampDialog
				open={editOpen}
				onOpenChange={setEditOpen}
				apiKey={apiKey}
				stamp={editingStamp}
				onSave={(desc, img) => {
					if (editingStamp && onUpdateStamp) {
						onUpdateStamp(editingStamp.id, desc, img);
					}
				}}
				onDelete={() => {
					if (editingStamp) {
						onDeleteStamp(editingStamp.id);
					}
				}}
			/>
		</>
	);
}
