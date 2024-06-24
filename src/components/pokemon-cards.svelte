<script lang="ts">
	import { onMount } from "svelte";
	import PokemonCard from "./pokemon-card.svelte";
	import { shuffle } from "../utils/helper";
	import { localStorageStore } from "../utils/local-storage";
	import { queryUnevolvedPokmons } from "../utils/query";

	export let startTimer;
	export let stopTimer;

	const pokemons = localStorageStore<Omit<App.Pokemon, 'identifier'>[]>('pokemons', []);
	let randomPokemons: App.Pokemon[] = [];
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
	
	let rotatedCards: App.Pokemon[] = [];
	let matchCards: App.Pokemon[] = []; // add flash effect on match cards
	let lastMatchCardID: string = ''; // prevent flash effect on prev match cards
	let onValidateCard = false // To disabled interaction

	$: if (rotatedCards.length > 0) {
		startTimer();

		if (rotatedCards.length === randomPokemons.length) {
			stopTimer();
		}
	}

	function rotateCard(poke: App.Pokemon) {
		rotatedCards = [...rotatedCards, poke];
	}
	function shakeCards(cards: App.Pokemon[]) {
		matchCards = cards;
		setTimeout(() => {
			matchCards = []
		}, 800);
	}
	function validateCards() {
		onValidateCard = true
		setTimeout(() => {
			const cards = rotatedCards.slice(-2)
			if (cards[0].id !== cards[1].id) {
				rotatedCards = rotatedCards.slice(0, -2)
			} else {
				const lastID = rotatedCards.at(-1)?.id ?? ''
				if (lastMatchCardID !== rotatedCards.at(-1)?.id) {
					lastMatchCardID = lastID
					shakeCards(cards);
				}
			}
			onValidateCard = false
		}, 800);
	}
	$: if (rotatedCards.length > 0 && rotatedCards.length % 2 == 0) {
		validateCards()
	}
</script>

<div class="grid grid-cols-3 md:grid-cols-4 flex-1 md:flex-[0] md:mb-4 gap-[2px] md:gap-1 md:min-h-[50%]">
  {#each randomPokemons as pokemon (pokemon.identifier)}
    <PokemonCard {pokemon} {rotateCard} {rotatedCards} {onValidateCard} {matchCards} />
  {/each}
</div>