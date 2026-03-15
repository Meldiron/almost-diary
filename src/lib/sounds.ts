let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
	if (!audioCtx) audioCtx = new AudioContext();
	if (audioCtx.state === "suspended") audioCtx.resume();
	return audioCtx;
}

function playTone(
	freq: number,
	duration: number,
	type: OscillatorType = "sine",
	volume = 0.15,
	delay = 0,
) {
	const ctx = getCtx();
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.type = type;
	osc.frequency.value = freq;
	gain.gain.setValueAtTime(0, ctx.currentTime + delay);
	gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.02);
	gain.gain.exponentialRampToValueAtTime(
		0.001,
		ctx.currentTime + delay + duration,
	);
	osc.connect(gain);
	gain.connect(ctx.destination);
	osc.start(ctx.currentTime + delay);
	osc.stop(ctx.currentTime + delay + duration);
}

function playNoise(duration: number, volume = 0.08, filterFreq?: number) {
	const ctx = getCtx();
	const bufferSize = ctx.sampleRate * duration;
	const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < bufferSize; i++) {
		data[i] = Math.random() * 2 - 1;
	}
	const source = ctx.createBufferSource();
	source.buffer = buffer;
	const gain = ctx.createGain();
	gain.gain.setValueAtTime(volume, ctx.currentTime);
	gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

	if (filterFreq) {
		const filter = ctx.createBiquadFilter();
		filter.type = "lowpass";
		filter.frequency.value = filterFreq;
		source.connect(filter);
		filter.connect(gain);
	} else {
		source.connect(gain);
	}

	gain.connect(ctx.destination);
	source.start();
}

// ── Weather sounds ───────────────────────────────────────────────────────────

export function playSunny() {
	playTone(523, 0.3, "sine", 0.12);
	playTone(659, 0.3, "sine", 0.1, 0.08);
	playTone(784, 0.4, "sine", 0.08, 0.16);
}

export function playNeutral() {
	playTone(392, 0.4, "triangle", 0.08);
}

export function playCold() {
	playTone(1200, 0.15, "sine", 0.06);
	playTone(1600, 0.15, "sine", 0.05, 0.1);
	playTone(2000, 0.2, "sine", 0.04, 0.2);
}

export function playLightning() {
	playNoise(0.12, 0.2);
	playTone(80, 0.3, "sawtooth", 0.15, 0.05);
	playNoise(0.08, 0.1);
}

export function playWindy() {
	const ctx = getCtx();
	const bufferSize = ctx.sampleRate * 0.8;
	const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < bufferSize; i++) {
		data[i] = Math.random() * 2 - 1;
	}
	const source = ctx.createBufferSource();
	source.buffer = buffer;
	const filter = ctx.createBiquadFilter();
	filter.type = "bandpass";
	filter.frequency.value = 600;
	filter.Q.value = 2;
	filter.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.4);
	filter.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.8);
	const gain = ctx.createGain();
	gain.gain.setValueAtTime(0.1, ctx.currentTime);
	gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
	source.connect(filter);
	filter.connect(gain);
	gain.connect(ctx.destination);
	source.start();
}

export function playRainy() {
	for (let i = 0; i < 6; i++) {
		const delay = Math.random() * 0.3;
		playNoise(0.08, 0.04 + Math.random() * 0.03, 3000 + Math.random() * 2000);
		playTone(2000 + Math.random() * 1000, 0.05, "sine", 0.02, delay);
	}
	playNoise(0.5, 0.06, 2000);
}

// ── Mood sounds ──────────────────────────────────────────────────────────────

export function playHappy() {
	playTone(523, 0.2, "sine", 0.1);
	playTone(659, 0.2, "sine", 0.1, 0.1);
	playTone(784, 0.3, "sine", 0.1, 0.2);
	playTone(1047, 0.4, "sine", 0.08, 0.3);
}

export function playMoodNeutral() {
	playTone(440, 0.4, "triangle", 0.08);
}

export function playSad() {
	playTone(330, 0.5, "sine", 0.1);
	playTone(311, 0.5, "sine", 0.08, 0.25);
}

export function playAngry() {
	playTone(150, 0.15, "sawtooth", 0.12);
	playTone(120, 0.15, "sawtooth", 0.1, 0.1);
	playNoise(0.1, 0.08);
}

export function playAnxious() {
	for (let i = 0; i < 4; i++) {
		playTone(600, 0.08, "sine", 0.06, i * 0.12);
		playTone(650, 0.08, "sine", 0.06, i * 0.12 + 0.06);
	}
}

