<script lang="ts">
	import { onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { fade, slide } from 'svelte/transition';
	import { getColorSchemeContext } from '$lib/contexts/color-scheme';
	import { getLeaderboardContext } from '$lib/contexts/leaderboard';
	import { formatTime, isPwa } from '../utils/common';
	import PokemonCards from '../components/pokemon-cards.svelte';
	import Icon from '../components/icon.svelte';
	import ModalAbout from '../components/about.svelte';
	import { browser } from '$app/environment';

	const colorSchemeStore = getColorSchemeContext();
	$: preferred = colorSchemeStore.preferred;
	function changeColorScheme() {
		const color = $preferred === 'dark' ? 'light' : 'dark';
		colorSchemeStore.change(color);
	}

	let sab = '0px';
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
	}
	function stopTimer() {
		const newTime = formatTime(elapsed);
		leaderboard?.update((data) => [...data, newTime]);
		clearInterval(interval);
		interval = null;
	}

	onMount(() => {
		// handle bottom space "sab"
		const bottomSpace = getComputedStyle(document.documentElement).getPropertyValue('--sab');
		if (bottomSpace) {
			sab = bottomSpace;
		} else {
			// check if current web is installed as PWA
			if (isPwa()) sab = '24px';
		}

		return () => {
			// handle game time counter "elapsed & interval"
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

	$: finish = interval === null && elapsed > 0;
	let showModal = false;
</script>

<div
	class={`
  flex flex-col h-dvh w-screen md:max-w-screen-sm p-4 md:px-16 md:mx-auto md:justify-center
  text-neutral-800 dark:text-white
  `}
	style={`padding-bottom: ${sab};`}
>
	<div
		class="relative py-4 md:py-10 flex flex-1 md:flex-grow-0 flex-row items-center transition-all justify-between"
	>
		<div>
			{#if finish}
				<p
					class="text-5xl font-bold animate-flash-infinite"
					transition:slide={{ delay: 700, duration: 300, easing: quintOut, axis: 'y' }}
				>
					Congratulation!
				</p>
			{:else}
				<h1
					class="text-5xl font-bold"
					transition:slide={{ delay: 800, duration: 300, easing: quintOut, axis: 'y' }}
				>
					Poke Match
				</h1>
			{/if}
		</div>
		{#if finish}
			<button
				transition:fade={{ duration: 800 }}
				class="text-neutral-800 dark:text-white px-4 -mb-2"
				on:click={reloadCards}
			>
				<Icon name="reload" class="h-4 w-4" />
			</button>
		{/if}
	</div>

	{#key refresh}
		<PokemonCards {startTimer} {stopTimer} />
	{/key}

	<div class="grid grid-cols-3 w-full items-center text-neutral-800 dark:text-white">
		<button on:click={changeColorScheme} class="py-4 opacity-60 text-left">
			<p>{$preferred === 'dark' ? 'Dark' : 'Light'} Mode</p>
		</button>
		<p
			class={`text-center ${interval ? 'animate-pulse font-bold' : ''} ${finish ? 'text-xl font-bold ' : 'opacity-60'}`}
		>
			{formatTime(elapsed)}
		</p>
		<button class="py-4 opacity-60 text-right" on:click={() => (showModal = true)}>
			<p>About ?</p>
		</button>
	</div>

	<ModalAbout bind:showModal />
</div>
