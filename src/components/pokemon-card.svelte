<script lang="ts">
	import { PUBLIC_IMAGE_URL } from '$env/static/public';
	import fallbackImage from '$lib/assets/ball.png';

	export let pokemon: App.Pokemon;
	export let rotateCard: (poke: App.Pokemon) => void;
	export let rotatedCards: App.Pokemon[];
	export let matchCards: App.Pokemon[];
	export let onValidateCard: boolean;

	let isFirstRotated = false; // avoid animation rotate on first render
	const findCurrentCard = (cards: App.Pokemon[]) =>
		cards.find((_) => _.identifier === pokemon.identifier) !== undefined;
	$: isMatch = findCurrentCard(matchCards);
	$: isRotated = findCurrentCard(rotatedCards);
	$: if (isRotated) {
		isFirstRotated = true;
	}
	const handleError = (e) => {
		e.target.src = fallbackImage;
	};
	let isLoaded = false
</script>

<button
	class={`relative m-0 flex-1 ${isMatch ? 'animate-flash' : ''}`}
	on:click={() => rotateCard(pokemon)}
	disabled={isRotated || onValidateCard}
>
	<div
		class={`z-0 absolute top-0 left-0 h-full w-full bg-neutral-200 rounded-lg ${isFirstRotated ? (isRotated ? 'animate-flip-in' : 'animate-flip-out') : ''}`}
	/>
	<div
		class={`relative p-3 h-full bg-neutral-200 rounded-lg flex flex-col items-center justify-center gap-1 [backface-visibility:hidden] [transform:rotateY(-180deg)] ${isFirstRotated ? (isRotated ? 'animate-flip-in' : 'animate-flip-out') : ''}`}
	>
		<img
			alt={pokemon.name}
			src={`${PUBLIC_IMAGE_URL}${pokemon.id}.png`}
			class="absolute top-2 w-3/4 h-auto scale-90"
			on:error={handleError}
			on:load={() => {
				isLoaded =true
			}}
		/>

		<img
			alt="poke ball"
			src={fallbackImage}
			class={`w-3/4 h-auto scale-90 ${isLoaded ? 'invisible' : 'bg-neutral-200'}`}
		/>
		
		<p class="z-10 text-neutral-700 text-sm font-medium capitalize">{pokemon.name}</p>
	</div>
</button>
