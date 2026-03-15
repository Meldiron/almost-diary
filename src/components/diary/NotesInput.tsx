import { useEffect, useRef, useState } from "react";

interface NotesInputProps {
	value?: string;
	onChange: (value: string) => void;
}

export function NotesInput({ value = "", onChange }: NotesInputProps) {
	const [local, setLocal] = useState(value);
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

	useEffect(() => {
		setLocal(value);
	}, [value]);

	function handleChange(v: string) {
		setLocal(v);
		clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => onChange(v), 400);
	}

	return (
		<textarea
			placeholder="Write your thoughts..."
			value={local}
			onChange={(e) => handleChange(e.target.value)}
			rows={3}
			className="diary-title w-full resize-none border-2 border-dashed border-[var(--dash-color)] rounded-lg bg-transparent px-3 py-2.5 text-lg text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:border-[var(--accent)] focus:outline-none"
		/>
	);
}
