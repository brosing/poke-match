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
