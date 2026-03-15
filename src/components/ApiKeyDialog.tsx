import { Settings } from "lucide-react";
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
import { useLocalStorage } from "#/hooks/useLocalStorage";

export function ApiKeyDialog() {
	const [apiKey, setApiKey] = useLocalStorage("diary-openrouter-key", "");
	const [open, setOpen] = useState(false);
	const [local, setLocal] = useState(apiKey);

	function handleSave() {
		setApiKey(local.trim());
		setOpen(false);
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => {
				setOpen(v);
				if (v) setLocal(apiKey);
			}}
		>
			<DialogTrigger asChild>
				<button
					type="button"
					className="rounded-lg p-2 text-[var(--ink-soft)] transition hover:bg-[var(--accent-bg)] hover:text-[var(--ink)]"
				>
					<Settings className="h-5 w-5" />
					<span className="sr-only">Settings</span>
				</button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>
						Configure your OpenRouter API key for AI-generated stamp images.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 pt-2">
					<div className="space-y-2">
						<label htmlFor="api-key" className="text-sm font-medium">
							OpenRouter API Key
						</label>
						<Input
							id="api-key"
							type="password"
							placeholder="sk-or-..."
							value={local}
							onChange={(e) => setLocal(e.target.value)}
						/>
						<p className="text-xs text-muted-foreground">
							Get your key at{" "}
							<a
								href="https://openrouter.ai/keys"
								target="_blank"
								rel="noreferrer"
								className="underline"
							>
								openrouter.ai/keys
							</a>
						</p>
					</div>
					<div className="flex justify-end gap-2">
						<Button variant="ghost" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleSave}>Save</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
