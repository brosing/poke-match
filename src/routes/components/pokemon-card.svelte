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
	let backgroundColor = $state('rgba(250, 250, 250, 0.1)');
	const handleImageLoad = (e: EventHandle) => {
		const image = e.currentTarget as HTMLImageElement;
		backgroundColor = getImageMostColor(image, { opacity: '0.12' });
	};
</script>

<button
	class={`relative w-full h-full rounded-xl overflow-hidden focus:outline-none transition-all duration-300 ${isMatch ? 'animate-flash' : ''}`}
	onclick={() => {
		if (!isRotated) {
			rotatedCards = [...rotatedCards, pokemon];
		}
	}}
	disabled={isRotated}
>
	<!-- CARD BACK -->
	<div
		class={`absolute inset-0 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 hover-lift ${isFirstRotattion ? (isRotated ? 'animate-flip-in-gone' : 'animate-flip-out-visible') : ''}`}
		style="background-color: var(--surface-color); border-color: var(--border-color);"
	>
		<!-- Minimalist Pokéball SVG Outline -->
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="1.2" class="w-9 h-9 opacity-25 select-none pointer-events-none transition-all duration-350">
			<circle cx="12" cy="12" r="10" />
			<path d="M2 12h20M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" fill="var(--bg-color)" />
		</svg>
	</div>

	<!-- CARD FRONT -->
	<div
		class={`absolute inset-0 p-2 md:p-3 rounded-xl border flex flex-col items-center justify-between [backface-visibility:hidden] [transform:rotateY(-180deg)] transition-all duration-300 ${isFirstRotattion ? (isRotated ? 'animate-flip-in' : 'animate-flip-out') : ''}`}
		style={`background-color: ${backgroundColor}; border-color: var(--border-color);`}
	>
		<!-- Pokemon Image -->
		<div class="relative flex-1 w-full flex items-center justify-center mt-2 min-h-0">
			<img
				alt={pokemon.name}
				src={`${PUBLIC_IMAGE_URL}/${pokemon.id}.png`}
				class="max-w-[85%] max-h-[85%] object-contain select-none transition-transform duration-300"
				onerror={(e) => {
					handleError(e);
				}}
				onload={(e) => {
					isLoaded = true;
					handleImageLoad(e);
				}}
			/>

			<!-- Loader Ball image -->
			<img
				alt="loading"
				src={fallbackImage}
				class={`absolute w-1/2 h-auto opacity-20 animate-spin-slow ${isLoaded ? 'hidden' : 'block'}`}
			/>
		</div>

		<!-- Pokemon Name -->
		<span 
			class="z-10 text-xs md:text-sm font-bold tracking-wider capitalize text-center mt-2 block select-none truncate w-full"
			style="color: var(--text-primary); opacity: 0.8;"
		>
			{pokemon.name}
		</span>
	</div>
</button>

<style>
	/* Micro-spin for placeholder loader */
	:global(.animate-spin-slow) {
		animation: spin 3s linear infinite;
	}
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
