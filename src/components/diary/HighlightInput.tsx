import { useEffect, useRef, useState } from "react";

interface HighlightInputProps {
	value?: string;
	onChange: (value: string) => void;
}

export function HighlightInput({ value = "", onChange }: HighlightInputProps) {
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
		<input
			type="text"
			placeholder="What was the best part of your day?"
			value={local}
			onChange={(e) => handleChange(e.target.value)}
			className="diary-title w-full border-b-2 border-dashed border-[var(--dash-color)] bg-transparent py-1.5 text-base text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:border-[var(--accent)] focus:outline-none"
		/>
	);
}