export function playOverwhelmed() {
	playNoise(0.3, 0.06, 1500);
	playTone(200, 0.4, "sawtooth", 0.06);
	playTone(250, 0.4, "sawtooth", 0.05, 0.05);
	playTone(300, 0.4, "sawtooth", 0.04, 0.1);
}

// ── Money sounds (scales with amount) ─────────────────────────────────────────

function playMoney(intensity: number) {
	const baseFreq = 400 + intensity * 80;
	const count = 1 + intensity;
	for (let i = 0; i < count; i++) {
		playTone(
			baseFreq + i * 120,
			0.15,
			"sine",
			0.06 + intensity * 0.01,
			i * 0.06,
		);
	}
	if (intensity >= 3) {
		playTone(1200, 0.3, "sine", 0.04, count * 0.06);
	}
}

export const moneySounds: Record<string, () => void> = {
	"1-3": () => playMoney(0),
	"3-5": () => playMoney(1),
	"5-10": () => playMoney(2),
	"15-20": () => playMoney(3),
	"20-30": () => playMoney(4),
	"30+": () => playMoney(5),
};

// ── Steps sounds (rhythmic taps, more energetic with more steps) ──────────────

function playSteps(intensity: number) {
	const count = 2 + intensity;
	for (let i = 0; i < count; i++) {
		playTone(300 + intensity * 40, 0.06, "triangle", 0.08, i * 0.08);
		playTone(500 + intensity * 40, 0.06, "triangle", 0.06, i * 0.08 + 0.04);
	}
}

export const stepsSounds: Record<string, () => void> = {
	"0-1k": () => playSteps(0),
	"1-3k": () => playSteps(1),
	"3-5k": () => playSteps(2),
	"5-10k": () => playSteps(3),
	"10-20k": () => playSteps(4),
	"20k+": () => playSteps(5),
};

// ── Sleep sounds (gentle lullaby tones, more restful = more harmonious) ──────

function playSleep(intensity: number) {
	const baseFreq = 220;
	playTone(baseFreq, 0.5, "sine", 0.06);
	if (intensity >= 1) playTone(baseFreq * 1.25, 0.5, "sine", 0.05, 0.15);
	if (intensity >= 2) playTone(baseFreq * 1.5, 0.5, "sine", 0.04, 0.3);
	if (intensity >= 4) playTone(baseFreq * 2, 0.6, "sine", 0.03, 0.45);
}

export const sleepSounds: Record<string, () => void> = {
	"0-4": () => playSleep(0),
	"4-6": () => playSleep(1),
	"6-7": () => playSleep(2),
	"7-8": () => playSleep(3),
	"8-9": () => playSleep(4),
	"10+": () => playSleep(5),
};

// ── Self-care sounds (sparkly chimes, more blissful) ─────────────────────────

function playSelfCare(intensity: number) {
	const notes = [659, 784, 880, 988, 1047, 1175];
	const count = 2 + intensity;
	for (let i = 0; i < count && i < notes.length; i++) {
		playTone(notes[i], 0.25, "sine", 0.05, i * 0.1);
	}
}

export const selfCareSounds: Record<string, () => void> = {
	"0-3": () => playSelfCare(0),
	"3-5": () => playSelfCare(1),
	"5-10": () => playSelfCare(2),
	"10-15": () => playSelfCare(3),
	"15-30": () => playSelfCare(4),
	"30+": () => playSelfCare(5),
};

// ── Generic select sound ─────────────────────────────────────────────────────

export function playSelect() {
	playTone(880, 0.12, "sine", 0.08);
	playTone(1100, 0.15, "sine", 0.06, 0.05);
}

// ── Confetti sound ───────────────────────────────────────────────────────────

export function playConfetti() {
	// Rising arpeggio + shimmer
	const notes = [523, 659, 784, 1047, 1319];
	for (let i = 0; i < notes.length; i++) {
		playTone(notes[i], 0.25, "sine", 0.08, i * 0.07);
	}
	playTone(1568, 0.5, "sine", 0.06, 0.4);
	playNoise(0.15, 0.04, 4000);
}

// ── Sound map ────────────────────────────────────────────────────────────────

export const weatherSounds: Record<string, () => void> = {
	sunny: playSunny,
	neutral: playNeutral,
	cold: playCold,
	lightning: playLightning,
	windy: playWindy,
	rainy: playRainy,
};

export const moodSounds: Record<string, () => void> = {
	happy: playHappy,
	neutral: playMoodNeutral,
	sad: playSad,
	angry: playAngry,
	anxious: playAnxious,
	overwhelmed: playOverwhelmed,
};
