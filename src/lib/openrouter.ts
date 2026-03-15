import OpenAI from "openai";

export async function generateStampImage(
	description: string,
	context: string,
	apiKey: string,
): Promise<string | undefined> {
	if (!apiKey) return undefined;

	const client = new OpenAI({
		baseURL: "https://openrouter.ai/api/v1",
		apiKey,
		dangerouslyAllowBrowser: true,
	});

	const prompt = `Create a cute, minimal, flat-style sticker icon for a diary activity stamp. The activity is: "${description}". ${context ? `Additional context: ${context}.` : ""} Style: soft pastel colors, simple shapes, white background, no text, kawaii aesthetic.`;

	const response = await client.images.generate({
		model: "google/gemini-2.0-flash-exp",
		prompt,
		n: 1,
		size: "256x256",
	});

	return (response.data?.[0]?.url ?? response.data?.[0]?.b64_json)
		? `data:image/png;base64,${response.data[0].b64_json}`
		: undefined;
}
