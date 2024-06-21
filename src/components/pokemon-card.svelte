<script lang="ts">
	export let pokemon: App.Pokemon;
	export let rotateCard: (id: number) => void;
	export let rotatedCards: number[];
	$: isRotated = rotatedCards.includes(pokemon.identifier);
	// https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png
	// https://www.centropkmn.com/pokes/anime/${id}.png`
</script>

<button class="relative m-0" on:click={() => rotateCard(pokemon.identifier)}>
	<div
		class={`z-0 absolute top-0 left-0 h-full w-full bg-neutral-200 dark:bg-neutral-200 rounded-lg ${isRotated ? 'animate-flip-in' : 'animate-pulse'}`}
	/>
	<div
		class={`p-3 bg-neutral-200 dark:bg-neutral-200 h-full rounded-lg flex flex-col items-center justify-center gap-1 [backface-visibility:hidden] [transform:rotateY(-180deg)] ${isRotated ? 'animate-flip-in' : ''}`}
	>
		<img
			alt={pokemon.name}
			src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
			class="w-3/4 h-auto scale-90"
		/>
		<p class="z-10 text-neutral-700 text-sm font-medium capitalize">{pokemon.name}</p>
	</div>
</button>
