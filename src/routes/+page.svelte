<script lang="ts">
	import { onMount } from 'svelte';
	import { getColorSchemeContext } from '$lib/contexts/color-scheme';
	import PokemonCards from '../components/pokemon-cards.svelte';
	import { getLeaderboardContext } from '$lib/contexts/leaderboard';

	const colorSchemeStore = getColorSchemeContext();
	$: preferred = colorSchemeStore.preferred;
	function changeColorScheme() {
		const color = $preferred === 'dark' ? 'light' : 'dark';
		colorSchemeStore.change(color);
	};

	let refresh: number;
	const reloadCards = () => {
		refresh = Math.random();
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
		console.log('newTime', newTime)
		leaderboard?.update(data => [...data, newTime])
		clearInterval(interval);
		interval = null;
	};
	onMount(() => {
		return () => {
			clearInterval(interval);
		};
	});

	function formatTime(time: number) {
		const seconds = Math.floor((time / 1000) % 60);
		const minutes = Math.floor((time / (1000 * 60)) % 60);
		return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
	};
</script>

<div
	class="
  flex flex-col max-w-screen-sm h-screen p-4 pb-0 md:px-16 mx-auto
  bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white transition-colors
  "
>
	<div class="relative flex flex-col h-[24%] md:h-[36%] justify-center items-center">
		<h1 class="text-3xl font-bold leading-none">Poke Match</h1>
		<p class="opacity-70 mt-1">Random Pokemon to Match!</p>
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
		<a href="/about" class="py-4">
			<!-- <Icon name="refresh" fill="parent" class="h-4 w-4" /> -->
			<p>About ?</p>
		</a>
	</div>
</div>
