interface Particle {
	x: number;
	y: number;
	char: string;
	color: string;
	size: number;
	dx: number;
	dy: number;
	life: number;
	rotation: number;
	dr: number;
}

function spawnParticles(
	_rect: DOMRect,
	particles: Omit<Particle, "x" | "y">[],
	duration = 1200,
) {
	const container = document.createElement("div");
	container.style.cssText =
		"position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;overflow:hidden";
	document.body.appendChild(container);

	// Spawn from random positions across the top half of the screen
	const vw = window.innerWidth;
	const vh = window.innerHeight;

	const els = particles.map((p) => {
		const sx = randRange(vw * 0.1, vw * 0.9);
		const sy = randRange(vh * 0.1, vh * 0.5);
		const el = document.createElement("div");
		el.textContent = p.char;
		el.style.cssText = `position:absolute;left:${sx}px;top:${sy}px;color:${p.color};font-size:${p.size}px;pointer-events:none;will-change:transform,opacity;`;
		container.appendChild(el);
		return { el, ...p, x: sx, y: sy, ox: sx, oy: sy };
	});

	const start = performance.now();

	function animate(now: number) {
		const elapsed = now - start;
		const progress = elapsed / duration;

		if (progress >= 1) {
			container.remove();
			return;
		}

		for (const p of els) {
			p.x += p.dx;
			p.y += p.dy;
			p.dy += 0.12;
			p.rotation += p.dr;
			const opacity = Math.max(0, 1 - progress * 1.2);
			const scale = 1 - progress * 0.3;
			p.el.style.transform = `translate(-50%, -50%) translate(${p.x - p.ox}px, ${p.y - p.oy}px) rotate(${p.rotation}deg) scale(${scale})`;
			p.el.style.opacity = String(opacity);
		}

		requestAnimationFrame(animate);
	}

	requestAnimationFrame(animate);
}

function randRange(min: number, max: number) {
	return min + Math.random() * (max - min);
}

function makeParticles(
	count: number,
	chars: string[],
	colors: string[],
	speed = 3,
	size = 18,
): Omit<Particle, "x" | "y">[] {
	return Array.from({ length: count }, () => {
		const angle = Math.random() * Math.PI * 2;
		const v = randRange(speed * 0.5, speed * 1.5);
		return {
			char: chars[Math.floor(Math.random() * chars.length)],
			color: colors[Math.floor(Math.random() * colors.length)],
			size: randRange(size * 0.7, size * 1.3),
			dx: Math.cos(angle) * v,
			dy: Math.sin(angle) * v - randRange(1, 3),
			life: 1,
			rotation: randRange(-30, 30),
			dr: randRange(-5, 5),
		};
	});
}

// ── Weather effects ──────────────────────────────────────────────────────────

export function effectSunny(rect: DOMRect) {
	spawnParticles(
		rect,
		makeParticles(
			24,
			["☀", "✦", "✧", "·", "★"],
			["#f59e0b", "#fbbf24", "#fcd34d", "#fde68a"],
			5,
			22,
		),
		1600,
	);
}

export function effectNeutral(rect: DOMRect) {
	spawnParticles(
		rect,
		makeParticles(
			12,
			["☁", "·", "○", "◦"],
			["#a8a29e", "#d6d3d1", "#78716c"],
			3,
			18,
		),
		1200,
	);
}

export function effectCold(rect: DOMRect) {
	const particles = makeParticles(
		25,
		["❄", "❅", "❆", "·", "✧"],
		["#93c5fd", "#bfdbfe", "#dbeafe", "#60a5fa"],
		3.5,
		20,
	);
	// Snowflakes float down
	for (const p of particles) {
		p.dy = randRange(0.5, 2);
		p.dx = randRange(-1.5, 1.5);
	}
	spawnParticles(rect, particles, 1800);
}

export function effectLightning(rect: DOMRect) {
	spawnParticles(
		rect,
		makeParticles(
			20,
			["⚡", "✦", "·", "★"],
			["#eab308", "#facc15", "#fefce8", "#fbbf24"],
			6,
			22,
		),
		1000,
	);
}

export function effectWindy(rect: DOMRect) {
	const particles = makeParticles(
		20,
		["~", "≈", "♪", "·", "〰"],
		["#a8a29e", "#78716c", "#d6d3d1"],
		5,
		18,
	);
	// Wind blows right
	for (const p of particles) {
		p.dx = randRange(2, 6);
		p.dy = randRange(-1, 1);
	}
	spawnParticles(rect, particles, 1200);
}

export function effectRainy(rect: DOMRect) {
	const particles = makeParticles(
		28,
		["💧", "·", "•", "。", "˙"],
		["#60a5fa", "#93c5fd", "#3b82f6", "#bfdbfe"],
		2.5,
		16,
	);
	// Raindrops fall down
	for (const p of particles) {
		p.dy = randRange(2, 5);
		p.dx = randRange(-0.5, 0.5);
	}
	spawnParticles(rect, particles, 1400);
}

