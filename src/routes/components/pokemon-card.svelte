<script lang="ts">
	import { PUBLIC_IMAGE_URL } from '$env/static/public';
	import { getImageMostColor, findCurrentCard } from '$utils';

	interface Props {
		pokemon: App.Pokemon;
		rotatedCards: App.Pokemon[];
		matchCards: App.Pokemon[];
		playFlipSound: () => void;
		playMatchSound: () => void;
	}

	let {
		pokemon,
		rotatedCards = $bindable(),
		matchCards,
		playFlipSound,
		playMatchSound
	}: Props = $props();
	type EventHandle = Event & {
		currentTarget: EventTarget & Element;
	};

	let isFirstRotattion = $state(false); // avoid animation rotate on first render
	let isMatch = $derived(findCurrentCard(pokemon, matchCards));
	let isRotated = $derived(findCurrentCard(pokemon, rotatedCards));

	$effect(() => {
		console.log(pokemon.id);
	})
	$effect(() => {
		if (isRotated) {
			isFirstRotattion = true;
			playFlipSound();
		}
	});
	$effect(() => {
		if (isMatch) {
			playMatchSound();
		}
	});

	const fallbackImage = '/images/ball.png';
	const handleError = (e: EventHandle) => {
		// @ts-ignore
		e.target.src = fallbackImage;
	};

	let isLoaded = $state(false);
	let backgroundColor = $state('grey');
	const handleImageLoad = (e: EventHandle) => {
		const image = e.currentTarget as HTMLImageElement;
		backgroundColor = getImageMostColor(image);
	};

</script>

<button
	class={`relative m-0 flex-1 ${isMatch ? 'animate-flash' : ''}`}
	onclick={() => {
		rotatedCards = [...rotatedCards, pokemon];
	}}
	disabled={isRotated}
>
	<div
		class={`z-0 absolute top-0 left-0 h-full w-full bg-neutral-200 dark:bg-neutral-500 rounded-lg ${isFirstRotattion ? (isRotated ? 'animate-flip-in-gone' : 'animate-flip-out-visible') : ''}`}
	></div>
	<div
		class={`relative p-3 h-full rounded-lg flex flex-col items-center justify-center gap-1 [backface-visibility:hidden] [transform:rotateY(-180deg)] ${isFirstRotattion ? (isRotated ? 'animate-flip-in' : 'animate-flip-out') : ''}`}
		style={`background-color: ${backgroundColor};`}
	>
		<img
			alt={pokemon.name}
			src={`${PUBLIC_IMAGE_URL}/${pokemon.id}.png`}
			class="absolute top-2 w-3/4 h-auto scale-90"
			onerror={(e) => {
				handleError(e);
			}}
			onload={(e) => {
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
