import { Link } from "@tanstack/react-router";
import { BookHeart, CalendarDays } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "#/components/ui/button";
import { Calendar } from "#/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/ui/popover";
import { useLocalStorage } from "#/hooks/useLocalStorage";
import { getGlobalScrollToDate } from "#/lib/scroll-context";
import type { DiaryEntry } from "#/lib/types";
import { getToday, toDateKey } from "#/lib/utils";
import { ApiKeyDialog } from "./ApiKeyDialog";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
	const [calOpen, setCalOpen] = useState(false);
	const [entries] = useLocalStorage<Record<string, DiaryEntry>>(
		"diary-entries",
		{},
	);

	const finishedDates = useMemo(() => {
		return Object.values(entries)
			.filter((e) => e.finished)
			.map((e) => new Date(`${e.date}T00:00:00`));
	}, [entries]);

	function handleToday() {
		getGlobalScrollToDate()?.(getToday());
	}

	function handleCalendarSelect(day: Date | undefined) {
		if (!day) return;
		getGlobalScrollToDate()?.(toDateKey(day));
		setCalOpen(false);
	}

	return (
		<header className="sticky top-0 z-50 border-b border-[var(--paper-edge)] bg-[var(--header-bg)] px-5 backdrop-blur-md">
			<nav className="page-wrap flex items-center gap-x-4 py-4">
				<h2 className="m-0 flex-shrink-0">
					<Link
						to="/"
						className="diary-title inline-flex items-center gap-2 text-2xl font-bold text-[var(--ink)] no-underline"
					>
						<BookHeart className="h-7 w-7 text-[var(--accent-vivid)]" />
						Almost Diary
					</Link>
				</h2>

				<div className="ml-auto flex items-center gap-1.5">
					<Button
						variant="ghost"
						size="default"
						onClick={handleToday}
						className="diary-title text-base font-semibold text-[var(--accent-vivid)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent-vivid)]"
					>
						Today
					</Button>

					<Popover open={calOpen} onOpenChange={setCalOpen}>
						<PopoverTrigger asChild>
							<button
								type="button"
								className="rounded-lg p-2.5 text-[var(--ink-soft)] transition hover:bg-[var(--accent-bg)] hover:text-[var(--accent-vivid)]"
							>
								<CalendarDays className="h-6 w-6" />
								<span className="sr-only">Pick a date</span>
							</button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0" align="end">
							<Calendar
								mode="single"
								defaultMonth={new Date()}
								onSelect={handleCalendarSelect}
								modifiers={{ finished: finishedDates }}
								modifiersClassNames={{
									finished: "diary-cal-finished",
								}}
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
