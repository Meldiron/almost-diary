import {
	CheckCircle2,
	ImagePlus,
	Loader2,
	Palette,
	Settings,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
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
import { Input } from "#/components/ui/input";
import { useLocalStorage } from "#/hooks/useLocalStorage";
import { CustomizeDialog } from "./CustomizeDialog";

async function verifyApiKey(
	key: string,
): Promise<{ ok: boolean; error?: string }> {
	try {
		const res = await fetch("https://openrouter.ai/api/v1/auth/key", {
			headers: { Authorization: `Bearer ${key}` },
		});
		if (res.ok) return { ok: true };
		const data = await res.json().catch(() => null);
		return {
			ok: false,
			error: data?.error?.message ?? `Invalid key (${res.status})`,
		};
	} catch {
		return { ok: false, error: "Could not reach OpenRouter" };
	}
}

export function SettingsMenu() {
	const [apiKey, setApiKey] = useLocalStorage("diary-openrouter-key", "");
	const [apiOpen, setApiOpen] = useState(false);
	const [customizeOpen, setCustomizeOpen] = useState(false);
	const [localKey, setLocalKey] = useState(apiKey);
	const [verifying, setVerifying] = useState(false);
	const [verifyResult, setVerifyResult] = useState<{
		ok: boolean;
		error?: string;
	} | null>(null);

	function resetState() {
		setVerifying(false);
		setVerifyResult(null);
	}

	function handleSaveKey() {
		setApiKey(localKey.trim());
		setApiOpen(false);
		resetState();
	}

	async function handleVerify() {
		const key = localKey.trim();
		if (!key) return;
		setVerifying(true);
		setVerifyResult(null);
		const result = await verifyApiKey(key);
		setVerifyResult(result);
		setVerifying(false);
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
					<DropdownMenuItem
						onClick={() => {
							setLocalKey(apiKey);
							resetState();
							setApiOpen(true);
						}}
					>
						<ImagePlus className="mr-2 h-4 w-4" />
						Image Generation
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setCustomizeOpen(true)}>
						<Palette className="mr-2 h-4 w-4" />
						Customize Diary
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* API Key Dialog */}
			<Dialog open={apiOpen} onOpenChange={setApiOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="diary-title text-xl">
							Image Generation
						</DialogTitle>
						<DialogDescription>
							Set your OpenRouter API key to generate badge images with AI.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 pt-2">
						<div className="space-y-2">
							<div className="flex gap-2">
								<Input
									type="password"
									placeholder="sk-or-..."
									value={localKey}
									onChange={(e) => {
										setLocalKey(e.target.value);
										setVerifyResult(null);
									}}
									className="flex-1"
								/>
								<Button
									variant="outline"
									onClick={handleVerify}
									disabled={!localKey.trim() || verifying}
									className="gap-1.5 px-3"
								>
									{verifying ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										"Verify"
									)}
								</Button>
							</div>

							{verifyResult && (
								<div
									className={`flex items-center gap-1.5 text-sm ${verifyResult.ok ? "text-green-600" : "text-red-500"}`}
								>
									{verifyResult.ok ? (
										<>
											<CheckCircle2 className="h-4 w-4" />
											Key is valid
										</>
									) : (
										<>
											<XCircle className="h-4 w-4" />
											{verifyResult.error}
										</>
									)}
								</div>
							)}

							<p className="text-xs text-[var(--ink-faint)]">
								Get your key at{" "}
								<a
									href="https://openrouter.ai/keys"
									target="_blank"
									rel="noreferrer"
									className="font-medium text-[var(--ink)] underline decoration-[var(--accent)] underline-offset-2"
								>
									openrouter.ai/keys
								</a>
							</p>
						</div>
						<div className="flex justify-end gap-2">
							<Button variant="ghost" onClick={() => setApiOpen(false)}>
								Cancel
							</Button>
							<Button onClick={handleSaveKey}>Save</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Customize Dialog */}
			<CustomizeDialog open={customizeOpen} onOpenChange={setCustomizeOpen} />
		</>
	);
}
