<script lang="ts">
	import { onMount } from 'svelte';
	import { getColorSchemeContext } from '$lib/contexts/color-scheme';
	import { localStorageStore } from '../utils/local-storage';
	import Icon from '../components/icon.svelte';

	const query = `
    query getUnevolvedPokmons {
      pokemon_v2_pokemonspecies(where: {evolves_from_species_id: {_is_null: true}}, limit: 300) {
        name
        id
      }
    }
  `;

	const colorSchemeStore = getColorSchemeContext();
	$: preferred = colorSchemeStore.preferred;

	const changeColorScheme = () => {
		const color = $preferred === 'dark' ? 'light' : 'dark';
		colorSchemeStore.change(color);
	};

  const pokemons = localStorageStore<App.Pokemon[]>('pokemons', []);
	async function fetchUnevolvedPokmons() {
		const result = await fetch('https://beta.pokeapi.co/graphql/v1beta', {
			method: 'POST',
			body: JSON.stringify({ query })
		});

		return await result.json();
	}
	onMount(async () => {
    // NOTE sync with localStorage
    pokemons?.subscribe(async (data) => {
      if (data.length === 0) {
        const result = await fetchUnevolvedPokmons();
        pokemons?.set(result.data);
      }
    })
	});
</script>

<div
	class="
  flex flex-col w-screen h-screen
  bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white transition-colors
  "
>
	<div class="relative">
		<h1 class="text-3xl font-bold m-7 text-center">Poke Match</h1>
		<button
			on:click={changeColorScheme}
			class="absolute right-2 top-4 p-5 text-neutral-800 dark:text-white"
		>
			<Icon name={$preferred === 'dark' ? 'dark' : 'light'} fill="parent" />
		</button>
	</div>
</div>
