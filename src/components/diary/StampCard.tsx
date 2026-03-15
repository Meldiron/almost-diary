import { Check, Trash2 } from "lucide-react";
import type { Stamp } from "#/lib/types";
import { cn } from "#/lib/utils";

interface StampCardProps {
	stamp: Stamp;
	isCompleted: boolean;
	onToggle: () => void;
	onDelete: () => void;
}

function PlaceholderImage({ description }: { description: string }) {
	let hash = 0;
	for (let i = 0; i < description.length; i++) {
		hash = description.charCodeAt(i) + ((hash << 5) - hash);
	}
	const hue = Math.abs(hash % 360);

	return (
		<div
			className="flex h-full w-full items-center justify-center text-xl font-bold"
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
	onDelete,
}: StampCardProps) {
	return (
		<div className="group relative flex flex-col items-center gap-1.5">
			<button
				type="button"
				onClick={onToggle}
				className={cn(
					"relative h-14 w-14 overflow-hidden rounded-lg border-2 border-dashed transition-all",
					isCompleted
						? "border-[var(--accent)] opacity-100"
						: "border-[var(--dash-color)] opacity-50 hover:opacity-80",
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
						<Check className="h-5 w-5 text-[var(--accent)]" />
					</div>
				)}
			</button>
			<span className="diary-title max-w-[4.5rem] text-center text-[0.7rem] leading-tight text-[var(--ink-soft)]">
				{stamp.description}
			</span>
			<button
				type="button"
				onClick={onDelete}
				className="absolute -right-1 -top-1 hidden h-5 w-5 items-center justify-center rounded-full bg-red-50 text-red-400 transition group-hover:flex hover:bg-red-100 hover:text-red-500"
			>
				<Trash2 className="h-3 w-3" />
			</button>
		</div>
	);
}
