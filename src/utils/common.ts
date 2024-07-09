export function shuffle<T>(array: T[]) {
	return array
		.map((value) => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value);
}

export function isPwa(): boolean {
	if (!window) return false;

	const modes = ['fullscreen', 'standalone', 'minimal-ui'];
	return modes.some(
		(display) =>
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			navigator.standalone || matchMedia('(display-mode: ' + display + ')').matches
	);
}

// return example 05.00, 17.16
export function formatTime(time: number) {
	const seconds = Math.floor((time / 1000) % 60);
	const minutes = Math.floor((time / (1000 * 60)) % 60);
	return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}