// ── Mood effects ─────────────────────────────────────────────────────────────

export function effectHappy(rect: DOMRect) {
	const particles = makeParticles(
		22,
		["♥", "♡", "✦", "·", "★"],
		["#f472b6", "#ec4899", "#fb7185", "#fda4af"],
		4,
		20,
	);
	// Hearts float upward
	for (const p of particles) {
		p.dy = randRange(-4, -1);
	}
	spawnParticles(rect, particles, 1400);
}

export function effectMoodNeutral(rect: DOMRect) {
	spawnParticles(
		rect,
		makeParticles(
			10,
			["·", "○", "◦", "•"],
			["#a8a29e", "#d6d3d1", "#78716c"],
			2,
			14,
		),
		1000,
	);
}

export function effectSad(rect: DOMRect) {
	const particles = makeParticles(
		18,
		["💧", "·", "。", "˙"],
		["#93c5fd", "#60a5fa", "#bfdbfe"],
		2.5,
		18,
	);
	for (const p of particles) {
		p.dy = randRange(1, 4);
		p.dx = randRange(-1, 1);
	}
	spawnParticles(rect, particles, 1600);
}

export function effectAngry(rect: DOMRect) {
	spawnParticles(
		rect,
		makeParticles(
			20,
			["💢", "✦", "·", "!", "★"],
			["#ef4444", "#f87171", "#dc2626", "#fca5a5"],
			6,
			20,
		),
		1000,
	);
}

export function effectAnxious(rect: DOMRect) {
	const particles = makeParticles(
		20,
		["·", "•", "○", "~", "?"],
		["#a78bfa", "#8b5cf6", "#c4b5fd", "#7c3aed"],
		4,
		14,
	);
	// Jittery random directions
	for (const p of particles) {
		p.dr = randRange(-15, 15);
	}
	spawnParticles(rect, particles, 1000);
}

export function effectOverwhelmed(rect: DOMRect) {
	spawnParticles(
		rect,
		makeParticles(
			30,
			["✦", "·", "•", "○", "~", "!", "★", "◆"],
			["#a78bfa", "#f472b6", "#fbbf24", "#60a5fa", "#ef4444", "#34d399"],
			6,
			18,
		),
		1400,
	);
}

// ── Money effects (scales with amount) ────────────────────────────────────────

function effectMoney(rect: DOMRect, intensity: number) {
	const count = 8 + intensity * 5;
	spawnParticles(
		rect,
		makeParticles(
			count,
			["💰", "💵", "$", "€", "✦", "·"],
			["#16a34a", "#22c55e", "#4ade80", "#86efac", "#166534"],
			2 + intensity * 1.5,
			14 + intensity * 2,
		),
		800 + intensity * 200,
	);
}

export const moneyEffects: Record<string, (r: DOMRect) => void> = {
	"1-3": (r) => effectMoney(r, 0),
	"3-5": (r) => effectMoney(r, 1),
	"5-10": (r) => effectMoney(r, 2),
	"15-20": (r) => effectMoney(r, 3),
	"20-30": (r) => effectMoney(r, 4),
	"30+": (r) => effectMoney(r, 5),
};

// ── Steps effects (sneakers, more = more energetic) ──────────────────────────

function effectSteps(rect: DOMRect, intensity: number) {
	const count = 8 + intensity * 4;
	spawnParticles(
		rect,
		makeParticles(
			count,
			["👟", "👣", "✦", "·", "★"],
			["#f97316", "#fb923c", "#fdba74", "#ea580c", "#c2410c"],
			2 + intensity * 1.2,
			14 + intensity * 2,
		),
		800 + intensity * 150,
	);
}

export const stepsEffects: Record<string, (r: DOMRect) => void> = {
	"0-1k": (r) => effectSteps(r, 0),
	"1-3k": (r) => effectSteps(r, 1),
	"3-5k": (r) => effectSteps(r, 2),
	"5-10k": (r) => effectSteps(r, 3),
	"10-20k": (r) => effectSteps(r, 4),
	"20k+": (r) => effectSteps(r, 5),
};

// ── Sleep effects (moons & stars, more restful = more dreamy) ────────────────

function effectSleep(rect: DOMRect, intensity: number) {
	const count = 8 + intensity * 4;
	const particles = makeParticles(
		count,
		["🌙", "⭐", "✧", "·", "💤"],
		["#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe", "#312e81"],
		2 + intensity * 0.8,
		14 + intensity * 2,
	);
	// Float upward dreamily
	for (const p of particles) {
		p.dy = randRange(-3, -0.5);
		p.dx = randRange(-1.5, 1.5);
	}
	spawnParticles(rect, particles, 1200 + intensity * 200);
}

