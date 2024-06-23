<script lang="ts">
	'@hmr:keep-all'

	import { onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { getColorSchemeContext } from '$lib/contexts/color-scheme';
	import { getLeaderboardContext } from '$lib/contexts/leaderboard';
	import PokemonCards from '../components/pokemon-cards.svelte';
	import { fade, slide } from 'svelte/transition';
	import Icon from '../components/icon.svelte';
	import ModalAbout from '../components/about.svelte';

	const colorSchemeStore = getColorSchemeContext();
	$: preferred = colorSchemeStore.preferred;
	function changeColorScheme() {
		const color = $preferred === 'dark' ? 'light' : 'dark';
		colorSchemeStore.change(color);
	};

	let leaderboard = getLeaderboardContext();
	let elapsed = 0;
	let interval: NodeJS.Timeout;
	function startTimer() {
		if (!interval) {
			const startTime = Date.now() - elapsed;
			interval = setInterval(() => {
				elapsed = Date.now() - startTime;
			}, 100);
		}
	};
	function stopTimer() {
		const newTime = formatTime(elapsed)
		leaderboard?.update(data => [...data, newTime])
		clearInterval(interval);
		interval = null;
	};
	onMount(() => {
		return () => {
			clearInterval(interval);
		};
	});

	let refresh: number = 0;
	const reloadCards = () => {
		refresh = Math.random();
		clearInterval(interval);
		interval = null;
		elapsed = 0;
	};

	function formatTime(time: number) {
		const seconds = Math.floor((time / 1000) % 60);
		const minutes = Math.floor((time / (1000 * 60)) % 60);
		return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
	};

	$: finish = interval === null && elapsed > 0
	let showModal = false;
</script>

<div
	class="
  flex flex-col max-w-screen-sm h-screen p-4 pb-0 md:px-16 mx-auto
  bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white transition-colors
  "
>
	<div class="relative flex flex-row h-[24%] md:h-[36%] items-center transition-all justify-between">
		<div>
			<h1 class="text-3xl font-bold leading-none mb-1">Poke Match</h1>
			{#if (finish)}
				<p class="font-medium" transition:slide={{ duration: 300, easing: quintOut, axis: 'y' }}>Congratulation!</p>
			{:else}
				<p class="opacity-70" transition:slide={{ duration: 300, delay: 100, easing: quintOut, axis: 'y' }}>Random Pokemons to Match!</p>
			{/if}
		</div>
		{#if (finish)}
			<button transition:fade={{ duration: 800 }} class="text-neutral-800 dark:text-white px-4" on:click={reloadCards}>
				<Icon name="reload" class="h-4 w-4" />
			</button>
		{/if}
	</div>

	{#key refresh}
		<PokemonCards {startTimer} {stopTimer} />
	{/key}

	<div
		class="flex md:mb-4 justify-between items-center gap-2 text-xs opacity-60 text-neutral-800 dark:text-white"
	>
		<button on:click={changeColorScheme} class="py-4">
			<!-- <Icon name={$preferred === 'dark' ? 'dark' : 'light'} fill="parent" class="h-4 w-4" /> -->
			<p>{$preferred === 'dark' ? 'Dark' : 'Light'} Mode</p>
		</button>
		<p class={interval ? 'animate-pulse font-bold' : ''}>{formatTime(elapsed)}</p>
		<button class="py-4" on:click={() => (showModal = true)}>
			<!-- <Icon name="refresh" fill="parent" class="h-4 w-4" /> -->
			<p>About ?</p>
		</button>
	</div>

	<ModalAbout bind:showModal/>
</div>
