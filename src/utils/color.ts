export function imageToRGBA(image: HTMLImageElement) {
	image.crossOrigin = 'Anonymous';
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	canvas.width = image.width;
	canvas.height = image.height;
	context?.drawImage(image, 0, 0, 1, 1);
	return context?.getImageData(0, 0, 1, 1).data.join(',');
}

interface ImageMostColorOptions {
	opacity: string; // 0 - 1
}
export function getImageMostColor(
	image: HTMLImageElement,
	options: ImageMostColorOptions = {
		opacity: '0.2'
	}
) {
	const noAlpha = imageToRGBA(image);
	if (noAlpha) {
		// set RGB only
		const rgb = noAlpha.split(',').slice(0, -1).join(',');
		return `rgba(${rgb}, ${options.opacity})`;
	}
	// set default to white
	return `rgba(255, 255, 255, ${options.opacity})`;
}