export const sleepEffects: Record<string, (r: DOMRect) => void> = {
	"0-4": (r) => effectSleep(r, 0),
	"4-6": (r) => effectSleep(r, 1),
	"6-7": (r) => effectSleep(r, 2),
	"7-8": (r) => effectSleep(r, 3),
	"8-9": (r) => effectSleep(r, 4),
	"10+": (r) => effectSleep(r, 5),
};

// ── Self-care effects (sparkles & flowers, more = more blissful) ─────────────

function effectSelfCare(rect: DOMRect, intensity: number) {
	const count = 8 + intensity * 4;
	const particles = makeParticles(
		count,
		["✨", "🌸", "💫", "·", "♡", "✧"],
		["#ec4899", "#f472b6", "#fda4af", "#fce7f3", "#be185d"],
		2 + intensity * 1,
		14 + intensity * 2,
	);
	for (const p of particles) {
		p.dy = randRange(-3, -0.5);
	}
	spawnParticles(rect, particles, 1000 + intensity * 200);
}

export const selfCareEffects: Record<string, (r: DOMRect) => void> = {
	"0-3": (r) => effectSelfCare(r, 0),
	"3-5": (r) => effectSelfCare(r, 1),
	"5-10": (r) => effectSelfCare(r, 2),
	"10-15": (r) => effectSelfCare(r, 3),
	"15-30": (r) => effectSelfCare(r, 4),
	"30+": (r) => effectSelfCare(r, 5),
};

// ── Generic select effect ────────────────────────────────────────────────────

export function effectSelect(rect: DOMRect) {
	spawnParticles(
		rect,
		makeParticles(
			12,
			["✦", "·", "★", "•"],
			["#c47b6b", "#d4a292", "#b8513d"],
			3,
			14,
		),
		900,
	);
}

// ── Confetti (full screen) ────────────────────────────────────────────────────

export function effectConfetti() {
	const container = document.createElement("div");
	container.style.cssText =
		"position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;overflow:hidden";
	document.body.appendChild(container);

	const chars = ["🎉", "✦", "♥", "✧", "·", "★", "●", "◆"];
	const colors = [
		"#f472b6",
		"#fbbf24",
		"#34d399",
		"#60a5fa",
		"#a78bfa",
		"#fb7185",
		"#f59e0b",
		"#c47b6b",
	];

	const particles: {
		el: HTMLElement;
		x: number;
		y: number;
		dx: number;
		dy: number;
		rotation: number;
		dr: number;
	}[] = [];

	for (let i = 0; i < 40; i++) {
		const el = document.createElement("div");
		const x = randRange(window.innerWidth * 0.15, window.innerWidth * 0.85);
		const y = -randRange(20, 60);
		el.textContent = chars[Math.floor(Math.random() * chars.length)];
		el.style.cssText = `position:absolute;left:${x}px;top:${y}px;font-size:${randRange(14, 26)}px;color:${colors[Math.floor(Math.random() * colors.length)]};pointer-events:none;will-change:transform,opacity;`;
		container.appendChild(el);
		particles.push({
			el,
			x,
			y,
			dx: randRange(-2, 2),
			dy: randRange(2, 6),
			rotation: randRange(-20, 20),
			dr: randRange(-8, 8),
		});
	}

	const start = performance.now();
	const duration = 2500;

	function animate(now: number) {
		const elapsed = now - start;
		const progress = elapsed / duration;

		if (progress >= 1) {
			container.remove();
			return;
		}

		for (const p of particles) {
			p.x += p.dx;
			p.y += p.dy;
			p.dx *= 0.99;
			p.dy += 0.08;
			p.rotation += p.dr;
			const opacity =
				progress > 0.7 ? Math.max(0, 1 - (progress - 0.7) / 0.3) : 1;
			p.el.style.transform = `translate(${p.x - Number.parseFloat(p.el.style.left)}px, ${p.y - Number.parseFloat(p.el.style.top)}px) rotate(${p.rotation}deg)`;
			p.el.style.opacity = String(opacity);
		}

		requestAnimationFrame(animate);
	}

	requestAnimationFrame(animate);
}

// ── Maps ─────────────────────────────────────────────────────────────────────

export const weatherEffects: Record<string, (r: DOMRect) => void> = {
	sunny: effectSunny,
	neutral: effectNeutral,
	cold: effectCold,
	lightning: effectLightning,
	windy: effectWindy,
	rainy: effectRainy,
};

export const moodEffects: Record<string, (r: DOMRect) => void> = {
	happy: effectHappy,
	neutral: effectMoodNeutral,
	sad: effectSad,
	angry: effectAngry,
	anxious: effectAnxious,
	overwhelmed: effectOverwhelmed,
};
