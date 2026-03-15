import type { Area } from "react-easy-crop";

export async function getCroppedImage(
	imageSrc: string,
	cropArea: Area,
): Promise<string> {
	const image = await createImage(imageSrc);
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Could not get canvas context");

	canvas.width = cropArea.width;
	canvas.height = cropArea.height;

	ctx.drawImage(
		image,
		cropArea.x,
		cropArea.y,
		cropArea.width,
		cropArea.height,
		0,
		0,
		cropArea.width,
		cropArea.height,
	);

	return canvas.toDataURL("image/png");
}

function createImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.addEventListener("load", () => resolve(img));
		img.addEventListener("error", (e) => reject(e));
		img.crossOrigin = "anonymous";
		img.src = url;
	});
}
