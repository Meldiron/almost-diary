import { Monitor, Moon, Palette, Settings, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { cn } from "#/lib/utils";
import { CustomizeDialog } from "./CustomizeDialog";

type ThemeMode = "light" | "dark" | "auto";

function getInitialMode(): ThemeMode {
	if (typeof window === "undefined") return "auto";
	const stored = window.localStorage.getItem("theme");
	if (stored === "light" || stored === "dark" || stored === "auto")
		return stored;
	return "auto";
}

function applyThemeMode(mode: ThemeMode) {
	const prefersDark = window.matchMedia(
		"(prefers-color-scheme: dark)",
	).matches;
	const resolved = mode === "auto" ? (prefersDark ? "dark" : "light") : mode;

	document.documentElement.classList.remove("light", "dark");
	document.documentElement.classList.add(resolved);

	if (mode === "auto") {
		document.documentElement.removeAttribute("data-theme");
	} else {
		document.documentElement.setAttribute("data-theme", mode);
	}

	document.documentElement.style.colorScheme = resolved;
}

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
	{ mode: "light", label: "Light", icon: Sun },
	{ mode: "dark", label: "Dark", icon: Moon },
	{ mode: "auto", label: "System", icon: Monitor },
];

export function SettingsMenu() {
	const [customizeOpen, setCustomizeOpen] = useState(false);
	const [themeOpen, setThemeOpen] = useState(false);
	const [mode, setMode] = useState<ThemeMode>("auto");

	useEffect(() => {
		const initialMode = getInitialMode();
		setMode(initialMode);
		applyThemeMode(initialMode);
	}, []);

	useEffect(() => {
		if (mode !== "auto") return;
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => applyThemeMode("auto");
		media.addEventListener("change", onChange);
		return () => media.removeEventListener("change", onChange);
	}, [mode]);

	function selectMode(next: ThemeMode) {
		setMode(next);
		applyThemeMode(next);
		window.localStorage.setItem("theme", next);
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						className="rounded-lg p-2.5 text-[var(--ink-soft)] transition hover:bg-[var(--accent-bg)] hover:text-[var(--accent-vivid)]"
					>
						<Settings className="h-6 w-6" />
						<span className="sr-only">Settings</span>
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={() => setCustomizeOpen(true)}>
						<Palette className="mr-2 h-4 w-4" />
						Customize Diary
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setThemeOpen(true)}>
						<Sun className="mr-2 h-4 w-4" />
						Theme
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<CustomizeDialog open={customizeOpen} onOpenChange={setCustomizeOpen} />

			<Dialog open={themeOpen} onOpenChange={setThemeOpen}>
				<DialogContent className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle className="diary-title text-xl">Theme</DialogTitle>
						<DialogDescription>
							Choose how Almost Diary looks.
						</DialogDescription>
					</DialogHeader>
					<div className="flex gap-3 pt-2">
						{THEME_OPTIONS.map(({ mode: m, label, icon: Icon }) => (
							<button
								key={m}
								type="button"
								onClick={() => selectMode(m)}
								className={cn(
									"flex flex-1 flex-col items-center gap-2 rounded-lg border-2 border-dashed p-4 transition",
									mode === m
										? "border-[var(--accent-vivid)] bg-[var(--accent-vivid)] text-white"
										: "border-[var(--dash-color)] text-[var(--ink-soft)] hover:border-[var(--accent-soft)] hover:text-[var(--ink)]",
								)}
							>
								<Icon className="h-6 w-6" />
								<span className="diary-title text-base font-semibold">
									{label}
								</span>
							</button>
						))}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
