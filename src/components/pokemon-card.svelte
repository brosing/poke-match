<script lang="ts">
	import { PUBLIC_IMAGE_URL } from '$env/static/public';
	import { imageToRGBA } from '../utils/color';

	export let pokemon: App.Pokemon;
	export let rotateCard: (poke: App.Pokemon) => void;
	export let rotatedCards: App.Pokemon[];
	export let matchCards: App.Pokemon[];
	export let onValidateCard: boolean;
	type EventHandle = Event & {
		currentTarget: EventTarget & Element;
	};

	let isFirstRotated = false; // avoid animation rotate on first render
	const findCurrentCard = (cards: App.Pokemon[]) =>
		cards.find((_) => _.identifier === pokemon.identifier) !== undefined;
	$: isMatch = findCurrentCard(matchCards);
	$: isRotated = findCurrentCard(rotatedCards);
	$: if (isRotated) {
		isFirstRotated = true;
	}
	const fallbackImage = '/images/ball.png';
	const handleError = (e: EventHandle) => {
		// @ts-ignore
		e.target.src = fallbackImage;
	};
	let isLoaded = false;
	let backgroundColor = 'grey';

	const handleImageLoad = (e: EventHandle) => {
		const image = e.currentTarget as HTMLImageElement;
		const noAlpha = imageToRGBA(image);
		if (noAlpha) {
			// set RGB only
			const rgb = noAlpha.split(',').slice(0, -1).join(',');
			backgroundColor = `rgba(${rgb}, 0.2)`;
		}
	};
</script>

<button
	class={`relative m-0 flex-1 ${isMatch ? 'animate-flash' : ''}`}
	on:click={() => rotateCard(pokemon)}
	disabled={isRotated || onValidateCard}
>
	<div
		class={`z-0 absolute top-0 left-0 h-full w-full bg-neutral-200 dark:bg-neutral-400 rounded-lg ${isFirstRotated ? (isRotated ? 'animate-flip-in-gone' : 'animate-flip-out-visible') : ''}`}
	/>
	<div
		class={`relative p-3 h-full rounded-lg flex flex-col items-center justify-center gap-1 [backface-visibility:hidden] [transform:rotateY(-180deg)] ${isFirstRotated ? (isRotated ? 'animate-flip-in' : 'animate-flip-out') : ''}`}
		style={`background-color: ${backgroundColor};`}
	>
		<img
			alt={pokemon.name}
			src={`${PUBLIC_IMAGE_URL}${pokemon.id}.png`}
			class="absolute top-2 w-3/4 h-auto scale-90"
			on:error={(e) => {
				handleError(e);
			}}
			on:load={(e) => {
				isLoaded = true;
				handleImageLoad(e);
			}}
		/>

		<img
			alt="poke ball"
			src={fallbackImage}
			class={`w-3/4 h-auto scale-75 ${isLoaded ? 'invisible' : 'bg-neutral-200'}`}
		/>

		<p class="z-10 text-black dark:text-white opacity-50 text-md font-bold capitalize mt-1 md:mt-3">
			{pokemon.name}
		</p>
	</div>
</button>
