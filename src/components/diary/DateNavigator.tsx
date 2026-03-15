import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "#/components/ui/button";

interface DateNavigatorProps {
	date: string;
	onDateChange: (date: string) => void;
}

function addDays(dateStr: string, days: number): string {
	const d = new Date(`${dateStr}T00:00:00`);
	d.setDate(d.getDate() + days);
	return d.toISOString().split("T")[0];
}

function formatDisplayDate(dateStr: string): string {
	const d = new Date(`${dateStr}T00:00:00`);
	return d.toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

function getToday(): string {
	return new Date().toISOString().split("T")[0];
}

export function DateNavigator({ date, onDateChange }: DateNavigatorProps) {
	const isToday = date === getToday();

	return (
		<div className="flex items-center justify-between gap-3">
			<Button
				variant="ghost"
				size="icon"
				onClick={() => onDateChange(addDays(date, -1))}
				className="h-9 w-9 rounded-full text-[var(--ink-soft)] hover:bg-[var(--accent-bg)] hover:text-[var(--ink)]"
			>
				<ChevronLeft className="h-5 w-5" />
			</Button>

			<div className="flex flex-col items-center">
				<span className="diary-title text-2xl font-bold text-[var(--ink)]">
					{formatDisplayDate(date)}
				</span>
			</div>

			<Button
				variant="ghost"
				size="icon"
				onClick={() => onDateChange(addDays(date, 1))}
				className="h-9 w-9 rounded-full text-[var(--ink-soft)] hover:bg-[var(--accent-bg)] hover:text-[var(--ink)]"
				disabled={isToday}
			>
				<ChevronRight className="h-5 w-5" />
			</Button>
		</div>
	);
}
