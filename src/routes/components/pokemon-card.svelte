<script lang="ts">
	import { PUBLIC_IMAGE_URL } from '$env/static/public';
	import { getImageMostColor, findCurrentCard } from '$utils';
	import flipMp3 from '$lib/sound/flip.mp3';
	import rightMp3 from '$lib/sound/right.mp3';

	let flipSound = new Audio(flipMp3)
	let rightSound = new Audio(rightMp3)
	rightSound.volume = 0.4
	export let pokemon: App.Pokemon;
	export let rotatedCards: App.Pokemon[];
	export let matchCards: App.Pokemon[];
	export let onValidateCard: boolean;
	type EventHandle = Event & {
		currentTarget: EventTarget & Element;
	};

	let isFirstRotattion = false; // avoid animation rotate on first render
	$: isMatch = findCurrentCard(pokemon, matchCards);
	$: isRotated = findCurrentCard(pokemon, rotatedCards);
	$: if (isRotated) {
		isFirstRotattion = true;
		flipSound.play()
	}
	$: if (isMatch) {
		setTimeout(() => {
			rightSound.play()
		}, 200);
		setTimeout(() => {
			rightSound.play()
		}, 700);
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
		backgroundColor = getImageMostColor(image);
	};

</script>

<button
	class={`relative m-0 flex-1 ${isMatch ? 'animate-flash' : ''}`}
	on:click={() => {
		rotatedCards = [...rotatedCards, pokemon];
	}}
	disabled={isRotated || onValidateCard}
>
	<div
		class={`z-0 absolute top-0 left-0 h-full w-full bg-neutral-200 dark:bg-neutral-500 rounded-lg ${isFirstRotattion ? (isRotated ? 'animate-flip-in-gone' : 'animate-flip-out-visible') : ''}`}
	/>
	<div
		class={`relative p-3 h-full rounded-lg flex flex-col items-center justify-center gap-1 [backface-visibility:hidden] [transform:rotateY(-180deg)] ${isFirstRotattion ? (isRotated ? 'animate-flip-in' : 'animate-flip-out') : ''}`}
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
