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
	"sunny",
	"neutral",
	"cold",
	"lightning",
	"windy",
	"rainy",
] as const;
export type WeatherOption = (typeof WEATHER_OPTIONS)[number];

export const WEATHER_META: Record<
	WeatherOption,
	{ label: string; icon: LucideIcon }
> = {
	sunny: { label: "Sunny", icon: Sun },
	neutral: { label: "Neutral", icon: Cloud },
	cold: { label: "Cold", icon: Snowflake },
	lightning: { label: "Lightning", icon: CloudLightning },
	windy: { label: "Windy", icon: Wind },
	rainy: { label: "Rainy", icon: CloudRain },
};

// ── Mood ─────────────────────────────────────────────────────────────────────

export const MOOD_OPTIONS = [
	"happy",
	"neutral",
	"sad",
	"angry",
	"anxious",
	"overwhelmed",
] as const;
export type MoodOption = (typeof MOOD_OPTIONS)[number];

export const MOOD_META: Record<
	MoodOption,
	{ label: string; icon: LucideIcon }
> = {
	happy: { label: "Happy", icon: Heart },
	neutral: { label: "Neutral", icon: Meh },
	sad: { label: "Sad", icon: Frown },
	angry: { label: "Angry", icon: Flame },
	anxious: { label: "Anxious", icon: AlertTriangle },
	overwhelmed: { label: "Overwhelmed", icon: Zap },
};

// ── Range-based trackers ─────────────────────────────────────────────────────

export const MONEY_OPTIONS = [
	"1-3",
	"3-5",
	"5-10",
	"15-20",
	"20-30",
	"30+",
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

// ── Diary Entry ──────────────────────────────────────────────────────────────

export interface DiaryEntry {
	date: string;
	weather?: WeatherOption;
	mood?: MoodOption;
	money?: MoneyRange;
	steps?: StepsRange;
	sleep?: SleepRange;
	selfCare?: SelfCareRange;
	songOfTheDay?: string;
	highlightOfTheDay?: string;
	completedStamps?: string[];
}

// ── Stamps ───────────────────────────────────────────────────────────────────

export interface Stamp {
	id: string;
	description: string;
	imageUrl?: string;
	createdAt: string;
}

export const DEFAULT_STAMPS: Omit<Stamp, "id" | "createdAt">[] = [
	{ description: "Do an exercise" },
	{ description: "Read a book" },
	{ description: "Play a game" },
];
