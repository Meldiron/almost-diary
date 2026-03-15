import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { DiarySheet } from "#/components/diary/DiarySheet";
import {
	ScrollToDateContext,
	useRegisterScrollToDate,
} from "#/lib/scroll-context";

function getToday(): string {
	return new Date().toISOString().split("T")[0];
}

function addDays(dateStr: string, days: number): string {
	const d = new Date(`${dateStr}T00:00:00`);
	d.setDate(d.getDate() + days);
	return d.toISOString().split("T")[0];
}

function buildDateRange(
	center: string,
	past: number,
	future: number,
): string[] {
	const dates: string[] = [];
	for (let i = -past; i <= future; i++) {
		dates.push(addDays(center, i));
	}
	return dates;
}

function scrollElToChild(
	el: HTMLElement,
	idx: number,
	behavior: ScrollBehavior = "smooth",
) {
	const card = el.children[idx] as HTMLElement | undefined;
	if (!card) return;
	el.scrollTo({
		left: card.offsetLeft - el.clientWidth / 2 + card.offsetWidth / 2,
		behavior,
	});
}

export const Route = createFileRoute("/")({
	component: DiaryPage,
});

function DiaryPage() {
	const today = getToday();
	const [dates, setDates] = useState(() => buildDateRange(today, 3, 3));
	const [centerIndex, setCenterIndex] = useState(3);
	const scrollRef = useRef<HTMLDivElement>(null);
	const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

	// Scroll to center (today) on mount
	useEffect(() => {
		// Wait for layout to complete before scrolling
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				const el = scrollRef.current;
				if (el) scrollElToChild(el, 3, "instant");
			});
		});
	}, []);

	const scrollToDate = useCallback(
		(targetDate: string) => {
			const el = scrollRef.current;
			if (!el) return;

			const existingIdx = dates.indexOf(targetDate);
			if (existingIdx !== -1) {
				setCenterIndex(existingIdx);
				scrollElToChild(el, existingIdx);
				return;
			}

			const newDates = buildDateRange(targetDate, 3, 3);
			setDates(newDates);
			setCenterIndex(3);

			requestAnimationFrame(() => {
				const freshEl = scrollRef.current;
				if (freshEl) scrollElToChild(freshEl, 3, "instant");
			});
		},
		[dates],
	);

	// Register so Header can call scrollToDate
	useRegisterScrollToDate(scrollToDate);

	const findCenterCard = useCallback(() => {
		const el = scrollRef.current;
		if (!el) return undefined;

		const scrollCenter = el.scrollLeft + el.clientWidth / 2;
		let closest = 0;
		let closestDist = Number.POSITIVE_INFINITY;

		for (let i = 0; i < el.children.length; i++) {
			const child = el.children[i] as HTMLElement;
			const childCenter = child.offsetLeft + child.offsetWidth / 2;
			const dist = Math.abs(scrollCenter - childCenter);
			if (dist < closestDist) {
				closestDist = dist;
				closest = i;
			}
		}

		return closest;
	}, []);

	const expandIfNeeded = useCallback(
		(idx: number) => {
			const el = scrollRef.current;
			if (!el) return;

			if (idx <= 2) {
				const firstDate = dates[0];
				const newDates: string[] = [];
				for (let i = 5; i >= 1; i--) {
					newDates.push(addDays(firstDate, -i));
				}

				const prevScrollLeft = el.scrollLeft;
				const prevFirstOffset = (el.children[0] as HTMLElement)?.offsetLeft;

				setDates((prev) => [...newDates, ...prev]);
				setCenterIndex((prev) => prev + 5);

				requestAnimationFrame(() => {
					const shift =
						(el.children[5] as HTMLElement).offsetLeft - prevFirstOffset;
					el.scrollLeft = prevScrollLeft + shift;
				});
			}

			if (idx >= dates.length - 3) {
				const lastDate = dates[dates.length - 1];
				const newDates: string[] = [];
				for (let i = 1; i <= 5; i++) {
					newDates.push(addDays(lastDate, i));
				}
				setDates((prev) => [...prev, ...newDates]);
			}
		},
		[dates],
	);

	function handleScroll() {
		clearTimeout(scrollTimeoutRef.current);
		scrollTimeoutRef.current = setTimeout(() => {
			const idx = findCenterCard();
			if (idx !== undefined) {
				setCenterIndex(idx);
				expandIfNeeded(idx);
			}
		}, 150);
	}

	return (
		<ScrollToDateContext.Provider value={scrollToDate}>
			<main className="h-[calc(100vh-57px)] overflow-hidden">
				{/* biome-ignore lint/a11y/useSemanticElements: scroll container */}
				<div
					ref={scrollRef}
					onScroll={handleScroll}
					role="region"
					aria-label="Diary pages"
					className="diary-scroll flex h-full snap-x snap-mandatory items-start gap-6 overflow-x-auto px-[calc(50vw-min(340px,42.5vw))] pt-6 pb-6"
				>
					{dates.map((date, i) => (
						<div key={date} className="snap-center">
							<DiarySheet date={date} isCenter={i === centerIndex} />
						</div>
					))}
				</div>
			</main>
		</ScrollToDateContext.Provider>
	);
}
