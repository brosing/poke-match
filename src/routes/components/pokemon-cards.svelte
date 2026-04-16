<script lang="ts">
	import { onMount } from 'svelte';
	import PokemonCard from './pokemon-card.svelte';
	import { shuffle, localStorageStore, queryUnevolvedPokmons, addIdentifier,  } from '$utils';
	import flipMp3 from '$lib/sound/flip.mp3';
	import matchMp3 from '$lib/sound/right.mp3';
	import { browser } from '$app/environment';

	interface Props {
		startTimer: () => void;
		stopTimer: () => void;
	}

	let { startTimer, stopTimer }: Props = $props();

	let flipSound = browser ? new Audio(flipMp3) : null
	let matchSound = browser ? new Audio(matchMp3) : null
	if (matchSound) {
		matchSound.volume = 0.4
	}

	function playFlipSound() {
		flipSound?.play()
	}

	function playMatchSound() {
		matchSound?.play()
		setTimeout(() => {
			matchSound?.play()
		}, 500);
	}

	const pokemons = localStorageStore<Omit<App.Pokemon, 'identifier'>[]>('pokemons', []);
	let randomPokemons: App.Pokemon[] = $state([]);

	onMount(async () => {
		// NOTE to sync with localStorage
		pokemons?.subscribe(async (data: App.Pokemon[]) => {
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

	let rotatedCards: App.Pokemon[] = $state([]);
	let matchCards: App.Pokemon[] = $state([]); // add flash effect on match cards
	let lastMatchCardID: string = ''; // prevent flash effect on prev match cards
	let processedCount = 0;

	$effect(() => {
		if (rotatedCards.length === 1) {
			startTimer();
		}
		if (rotatedCards.length > 0 && rotatedCards.length === randomPokemons.length) {
			stopTimer();
		}
	});

	function addMatchEffect(cards: App.Pokemon[]) {
		// to add animation & play sound to the latest match cards
		const lastID = cards[1].id;
		if (lastMatchCardID !== lastID) {
			lastMatchCardID = lastID as string;
			matchCards = cards;
			setTimeout(() => {
				matchCards = [];
			}, 800);
		}
	}

	function validatePair(pair: App.Pokemon[]) {
		setTimeout(() => {
			if (pair[0].id !== pair[1].id) {
				// Remove pair from rotatedCards
				rotatedCards = rotatedCards.filter(
					(c) => c.identifier !== pair[0].identifier && c.identifier !== pair[1].identifier
				);
				processedCount -= 2;
			} else {
				addMatchEffect(pair);
			}
		}, 800);
	}

	$effect(() => {
		if (rotatedCards.length >= processedCount + 2) {
			const pair = [rotatedCards[processedCount], rotatedCards[processedCount + 1]];
			processedCount += 2;
			validatePair(pair);
		}
	});
</script>

<div
	class="grid grid-cols-3 md:grid-cols-4 gap-[2px] md:gap-1"
>
	{#each randomPokemons as pokemon (pokemon.identifier)}
		<PokemonCard bind:rotatedCards {pokemon} {matchCards} {playFlipSound} {playMatchSound} />
	{/each}
</div>
