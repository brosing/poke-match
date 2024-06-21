<script lang="ts">
	import { PUBLIC_IMAGE_URL } from '$env/static/public';

	export let pokemon: App.Pokemon;
	export let rotateCard: (poke: App.Pokemon) => void;
	export let rotatedCards: App.Pokemon[];
	export let matchCards: App.Pokemon[];
	export let onValidateCard: boolean;

	const findCurrentCard = (cards: App.Pokemon[]) =>
		cards.find((_) => _.identifier === pokemon.identifier) !== undefined;
	$: isRotated = findCurrentCard(rotatedCards);
	$: isMatch = findCurrentCard(matchCards);
</script>

<button
	class={`relative m-0 flex-1 ${isMatch ? 'animate-flash' : ''}`}
	on:click={() => rotateCard(pokemon)}
	disabled={isRotated || onValidateCard}
>
	<div
		class={`z-0 absolute top-0 left-0 h-full w-full bg-neutral-200 dark:bg-neutral-200 rounded-lg ${isRotated ? 'animate-flip-in' : 'animate-flip-out'}`}
	/>
	<div
		class={`p-3 bg-neutral-200 dark:bg-neutral-200 rounded-lg flex flex-col items-center justify-center gap-1 [backface-visibility:hidden] [transform:rotateY(-180deg)] ${isRotated ? 'animate-flip-in' : 'animate-flip-out'}`}
	>
		<img
			alt={pokemon.name}
			src={`${PUBLIC_IMAGE_URL}${pokemon.id}.png`}
			class="w-3/4 h-auto scale-90"
		/>
		<p class="z-10 text-neutral-700 text-sm font-medium capitalize">{pokemon.name}</p>
	</div>
</button>
