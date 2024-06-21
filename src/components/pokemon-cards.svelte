<script lang="ts">
	import { onMount } from "svelte";
	import { shuffle } from "../utils/helper";
	import PokemonCard from "./pokemon-card.svelte";
	import { localStorageStore } from "../utils/local-storage";
	import { queryUnevolvedPokmons } from "../utils/query";

	const pokemons = localStorageStore<Omit<App.Pokemon, 'identifier'>[]>('pokemons', []);
  
	let randomPokemons: App.Pokemon[] = [];
	let rotatedCards: number[] = [];
	function rotateCard(id: number) {
		rotatedCards = [...rotatedCards, id];
	}

	function shufflePokemon(data: Omit<App.Pokemon, 'identifier'>[]) {
		// shuffle & get only 6 of them
		const random = shuffle(data).slice(0, 6);
		// double it & add identifier
		const doubleRandom = [...random, ...random].map((po, index) => ({
			...po,
			identifier: index + 1
		}));
		// return a shuffle from double Pokemons
		return shuffle(doubleRandom);
	}
	onMount(async () => {
		// NOTE sync with localStorage
		pokemons?.subscribe(async (data: App.Pokemon[]) => {
			if (data.length === 0) {
				const result = await queryUnevolvedPokmons();
				pokemons?.set(result.data.pokemon_v2_pokemonspecies);
				return;
			}

			randomPokemons = shufflePokemon(data);
		});
	});
</script>

<div class="grid grid-cols-3 md:grid-cols-4 md:mb-16 gap-[2px] md:gap-1 flex-1">
  {#each randomPokemons as pokemon (pokemon.identifier)}
    <PokemonCard {pokemon} {rotateCard} {rotatedCards} />
  {/each}
</div>