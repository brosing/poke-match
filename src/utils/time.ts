// return example 05.00, 17.16
export function formatTime(time: number) {
	const seconds = Math.floor((time / 1000) % 60);
	const minutes = Math.floor((time / (1000 * 60)) % 60);
	return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}