interface ImageChoice {
	message: {
		content?: string;
		images?: Array<{
			image_url: {
				url: string;
			};
		}>;
	};
}

interface ImageResponse {
	choices?: ImageChoice[];
	error?: { message: string };
}

export async function generateStampImage(
	description: string,
	context: string,
	apiKey: string,
): Promise<string | undefined> {
	if (!apiKey) return undefined;

	// Each badge gets a unique visual identity by varying the object/symbol
	const prompt = `Generate an image of an achievement badge for a personal diary app, similar to Duolingo streak badges or Apple Health achievement medals.

The achievement is: "${description}". ${context ? `Additional context: ${context}.` : ""}

Design requirements:
- Circular or shield-shaped medal/badge design
- A single bold iconic symbol in the center representing the activity
- Soft gradient background within the badge (use warm pastel tones like peach, lavender, mint, coral, or sky blue — pick one that fits the activity)
- Subtle metallic or glossy rim/border around the badge edge
- Clean, modern, flat illustration style — NOT 3D, NOT photorealistic
- Absolutely NO text, NO letters, NO words, NO labels anywhere
- Transparent background outside the badge (PNG alpha)
- Tightly cropped to the badge with zero padding
- Each badge should feel unique through its color palette and central symbol — make it feel like a collectible reward`;

	const response = await fetch(
		"https://openrouter.ai/api/v1/chat/completions",
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: "google/gemini-3.1-flash-image-preview",
				messages: [{ role: "user", content: prompt }],
				modalities: ["text", "image"],
			}),
		},
	);

	if (!response.ok) {
		const text = await response.text();
		throw new Error(`OpenRouter API error: ${response.status} ${text}`);
	}

	const data: ImageResponse = await response.json();

	if (data.error) {
		throw new Error(data.error.message);
	}

	const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
	return imageUrl;
}
