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
	const lowerWhite = (nums: string[]) => nums.map(num => {
		if (parseInt(num, 2) > 250) return '250'
		return num
	})

	if (noAlpha) {
		// set RGB only
		const rgb = noAlpha.split(',').slice(0, -1)
		const rgbString = lowerWhite(rgb).join(',');
		return `rgba(${rgbString}, ${options.opacity})`;
	}
	// set default to fafafa
	return `rgba(250, 250, 250, ${options.opacity})`;
}
