import type { LucideIcon } from "lucide-react";
import { RotateCcw } from "lucide-react";
import { cn } from "#/lib/utils";

interface TrackerSectionProps {
	title: string;
	icon?: LucideIcon;
	children: React.ReactNode;
	className?: string;
	onReset?: () => void;
	hasValue?: boolean;
	finished?: boolean;
	noRecord?: boolean;
}

export function TrackerSection({
	title,
	icon: Icon,
	children,
	className,
	onReset,
	hasValue,
	finished,
	noRecord,
}: TrackerSectionProps) {
	return (
		<div className={cn("space-y-3", className)}>
			<div className="flex items-center gap-2.5">
				{Icon && <Icon className="h-5 w-5 text-[var(--accent-vivid)]" />}
				<h3 className="diary-title text-xl font-semibold text-[var(--ink)]">
					{title}
				</h3>
				{!finished && hasValue && onReset && (
					<button
						type="button"
						onClick={onReset}
						className="ml-auto rounded-md p-1.5 text-[var(--ink-soft)] transition hover:bg-[var(--accent-bg)] hover:text-[var(--accent-vivid)]"
						aria-label="Reset"
					>
						<RotateCcw className="h-4 w-4" />
					</button>
				)}
			</div>
			{noRecord ? (
				<p className="diary-title text-base text-[var(--ink-faint)]">
					No record
				</p>
			) : (
				children
			)}
		</div>
	);
}
