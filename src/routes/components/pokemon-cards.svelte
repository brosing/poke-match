<script lang="ts">
	import { onMount } from 'svelte';
	import PokemonCard from './pokemon-card.svelte';
	import { shuffle, localStorageStore, queryUnevolvedPokmons, addIdentifier,  } from '$utils';
	import flipMp3 from '$lib/sound/flip.mp3';
	import matchMp3 from '$lib/sound/right.mp3';
	import { browser } from '$app/environment';

	let { startTimer, stopTimer, pairCount = 6 }: {
		startTimer: () => void;
		stopTimer: () => void;
		pairCount?: number;
	} = $props();

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
				// get based on pairCount & double it
				const randomSet = shuffle(data).slice(0, pairCount);
				const doubleSet = addIdentifier([...randomSet, ...randomSet]);
				randomPokemons = shuffle(doubleSet);
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

	let cols = $derived.by(() => {
		const total = pairCount * 2;
		if (total === 12) {
			return windowWidth < 768 ? 3 : 4;
		}
		if (total === 18) return 6;
		if (total === 32) return 8;
		return 4;
	});

	let rows = $derived.by(() => {
		const total = pairCount * 2;
		if (total === 12) {
			return windowWidth < 768 ? 4 : 3;
		}
		if (total === 18) return 3;
		if (total === 32) return 4;
		return 3;
	});

	let windowWidth = $state(0);
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div
	class="grid w-full h-full gap-2 md:gap-4 p-0.5 overflow-hidden"
	style={`grid-template-columns: repeat(${cols}, minmax(0, 1fr)); grid-template-rows: repeat(${rows}, minmax(0, 1fr));`}
>
	{#each randomPokemons as pokemon (pokemon.identifier)}
		<PokemonCard bind:rotatedCards {pokemon} {matchCards} {playFlipSound} {playMatchSound} />
	{/each}
</div>
