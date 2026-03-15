export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="mt-16 border-t-2 border-dashed border-[var(--dash-color)] px-4 pb-8 pt-6">
			<div className="page-wrap text-center">
				<p className="diary-title m-0 text-base text-[var(--ink-faint)]">
					&copy; {year} Almost Diary
				</p>
			</div>
		</footer>
	);
}
