import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "#/components/ui/alert-dialog";
import { Button } from "#/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "#/components/ui/collapsible";
import { ColorPicker } from "#/components/ui/color-picker";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { useTrackerConfig } from "#/hooks/useTrackerConfig";
import type { TrackerCategory, TrackerOption } from "#/lib/tracker-config";

interface CustomizeDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

function CategoryEditor({
	category,
	onUpdate,
}: {
	category: TrackerCategory;
	onUpdate: (cat: TrackerCategory) => void;
}) {
	const [newLabel, setNewLabel] = useState("");
	const [newColor, setNewColor] = useState("#84cc16");

	function updateOption(idx: number, partial: Partial<TrackerOption>) {
		const updated = [...category.options];
		updated[idx] = { ...updated[idx], ...partial };
		onUpdate({ ...category, options: updated });
	}

	function removeOption(idx: number) {
		const updated = category.options.filter((_, i) => i !== idx);
		onUpdate({ ...category, options: updated });
	}

	function moveOption(idx: number, dir: -1 | 1) {
		const target = idx + dir;
		if (target < 0 || target >= category.options.length) return;
		const updated = [...category.options];
		[updated[idx], updated[target]] = [updated[target], updated[idx]];
		onUpdate({ ...category, options: updated });
	}

	function addOption() {
		if (!newLabel.trim()) return;
		const id = newLabel.trim().toLowerCase().replace(/\s+/g, "-");
		const option: TrackerOption = {
			id,
			label: newLabel.trim(),
			color: newColor,
		};
		onUpdate({
			...category,
			options: [...category.options, option],
		});
		setNewLabel("");
		setNewColor("#84cc16");
	}

	return (
		<div className="rounded-lg border border-[var(--dash-color)] bg-[var(--paper)] divide-y divide-[var(--dash-color)]">
			{category.options.map((opt, idx) => (
				<div key={opt.id} className="flex items-center gap-2 px-3 py-2">
					<div className="flex flex-col gap-0.5">
						<button
							type="button"
							onClick={() => moveOption(idx, -1)}
							disabled={idx === 0}
							className="text-[var(--ink-faint)] hover:text-[var(--ink)] disabled:opacity-30"
						>
							<ChevronUp className="h-3.5 w-3.5" />
						</button>
						<button
							type="button"
							onClick={() => moveOption(idx, 1)}
							disabled={idx === category.options.length - 1}
							className="text-[var(--ink-faint)] hover:text-[var(--ink)] disabled:opacity-30"
						>
							<ChevronDown className="h-3.5 w-3.5" />
						</button>
					</div>
					<ColorPicker
						value={opt.color}
						onChange={(c) => updateOption(idx, { color: c })}
					/>
					<Input
						value={opt.label}
						onChange={(e) => updateOption(idx, { label: e.target.value })}
						className="h-8 flex-1 text-sm"
					/>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<button
								type="button"
								className="rounded p-1 text-[var(--ink-faint)] transition hover:bg-[var(--accent-bg)] hover:text-[var(--accent-vivid)]"
							>
								<Trash2 className="h-4 w-4" />
							</button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete "{opt.label}"?</AlertDialogTitle>
								<AlertDialogDescription>
									This option will be removed from the {category.title} section.
									Existing diary entries using it won't be affected.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={() => removeOption(idx)}>
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			))}
			<div className="flex items-center gap-2 px-3 py-2">
				<ColorPicker value={newColor} onChange={setNewColor} />
				<Input
					placeholder="New option name..."
					value={newLabel}
					onChange={(e) => setNewLabel(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && addOption()}
					className="h-8 flex-1 text-sm"
				/>
				<Button
					variant="outline"
					size="sm"
					onClick={addOption}
					disabled={!newLabel.trim()}
					className="h-8 gap-1 px-2"
				>
					<Plus className="h-3.5 w-3.5" />
					Add
				</Button>
			</div>
		</div>
	);
}

export function CustomizeDialog({ open, onOpenChange }: CustomizeDialogProps) {
	const { config, updateCategory, resetToDefaults } = useTrackerConfig();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle className="diary-title text-2xl">
						Customize Diary
					</DialogTitle>
					<DialogDescription>
						Change names, colors, order, or add/remove options for each section.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-5 pt-2">
					{config.categories.map((cat) => (
						<Collapsible key={cat.id}>
							<CollapsibleTrigger className="customize-drawer-trigger flex w-full items-center justify-between rounded-lg border border-[var(--dash-color)] bg-[var(--paper)] px-4 py-3 text-left transition hover:bg-[var(--accent-bg)]">
								<div className="flex items-center gap-3">
									<span className="diary-title text-lg font-semibold text-[var(--ink)]">
										{cat.title}
									</span>
									<span className="text-xs text-[var(--ink-faint)]">
										{cat.options.length} options
									</span>
								</div>
								<ChevronDown className="customize-drawer-chevron h-5 w-5 text-[var(--ink-faint)] transition-transform duration-200" />
							</CollapsibleTrigger>
							<CollapsibleContent className="pt-2">
								<CategoryEditor
									category={cat}
									onUpdate={(updated) => updateCategory(cat.id, updated)}
								/>
							</CollapsibleContent>
						</Collapsible>
					))}
					<div className="flex items-center justify-between border-t border-[var(--dash-color)] pt-4">
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="text-red-500 hover:bg-red-50 hover:text-red-600"
								>
									Reset all to defaults
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Reset all customizations?</AlertDialogTitle>
									<AlertDialogDescription>
										This will restore all sections to their original options,
										colors, and order. This cannot be undone.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction onClick={resetToDefaults}>
										Reset
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
						<Button onClick={() => onOpenChange(false)}>Done</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
