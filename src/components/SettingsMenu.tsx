import { Palette, Settings } from "lucide-react";
import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { CustomizeDialog } from "./CustomizeDialog";

export function SettingsMenu() {
	const [customizeOpen, setCustomizeOpen] = useState(false);

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
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Customize Dialog */}
			<CustomizeDialog open={customizeOpen} onOpenChange={setCustomizeOpen} />
		</>
	);
}
