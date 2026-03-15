import type { LucideIcon } from "lucide-react";
import {
	AlertTriangle,
	Cloud,
	CloudLightning,
	CloudRain,
	Flame,
	Frown,
	Heart,
	Meh,
	Snowflake,
	Sun,
	Wind,
	Zap,
} from "lucide-react";

// ── Weather ──────────────────────────────────────────────────────────────────

export const WEATHER_OPTIONS = [
	"lightning",
	"rainy",
	"cold",
	"windy",
	"neutral",
	"sunny",
] as const;
export type WeatherOption = (typeof WEATHER_OPTIONS)[number];

export const WEATHER_META: Record<
	WeatherOption,
	{ label: string; icon: LucideIcon; color: string }
> = {
	sunny: { label: "Sunny", icon: Sun, color: "#22c55e" },
	neutral: { label: "Neutral", icon: Cloud, color: "#84cc16" },
	windy: { label: "Windy", icon: Wind, color: "#eab308" },
	cold: { label: "Cold", icon: Snowflake, color: "#f59e0b" },
	rainy: { label: "Rainy", icon: CloudRain, color: "#f97316" },
	lightning: { label: "Lightning", icon: CloudLightning, color: "#ef4444" },
};

// ── Mood ─────────────────────────────────────────────────────────────────────

export const MOOD_OPTIONS = [
	"overwhelmed",
	"angry",
	"anxious",
	"sad",
	"neutral",
	"happy",
] as const;
export type MoodOption = (typeof MOOD_OPTIONS)[number];

export const MOOD_META: Record<
	MoodOption,
	{ label: string; icon: LucideIcon; color: string }
> = {
	happy: { label: "Happy", icon: Heart, color: "#22c55e" },
	neutral: { label: "Neutral", icon: Meh, color: "#84cc16" },
	sad: { label: "Sad", icon: Frown, color: "#f59e0b" },
	anxious: { label: "Anxious", icon: AlertTriangle, color: "#f97316" },
	angry: { label: "Angry", icon: Flame, color: "#ef4444" },
	overwhelmed: { label: "Overwhelmed", icon: Zap, color: "#dc2626" },
};

// ── Range-based trackers ─────────────────────────────────────────────────────

export const MONEY_OPTIONS = [
	"30+",
	"20-30",
	"15-20",
	"5-10",
	"3-5",
	"1-3",
] as const;
export type MoneyRange = (typeof MONEY_OPTIONS)[number];
export const MONEY_LABELS: Record<MoneyRange, string> = {
	"1-3": "1-3€",
	"3-5": "3-5€",
	"5-10": "5-10€",
	"15-20": "15-20€",
	"20-30": "20-30€",
	"30+": "30+€",
};
export const MONEY_COLORS: Record<MoneyRange, string> = {
	"1-3": "#22c55e",
	"3-5": "#84cc16",
	"5-10": "#eab308",
	"15-20": "#f59e0b",
	"20-30": "#f97316",
	"30+": "#ef4444",
};

export const STEPS_OPTIONS = [
	"0-1k",
	"1-3k",
	"3-5k",
	"5-10k",
	"10-20k",
	"20k+",
] as const;
export type StepsRange = (typeof STEPS_OPTIONS)[number];
export const STEPS_LABELS: Record<StepsRange, string> = {
	"0-1k": "0-1k",
	"1-3k": "1-3k",
	"3-5k": "3-5k",
	"5-10k": "5-10k",
	"10-20k": "10-20k",
	"20k+": "20k+",
};
export const STEPS_COLORS: Record<StepsRange, string> = {
	"0-1k": "#ef4444",
	"1-3k": "#f97316",
	"3-5k": "#f59e0b",
	"5-10k": "#eab308",
	"10-20k": "#84cc16",
	"20k+": "#22c55e",
};

export const SLEEP_OPTIONS = [
	"0-4",
	"4-6",
	"6-7",
	"7-8",
	"8-9",
	"10+",
] as const;
export type SleepRange = (typeof SLEEP_OPTIONS)[number];
export const SLEEP_LABELS: Record<SleepRange, string> = {
	"0-4": "0-4hr",
	"4-6": "4-6hr",
	"6-7": "6-7hr",
	"7-8": "7-8hr",
	"8-9": "8-9hr",
	"10+": "10+hr",
};
export const SLEEP_COLORS: Record<SleepRange, string> = {
	"0-4": "#ef4444",
	"4-6": "#f59e0b",
	"6-7": "#84cc16",
	"7-8": "#22c55e",
	"8-9": "#84cc16",
	"10+": "#eab308",
};

export const SELFCARE_OPTIONS = [
	"0-3",
	"3-5",
	"5-10",
	"10-15",
	"15-30",
	"30+",
] as const;
export type SelfCareRange = (typeof SELFCARE_OPTIONS)[number];
export const SELFCARE_LABELS: Record<SelfCareRange, string> = {
	"0-3": "0-3min",
	"3-5": "3-5min",
	"5-10": "5-10min",
	"10-15": "10-15min",
	"15-30": "15-30min",
	"30+": "30+min",
};
export const SELFCARE_COLORS: Record<SelfCareRange, string> = {
	"0-3": "#ef4444",
	"3-5": "#f97316",
	"5-10": "#f59e0b",
	"10-15": "#eab308",
	"15-30": "#84cc16",
	"30+": "#22c55e",
};

// ── Diary Entry ──────────────────────────────────────────────────────────────

export interface DiaryEntry {
	date: string;
	weather?: WeatherOption;
	mood?: MoodOption;
	money?: MoneyRange;
	steps?: StepsRange;
	sleep?: SleepRange;
	selfCare?: SelfCareRange;
	notes?: string;
	completedStamps?: string[];
	finished?: boolean;
}

// ── Stamps ───────────────────────────────────────────────────────────────────

export interface Stamp {
	id: string;
	description: string;
	imageUrl?: string;
	createdAt: string;
}
