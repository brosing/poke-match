<script lang="ts">
	import { onMount } from 'svelte';
	import PokemonCard from './pokemon-card.svelte';
	import { shuffle, localStorageStore, queryUnevolvedPokmons, addIdentifier,  } from '$utils';

	export let startTimer: () => void;
	export let stopTimer: () => void;

	const pokemons = localStorageStore<Omit<App.Pokemon, 'identifier'>[]>('pokemons', []);
	let randomPokemons: App.Pokemon[] = [];

	onMount(async () => {
		// NOTE to sync with localStorage
		pokemons?.subscribe(async (data: App.Pokemon[]) => {
			console.log('data', data)
			if (data.length === 0) {
				const result = await queryUnevolvedPokmons();
				pokemons?.set(result);
			} else {
				// get only 6 & double it to 12 cards from the Query
				const random6 = shuffle(data).slice(0, 6);
				const double6 = addIdentifier([...random6, ...random6]);
				randomPokemons = shuffle(double6);
			}
		});
	});

	let rotatedCards: App.Pokemon[] = [];
	let matchCards: App.Pokemon[] = []; // add flash effect on match cards
	let lastMatchCardID: string = ''; // prevent flash effect on prev match cards
	let onValidateCard = false; // To disabled interaction

	$: {
		if (rotatedCards.length > 0) {
			startTimer();
		}
		if (rotatedCards.length === randomPokemons.length) {
			stopTimer();
		}
	}

	function addMatchEffect(cards: App.Pokemon[]) {
		// to add animation & play sound to the latest match cards
		const lastID = rotatedCards.at(-1)?.id ?? '';
		if (lastMatchCardID !== rotatedCards.at(-1)?.id) {
			lastMatchCardID = lastID;
			matchCards = cards;
			setTimeout(() => {
				matchCards = [];
			}, 800);
		}
	}

	function validateCards() {
		onValidateCard = true;
		setTimeout(() => {
			const cards = rotatedCards.slice(-2); // get the current rotation
			// remote from rotatedCards if the current rotation isn't match
			if (cards[0].id !== cards[1].id) {
				rotatedCards = rotatedCards.slice(0, -2);
			} else {
				addMatchEffect(cards);
			}
			onValidateCard = false;
		}, 800);
	}
	$: if (rotatedCards.length > 0 && rotatedCards.length % 2 == 0) {
		validateCards();
	}
</script>

<div
	class="grid grid-cols-3 md:grid-cols-4 gap-[2px] md:gap-1"
>
	{#each randomPokemons as pokemon (pokemon.identifier)}
		<PokemonCard bind:rotatedCards {pokemon} {onValidateCard} {matchCards} />
	{/each}
</div>
