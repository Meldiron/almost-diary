import { Link } from "@tanstack/react-router";
import { BookHeart, CalendarDays } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { Calendar } from "#/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/ui/popover";
import { getGlobalScrollToDate } from "#/lib/scroll-context";
import { ApiKeyDialog } from "./ApiKeyDialog";
import ThemeToggle from "./ThemeToggle";

function getToday(): string {
	return new Date().toISOString().split("T")[0];
}

function toDateKey(d: Date): string {
	return d.toISOString().split("T")[0];
}

export default function Header() {
	const [calOpen, setCalOpen] = useState(false);

	function handleToday() {
		getGlobalScrollToDate()?.(getToday());
	}

	function handleCalendarSelect(day: Date | undefined) {
		if (!day) return;
		getGlobalScrollToDate()?.(toDateKey(day));
		setCalOpen(false);
	}

	return (
		<header className="sticky top-0 z-50 border-b border-[var(--paper-edge)] bg-[var(--header-bg)] px-4 backdrop-blur-md">
			<nav className="page-wrap flex items-center gap-x-3 py-3">
				<h2 className="m-0 flex-shrink-0">
					<Link
						to="/"
						className="diary-title inline-flex items-center gap-1.5 text-xl font-bold text-[var(--ink)] no-underline"
					>
						<BookHeart className="h-5 w-5 text-[var(--accent-vivid)]" />
						Almost Diary
					</Link>
				</h2>

				<div className="ml-auto flex items-center gap-1">
					<Button
						variant="ghost"
						size="sm"
						onClick={handleToday}
						className="diary-title text-sm font-semibold text-[var(--accent-vivid)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent-vivid)]"
					>
						Today
					</Button>

					<Popover open={calOpen} onOpenChange={setCalOpen}>
						<PopoverTrigger asChild>
							<button
								type="button"
								className="rounded-lg p-2 text-[var(--ink-soft)] transition hover:bg-[var(--accent-bg)] hover:text-[var(--accent-vivid)]"
							>
								<CalendarDays className="h-5 w-5" />
								<span className="sr-only">Pick a date</span>
							</button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="end">
							<Calendar
								mode="single"
								defaultMonth={new Date()}
								onSelect={handleCalendarSelect}
							/>
						</PopoverContent>
					</Popover>

					<ApiKeyDialog />
					<ThemeToggle />
				</div>
			</nav>
		</header>
	);
}
