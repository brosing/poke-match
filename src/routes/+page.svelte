<script lang="ts">
	import { getColorSchemeContext } from '$lib/contexts/color-scheme';
	import PokemonCards from '../components/pokemon-cards.svelte';

	const colorSchemeStore = getColorSchemeContext();
	$: preferred = colorSchemeStore.preferred;
	const changeColorScheme = () => {
		const color = $preferred === 'dark' ? 'light' : 'dark';
		colorSchemeStore.change(color);
	};

	let refresh: number
	const reloadCards = () => {
		refresh = Math.random();
	}
</script>

<div
	class="
  flex flex-col max-w-screen-sm h-screen p-4 pb-0 md:px-16 mx-auto
  bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white transition-colors
  "
>
	<div class="relative flex flex-col h-[24%] md:h-[36%] justify-center items-center">
		<h1 class="text-3xl font-bold leading-none">Poke Match</h1>
		<p class="opacity-70 mt-1" >Random Pokemons to Match!</p>
	</div>

	{#key refresh}
	<PokemonCards />
	{/key}

	<div class="flex justify-between items-center gap-2 text-xs opacity-60 text-neutral-800 dark:text-white">
		<button on:click={reloadCards} class="py-4">
			<!-- <Icon name="refresh" fill="parent" class="h-4 w-4" /> -->
			<p>Refresh</p>
		</button>
		<button on:click={changeColorScheme} class="py-4">
			<!-- <Icon name={$preferred === 'dark' ? 'dark' : 'light'} fill="parent" class="h-4 w-4" /> -->
			<p>{$preferred === 'dark' ? 'Dark' : 'Light'} Mode</p>
		</button>
	</div>
</div>
