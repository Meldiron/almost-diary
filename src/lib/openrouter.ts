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

	const prompt = `Generate an image: A cute, minimal, flat-style sticker icon for a diary activity stamp. The activity is: "${description}". ${context ? `Additional context: ${context}.` : ""} Style: soft pastel colors, simple shapes, white background, no text, kawaii aesthetic. Square format. The sticker should be tightly cropped to the subject with zero padding or margin`;

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
