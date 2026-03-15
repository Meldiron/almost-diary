import { Check, Pencil } from "lucide-react";
import type { Stamp } from "#/lib/types";
import { cn } from "#/lib/utils";

interface StampCardProps {
	stamp: Stamp;
	isCompleted: boolean;
	onToggle: () => void;
	onEdit: () => void;
}

function PlaceholderImage({ description }: { description: string }) {
	let hash = 0;
	for (let i = 0; i < description.length; i++) {
		hash = description.charCodeAt(i) + ((hash << 5) - hash);
	}
	const hue = Math.abs(hash % 360);

	return (
		<div
			className="flex h-full w-full items-center justify-center text-2xl font-bold"
			style={{
				background: `linear-gradient(135deg, hsl(${hue}, 40%, 88%), hsl(${(hue + 40) % 360}, 35%, 84%))`,
				color: `hsl(${hue}, 30%, 45%)`,
			}}
		>
			{description.slice(0, 1).toUpperCase()}
		</div>
	);
}

export function StampCard({
	stamp,
	isCompleted,
	onToggle,
	onEdit,
}: StampCardProps) {
	return (
		<div className="group relative flex flex-col items-center gap-2">
			<button
				type="button"
				onClick={onToggle}
				className={cn(
					"relative h-18 w-18 overflow-hidden rounded-xl border-2 border-dashed transition-all",
					isCompleted
						? "border-[var(--accent)] opacity-100"
						: "border-[var(--dash-color)] opacity-60 hover:opacity-100 hover:border-[var(--accent-soft)]",
				)}
			>
				{stamp.imageUrl ? (
					<img
						src={stamp.imageUrl}
						alt={stamp.description}
						className="h-full w-full object-cover"
					/>
				) : (
					<PlaceholderImage description={stamp.description} />
				)}
				{isCompleted && (
					<div className="absolute inset-0 flex items-center justify-center bg-[var(--accent)]/15">
						<Check className="h-6 w-6 text-[var(--accent)]" />
					</div>
				)}
			</button>
			<span className="diary-title max-w-[5.5rem] text-center text-sm leading-tight text-[var(--ink-soft)]">
				{stamp.description}
			</span>
			<button
				type="button"
				onClick={onEdit}
				className="absolute -right-1 -top-1 hidden h-6 w-6 items-center justify-center rounded-full bg-[var(--paper)] text-[var(--ink-faint)] shadow-sm border border-[var(--dash-color)] transition group-hover:flex hover:text-[var(--accent-vivid)] hover:border-[var(--accent-soft)]"
			>
				<Pencil className="h-3 w-3" />
			</button>
		</div>
	);
}
