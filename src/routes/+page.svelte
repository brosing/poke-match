<script lang="ts">
	import { getColorSchemeContext } from '$lib/contexts/color-scheme';
	import Icon from '../components/icon.svelte';
	import PokemonCards from '../components/pokemon-cards.svelte';

	const colorSchemeStore = getColorSchemeContext();
	$: preferred = colorSchemeStore.preferred;
	const changeColorScheme = () => {
		const color = $preferred === 'dark' ? 'light' : 'dark';
		colorSchemeStore.change(color);
	};

</script>

<div
	class="
  flex flex-col max-w-screen-sm h-screen p-4 md:px-16 mx-auto
  bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white transition-colors
  "
>
	<div class="relative flex h-[20%] md:h-[36%] justify-between items-center">
		<h1 class="text-3xl font-bold leading-none">Poke <br/> Match</h1>
		<button on:click={changeColorScheme} class="py-4 text-neutral-800 dark:text-white">
			<Icon name={$preferred === 'dark' ? 'dark' : 'light'} fill="parent" />
		</button>
	</div>

	<PokemonCards />
</div>
