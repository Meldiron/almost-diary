export interface TrackerOption {
	id: string;
	label: string;
	color: string;
}

export interface TrackerCategory {
	id: string;
	title: string;
	options: TrackerOption[];
}

export interface TrackerConfig {
	categories: TrackerCategory[];
}

export const DEFAULT_CONFIG: TrackerConfig = {
	categories: [
		{
			id: "weather",
			title: "Weather",
			options: [
				{ id: "lightning", label: "Lightning", color: "#ef4444" },
				{ id: "rainy", label: "Rainy", color: "#f97316" },
				{ id: "cold", label: "Cold", color: "#f59e0b" },
				{ id: "windy", label: "Windy", color: "#eab308" },
				{ id: "neutral", label: "Neutral", color: "#84cc16" },
				{ id: "sunny", label: "Sunny", color: "#22c55e" },
			],
		},
		{
			id: "mood",
			title: "Mood",
			options: [
				{ id: "overwhelmed", label: "Overwhelmed", color: "#dc2626" },
				{ id: "angry", label: "Angry", color: "#ef4444" },
				{ id: "anxious", label: "Anxious", color: "#f97316" },
				{ id: "sad", label: "Sad", color: "#f59e0b" },
				{ id: "neutral", label: "Neutral", color: "#84cc16" },
				{ id: "happy", label: "Happy", color: "#22c55e" },
			],
		},
		{
			id: "money",
			title: "Money Spent",
			options: [
				{ id: "30+", label: "30+€", color: "#ef4444" },
				{ id: "20-30", label: "20-30€", color: "#f97316" },
				{ id: "15-20", label: "15-20€", color: "#f59e0b" },
				{ id: "5-10", label: "5-10€", color: "#eab308" },
				{ id: "3-5", label: "3-5€", color: "#84cc16" },
				{ id: "1-3", label: "1-3€", color: "#22c55e" },
			],
		},
		{
			id: "steps",
			title: "Steps",
			options: [
				{ id: "0-1k", label: "0-1k", color: "#ef4444" },
				{ id: "1-3k", label: "1-3k", color: "#f97316" },
				{ id: "3-5k", label: "3-5k", color: "#f59e0b" },
				{ id: "5-10k", label: "5-10k", color: "#eab308" },
				{ id: "10-20k", label: "10-20k", color: "#84cc16" },
				{ id: "20k+", label: "20k+", color: "#22c55e" },
			],
		},
		{
			id: "sleep",
			title: "Sleep",
			options: [
				{ id: "0-4", label: "0-4hr", color: "#ef4444" },
				{ id: "4-6", label: "4-6hr", color: "#f59e0b" },
				{ id: "6-7", label: "6-7hr", color: "#84cc16" },
				{ id: "7-8", label: "7-8hr", color: "#22c55e" },
				{ id: "8-9", label: "8-9hr", color: "#84cc16" },
				{ id: "10+", label: "10+hr", color: "#eab308" },
			],
		},
		{
			id: "selfCare",
			title: "Self-Care",
			options: [
				{ id: "0-3", label: "0-3min", color: "#ef4444" },
				{ id: "3-5", label: "3-5min", color: "#f97316" },
				{ id: "5-10", label: "5-10min", color: "#f59e0b" },
				{ id: "10-15", label: "10-15min", color: "#eab308" },
				{ id: "15-30", label: "15-30min", color: "#84cc16" },
				{ id: "30+", label: "30+min", color: "#22c55e" },
			],
		},
	],
};
