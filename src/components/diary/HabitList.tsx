import { Check, Pencil, Plus, X } from "lucide-react";
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
import { ColorPicker } from "#/components/ui/color-picker";
import { effectHabitComplete, effectHabitUndo } from "#/lib/effects";
import { playHabitComplete, playHabitUndo } from "#/lib/sounds";
import type { Habit, HabitSnapshot } from "#/lib/types";
import { HABIT_COLORS } from "#/lib/types";
import { cn } from "#/lib/utils";

interface HabitListProps {
	habits: Habit[];
	completedHabits: string[];
	onToggle: (habitId: string) => void;
	onAdd: (name: string, color: string) => void;
	onUpdate: (id: string, name: string, color: string) => void;
	onDelete: (habitId: string) => void;
	readOnly?: boolean;
	snapshot?: HabitSnapshot[];
}

export function HabitList({
	habits,
	completedHabits,
	onToggle,
	onAdd,
	onUpdate,
	onDelete,
	readOnly,
	snapshot,
}: HabitListProps) {
	const [adding, setAdding] = useState(false);
	const [newName, setNewName] = useState("");
	const [newColor, setNewColor] = useState<string>(HABIT_COLORS[0]);
	const [editingId, setEditingId] = useState<string>();
	const [editName, setEditName] = useState("");
	const [editColor, setEditColor] = useState<string>(HABIT_COLORS[0]);

	function startAdding() {
		const nextColor = HABIT_COLORS[habits.length % HABIT_COLORS.length];
		setNewColor(nextColor);
		setAdding(true);
	}

	function handleAdd() {
		const name = newName.trim();
		if (!name) return;
		onAdd(name, newColor);
		setNewName("");
		setAdding(false);
	}

	function startEditing(habit: Habit) {
		setEditingId(habit.id);
		setEditName(habit.name);
		setEditColor(habit.color);
	}

	function saveEdit() {
		const name = editName.trim();
		if (!name || !editingId) return;
		onUpdate(editingId, name, editColor);
		setEditingId(undefined);
	}

	function cancelEdit() {
		setEditingId(undefined);
	}

	// Finished mode with snapshot
	if (readOnly && snapshot) {
		if (snapshot.length === 0) {
			return (
				<p className="diary-title text-base text-[var(--ink-faint)]">
					No habits completed this day.
				</p>
			);
		}
		return (
			<div className="space-y-2">
				{snapshot.map((h, i) => (
					<div key={i} className="flex items-center gap-3">
						<span
							className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 text-white"
							style={{
								borderColor: h.color,
								backgroundColor: h.color,
							}}
						>
							<svg
								className="h-3 w-3"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={3}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</span>
						<span className="diary-title text-base text-[var(--ink)]">
							{h.name}
						</span>
					</div>
				))}
			</div>
		);
	}

	// Fallback readOnly without snapshot
	const visibleHabits = readOnly
		? habits.filter((h) => completedHabits.includes(h.id))
		: habits;

	if (readOnly && visibleHabits.length === 0) {
		return (
			<p className="diary-title text-base text-[var(--ink-faint)]">
				No habits completed this day.
			</p>
		);
	}

	return (
		<div className="space-y-2">
			{visibleHabits.map((habit) => {
				const done = completedHabits.includes(habit.id);
				const isEditing = editingId === habit.id;

				if (isEditing) {
					return (
						<div key={habit.id} className="flex items-center gap-2">
							<ColorPicker value={editColor} onChange={setEditColor} />
							<input
								autoFocus
								value={editName}
								onChange={(e) => setEditName(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") saveEdit();
									if (e.key === "Escape") cancelEdit();
								}}
								className="diary-title flex-1 rounded border border-[var(--dash-color)] bg-transparent px-2 py-1 text-base text-[var(--ink)] outline-none focus:border-[var(--accent-soft)]"
							/>
							<button
								type="button"
								onClick={saveEdit}
								disabled={!editName.trim()}
								className="rounded p-1.5 text-[var(--accent-vivid)] transition hover:bg-[var(--accent-bg)] disabled:opacity-40"
							>
								<Check className="h-4 w-4" />
							</button>
							<button
								type="button"
								onClick={cancelEdit}
								className="rounded p-1.5 text-[var(--ink-faint)] transition hover:text-red-500"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
					);
				}

				return (
					<div key={habit.id} className="group flex items-center gap-3">
						<button
							type="button"
							onClick={(e) => {
								if (readOnly) return;
								const rect = e.currentTarget.getBoundingClientRect();
								if (done) {
									effectHabitUndo(rect);
									playHabitUndo();
								} else {
									effectHabitComplete(rect);
									playHabitComplete();
								}
								onToggle(habit.id);
							}}
							className={cn(
								"habit-checkbox flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition",
								!done && "border-[var(--dash-color)]",
								readOnly && "pointer-events-none",
							)}
							style={
								done
									? {
											borderColor: habit.color,
											backgroundColor: habit.color,
											color: "white",
										}
									: ({
											"--habit-color": habit.color,
										} as React.CSSProperties)
							}
						>
							{done && (
								<svg
									className="h-3 w-3"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={3}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							)}
						</button>
						<span
							className={cn(
								"diary-title text-base",
								done ? "text-[var(--ink-faint)]" : "text-[var(--ink)]",
							)}
						>
							{habit.name}
						</span>
						{!readOnly && (
							<div className="ml-auto hidden items-center gap-1 group-hover:flex">
								<button
									type="button"
									onClick={() => startEditing(habit)}
									className="rounded p-1 text-[var(--ink-faint)] transition hover:bg-[var(--accent-bg)] hover:text-[var(--accent-vivid)]"
								>
									<Pencil className="h-3.5 w-3.5" />
								</button>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<button
											type="button"
											className="rounded p-1 text-[var(--ink-faint)] transition hover:text-red-500"
										>
											<X className="h-3.5 w-3.5" />
										</button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>
												Delete "{habit.name}"?
											</AlertDialogTitle>
											<AlertDialogDescription>
												This habit will be permanently removed.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction
												onClick={() => onDelete(habit.id)}
											>
												Delete
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						)}
					</div>
				);
			})}

			{!readOnly &&
				(adding ? (
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleAdd();
						}}
						className="flex items-center gap-2"
					>
						<ColorPicker value={newColor} onChange={setNewColor} />
						<input
							autoFocus
							value={newName}
							onChange={(e) => setNewName(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Escape") setAdding(false);
							}}
							placeholder="New habit..."
							className="diary-title flex-1 rounded border border-[var(--dash-color)] bg-transparent px-2 py-1 text-base text-[var(--ink)] placeholder:text-[var(--ink-faint)] outline-none focus:border-[var(--accent-soft)]"
						/>
						<button
							type="submit"
							disabled={!newName.trim()}
							className="rounded p-1.5 text-[var(--accent-vivid)] transition hover:bg-[var(--accent-bg)] disabled:opacity-40"
						>
							<Check className="h-4 w-4" />
						</button>
						<button
							type="button"
							onClick={() => {
								setAdding(false);
								setNewName("");
							}}
							className="rounded p-1.5 text-[var(--ink-faint)] transition hover:text-red-500"
						>
							<X className="h-4 w-4" />
						</button>
					</form>
				) : (
					<button
						type="button"
						onClick={startAdding}
						className="flex items-center gap-2 text-[var(--ink-faint)] transition hover:text-[var(--accent-vivid)]"
					>
						<Plus className="h-4 w-4" />
						<span className="diary-title text-sm">Add habit</span>
					</button>
				))}
		</div>
	);
}
