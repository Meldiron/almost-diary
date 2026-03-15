import { createContext, useContext, useEffect, useRef } from "react";

type ScrollToDateFn = (date: string) => void;

// Module-level ref that the Header can call directly
let globalScrollToDate: ScrollToDateFn | null = null;

export function setGlobalScrollToDate(fn: ScrollToDateFn | null) {
	globalScrollToDate = fn;
}

export function getGlobalScrollToDate(): ScrollToDateFn | null {
	return globalScrollToDate;
}

// Hook to register and auto-cleanup
export function useRegisterScrollToDate(fn: ScrollToDateFn) {
	const fnRef = useRef(fn);
	fnRef.current = fn;

	useEffect(() => {
		setGlobalScrollToDate((date: string) => fnRef.current(date));
		return () => setGlobalScrollToDate(null);
	}, []);
}

// For components that need it
export const ScrollToDateContext = createContext<ScrollToDateFn | null>(null);

export function useScrollToDate() {
	return useContext(ScrollToDateContext);
}
