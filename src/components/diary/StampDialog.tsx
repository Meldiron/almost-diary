import { Crop, ImageUp, Loader2, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Area } from "react-easy-crop";
import Cropper from "react-easy-crop";
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Slider } from "#/components/ui/slider";
import { getCroppedImage } from "#/lib/crop-image";
import { generateStampImage } from "#/lib/openrouter";
import type { Stamp } from "#/lib/types";

interface StampDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	apiKey: string;
	/** If set, we're editing this stamp. Otherwise creating new. */
	stamp?: Stamp;
	onSave: (description: string, imageUrl?: string) => void;
	onDelete?: () => void;
}

export function StampDialog({
	open,
	onOpenChange,
	apiKey,
	stamp,
	onSave,
	onDelete,
}: StampDialogProps) {
	const isEditing = !!stamp;
	const [description, setDescription] = useState("");
	const [imageUrl, setImageUrl] = useState<string>();
	const [generating, setGenerating] = useState(false);
	const [error, setError] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [genOpen, setGenOpen] = useState(false);
	const [genPrompt, setGenPrompt] = useState("");

	const [cropOpen, setCropOpen] = useState(false);
	const [cropSrc, setCropSrc] = useState<string>();
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

	// Populate fields when opening in edit mode
	useEffect(() => {
		if (open && stamp) {
			setDescription(stamp.description);
			setImageUrl(stamp.imageUrl);
		} else if (!open) {
			setDescription("");
			setImageUrl(undefined);
			setGenerating(false);
			setError("");
			setGenPrompt("");
		}
	}, [open, stamp]);

	// ── Generate ─────────────────────────────────────────────────────────

	function openGenerateDialog() {
		setGenPrompt(description);
		setGenOpen(true);
	}

	async function handleGenerate() {
		if (!genPrompt.trim()) return;
		setGenerating(true);
		setError("");
		try {
			const url = await generateStampImage(genPrompt.trim(), "", apiKey);
			if (url) {
				setImageUrl(url);
				setGenOpen(false);
			} else {
				setError("No image returned. Try again.");
			}
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to generate image");
		} finally {
			setGenerating(false);
		}
	}

	// ── Upload ───────────────────────────────────────────────────────────

	function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			setError("Please upload an image file.");
			return;
		}
		if (file.size > 2 * 1024 * 1024) {
			setError("Image must be under 2MB.");
			return;
		}
		setError("");
		const reader = new FileReader();
		reader.onload = () => setImageUrl(reader.result as string);
		reader.readAsDataURL(file);
		e.target.value = "";
	}

	// ── Crop ─────────────────────────────────────────────────────────────

	function openCropEditor() {
		if (!imageUrl) return;
		setCropSrc(imageUrl);
		setCrop({ x: 0, y: 0 });
		setZoom(1);
		setCroppedAreaPixels(undefined);
		setCropOpen(true);
	}

	const onCropDone = useCallback((_: Area, croppedPixels: Area) => {
		setCroppedAreaPixels(croppedPixels);
	}, []);

	async function applyCrop() {
		if (!cropSrc || !croppedAreaPixels) return;
		try {
			const cropped = await getCroppedImage(cropSrc, croppedAreaPixels);
			setImageUrl(cropped);
		} catch {
			setError("Failed to crop image.");
		}
		setCropOpen(false);
	}

	// ── Save ─────────────────────────────────────────────────────────────

	function handleSave() {
		if (!description.trim()) return;
		onSave(description.trim(), imageUrl);
		onOpenChange(false);
	}

	function handleDelete() {
		onDelete?.();
		onOpenChange(false);
	}

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle className="diary-title text-2xl">
							{isEditing ? "Edit Activity Stamp" : "New Activity Stamp"}
						</DialogTitle>
						<DialogDescription>
							{isEditing
								? "Update this stamp's details."
								: "Add a new activity to track in your diary."}
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

						<div className="space-y-3">
							<span className="text-sm font-medium">Image</span>
							<div className="flex flex-wrap items-center gap-2">
								{apiKey && (
									<Button
										variant="outline"
										onClick={openGenerateDialog}
										disabled={generating}
										className="gap-2"
									>
										<Sparkles className="h-5 w-5" />
										Generate
									</Button>
								)}
								<Button
									variant="outline"
									onClick={() => fileInputRef.current?.click()}
									className="gap-2"
								>
									<ImageUp className="h-5 w-5" />
									Upload
								</Button>
								{imageUrl && (
									<Button
										variant="outline"
										onClick={openCropEditor}
										className="gap-2"
									>
										<Crop className="h-5 w-5" />
										Edit
									</Button>
								)}
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									onChange={handleFileUpload}
									className="hidden"
								/>
							</div>

							{imageUrl && (
								<div className="flex justify-center">
									<div className="relative">
										<img
											src={imageUrl}
											alt="Stamp preview"
											className="h-24 w-24 rounded-xl border-2 border-dashed border-[var(--dash-color)] object-cover"
										/>
										<button
											type="button"
											onClick={() => setImageUrl(undefined)}
											className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-red-400 transition hover:bg-red-100 hover:text-red-500"
										>
											<X className="h-3.5 w-3.5" />
										</button>
									</div>
								</div>
							)}
						</div>

						{error && <p className="text-sm text-red-500">{error}</p>}

						<div className="flex items-center gap-3 pt-2">
							{isEditing && onDelete && (
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button
											variant="ghost"
											className="text-red-500 hover:bg-red-50 hover:text-red-600"
										>
											Delete
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Delete this stamp?</AlertDialogTitle>
											<AlertDialogDescription>
												This will permanently remove "{stamp?.description}" from
												your activity stamps.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction onClick={handleDelete}>
												Delete
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							)}
							<div className="ml-auto flex gap-3">
								<Button variant="ghost" onClick={() => onOpenChange(false)}>
									Cancel
								</Button>
								<Button onClick={handleSave} disabled={!description.trim()}>
									{isEditing ? "Save Stamp" : "Add Stamp"}
								</Button>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Generate dialog */}
			<Dialog open={genOpen} onOpenChange={setGenOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="diary-title text-xl">
							Generate Badge Image
						</DialogTitle>
						<DialogDescription>
							Describe what should be on the badge.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 pt-2">
						<Input
							placeholder="e.g., Running shoes for a morning jog"
							value={genPrompt}
							onChange={(e) => setGenPrompt(e.target.value)}
						/>
						{error && <p className="text-sm text-red-500">{error}</p>}
						<div className="flex justify-end gap-3">
							<Button variant="ghost" onClick={() => setGenOpen(false)}>
								Cancel
							</Button>
							<Button
								onClick={handleGenerate}
								disabled={!genPrompt.trim() || generating}
								className="gap-2"
							>
								{generating ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Sparkles className="h-4 w-4" />
								)}
								Generate
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Crop dialog */}
			<Dialog open={cropOpen} onOpenChange={setCropOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="diary-title text-xl">
							Crop Image
						</DialogTitle>
						<DialogDescription>
							Drag and zoom to crop your badge image.
						</DialogDescription>
					</DialogHeader>
					<div className="relative h-64 w-full overflow-hidden rounded-lg bg-black/5">
						{cropSrc && (
							<Cropper
								image={cropSrc}
								crop={crop}
								zoom={zoom}
								aspect={1}
								onCropChange={setCrop}
								onZoomChange={setZoom}
								onCropComplete={onCropDone}
							/>
						)}
					</div>
					<div className="flex items-center gap-3 pt-1">
						<span className="text-xs text-[var(--ink-faint)]">Zoom</span>
						<Slider
							min={1}
							max={3}
							step={0.01}
							value={[zoom]}
							onValueChange={([v]) => setZoom(v)}
							className="flex-1"
						/>
					</div>
					<div className="flex justify-end gap-3 pt-2">
						<Button variant="ghost" onClick={() => setCropOpen(false)}>
							Cancel
						</Button>
						<Button onClick={applyCrop}>Apply Crop</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
