import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { DiarySheet } from "#/components/diary/DiarySheet";
import {
	ScrollToDateContext,
	useRegisterScrollToDate,
} from "#/lib/scroll-context";
import { getToday } from "#/lib/utils";

export const Route = createFileRoute("/")({
	component: DiaryPage,
});

function DiaryPage() {
	const [activeDate, setActiveDate] = useState(getToday);

	const scrollToDate = useCallback((date: string) => {
		setActiveDate(date);
	}, []);

	useRegisterScrollToDate(scrollToDate);

	return (
		<ScrollToDateContext.Provider value={scrollToDate}>
			<main className="min-h-[calc(100vh-65px)] overflow-y-auto">
				<div className="flex justify-center pt-6 pb-6">
					<div className="diary-sheet-wrap">
						<DiarySheet date={activeDate} isCenter />
					</div>
				</div>
			</main>
		</ScrollToDateContext.Provider>
	);
}
