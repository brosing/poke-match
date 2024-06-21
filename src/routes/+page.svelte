<script lang="ts">
	import { getColorSchemeContext } from '$lib/contexts/color-scheme';
  import { PUBLIC_API_URL } from '$env/static/public';
	import Icon from '../components/icon.svelte';
	import PokemonCardWrapper from '../components/pokemon-card-wrapper.svelte';

	const colorSchemeStore = getColorSchemeContext();
	$: preferred = colorSchemeStore.preferred;
	const changeColorScheme = () => {
		const color = $preferred === 'dark' ? 'light' : 'dark';
		colorSchemeStore.change(color);
	};

	const query = `
    query getUnevolvedPokmons {
      pokemon_v2_pokemonspecies(where: {evolves_from_species_id: {_is_null: true}}, limit: 300) {
        name
        id
      }
    }
  `;
	async function fetchUnevolvedPokmons() {
		const result = await fetch(PUBLIC_API_URL, {
			method: 'POST',
			body: JSON.stringify({ query })
		});

		return await result.json();
	}
</script>

<div
	class="
  flex flex-col max-w-screen-sm h-screen p-4 md:px-16 mx-auto
  bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white transition-colors
  "
>
	<div class="relative flex h-[20%] md:h-[36%] justify-between items-center">
		<h1 class="text-3xl font-bold">Poke Match</h1>
		<button on:click={changeColorScheme} class="py-4 text-neutral-800 dark:text-white">
			<Icon name={$preferred === 'dark' ? 'dark' : 'light'} fill="parent" />
		</button>
	</div>

	<PokemonCardWrapper {fetchUnevolvedPokmons} />
</div>
