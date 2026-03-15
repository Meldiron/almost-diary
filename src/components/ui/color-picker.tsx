import { Input } from "#/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/ui/popover";
import { cn } from "#/lib/utils";

const PRESET_COLORS = [
	"#ef4444",
	"#f97316",
	"#f59e0b",
	"#eab308",
	"#84cc16",
	"#22c55e",
	"#14b8a6",
	"#06b6d4",
	"#3b82f6",
	"#6366f1",
	"#8b5cf6",
	"#a855f7",
	"#d946ef",
	"#ec4899",
	"#f43f5e",
	"#78716c",
	"#dc2626",
	"#ea580c",
	"#d97706",
	"#ca8a04",
	"#65a30d",
	"#16a34a",
	"#0d9488",
	"#0891b2",
	"#2563eb",
	"#4f46e5",
	"#7c3aed",
	"#9333ea",
	"#c026d3",
	"#db2777",
	"#e11d48",
	"#57534e",
];

interface ColorPickerProps {
	value: string;
	onChange: (color: string) => void;
	className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={cn(
						"h-7 w-7 shrink-0 cursor-pointer rounded-md border border-[var(--dash-color)] transition hover:scale-110",
						className,
					)}
					style={{ backgroundColor: value }}
				/>
			</PopoverTrigger>
			<PopoverContent className="w-56 p-3" align="start">
				<div className="mb-3 flex flex-wrap gap-1.5">
					{PRESET_COLORS.map((color) => (
						<button
							key={color}
							type="button"
							onClick={() => onChange(color)}
							className={cn(
								"h-6 w-6 rounded-md transition hover:scale-110",
								value === color && "ring-2 ring-[var(--ink)] ring-offset-1",
							)}
							style={{ backgroundColor: color }}
						/>
					))}
				</div>
				<Input
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder="#000000"
					className="h-8 text-xs"
				/>
			</PopoverContent>
		</Popover>
	);
}
