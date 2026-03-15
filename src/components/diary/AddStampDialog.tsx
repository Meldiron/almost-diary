import { Loader2, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { generateStampImage } from "#/lib/openrouter";

interface AddStampDialogProps {
	apiKey: string;
	onAdd: (description: string, imageUrl?: string) => void;
}

export function AddStampDialog({ apiKey, onAdd }: AddStampDialogProps) {
	const [open, setOpen] = useState(false);
	const [description, setDescription] = useState("");
	const [context, setContext] = useState("");
	const [imageUrl, setImageUrl] = useState<string>();
	const [generating, setGenerating] = useState(false);
	const [error, setError] = useState("");

	function reset() {
		setDescription("");
		setContext("");
		setImageUrl(undefined);
		setGenerating(false);
		setError("");
	}

	async function handleGenerate() {
		if (!description.trim()) return;
		setGenerating(true);
		setError("");
		try {
			const url = await generateStampImage(
				description.trim(),
				context.trim(),
				apiKey,
			);
			if (url) setImageUrl(url);
			else setError("No image returned. You can still add the stamp.");
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to generate image");
		} finally {
			setGenerating(false);
		}
	}

	function handleAdd() {
		if (!description.trim()) return;
		onAdd(description.trim(), imageUrl);
		reset();
		setOpen(false);
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => {
				setOpen(v);
				if (!v) reset();
			}}
		>
			<DialogTrigger asChild>
				<button
					type="button"
					className="flex h-18 w-18 items-center justify-center rounded-xl border-2 border-dashed border-[var(--dash-color)] text-[var(--ink-faint)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
				>
					<Plus className="h-7 w-7" />
				</button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="diary-title text-2xl">
						New Activity Stamp
					</DialogTitle>
					<DialogDescription>
						Add a new activity to track in your diary.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-5 pt-2">
					<div className="space-y-2">
						<label htmlFor="stamp-desc" className="text-sm font-medium">
							Description
						</label>
						<Input
							id="stamp-desc"
							placeholder="e.g., Go for a walk"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<label htmlFor="stamp-context" className="text-sm font-medium">
							Extra context for AI image{" "}
							<span className="text-muted-foreground">(optional)</span>
						</label>
						<Textarea
							id="stamp-context"
							placeholder="e.g., walking in a park with trees"
							value={context}
							onChange={(e) => setContext(e.target.value)}
							rows={2}
						/>
					</div>

					{apiKey && (
						<Button
							variant="outline"
							onClick={handleGenerate}
							disabled={!description.trim() || generating}
							className="gap-2"
						>
							{generating ? (
								<Loader2 className="h-5 w-5 animate-spin" />
							) : (
								<Sparkles className="h-5 w-5" />
							)}
							Generate Image
						</Button>
					)}

					{imageUrl && (
						<div className="flex justify-center">
							<img
								src={imageUrl}
								alt="Generated stamp"
								className="h-24 w-24 rounded-xl border-2 border-dashed border-[var(--dash-color)] object-cover"
							/>
						</div>
					)}

					{error && <p className="text-sm text-red-500">{error}</p>}

					<div className="flex justify-end gap-3 pt-2">
						<Button
							variant="ghost"
							onClick={() => {
								reset();
								setOpen(false);
							}}
						>
							Cancel
						</Button>
						<Button onClick={handleAdd} disabled={!description.trim()}>
							Add Stamp
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
