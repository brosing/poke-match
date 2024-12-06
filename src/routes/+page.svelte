<script lang="ts">
	import { run } from 'svelte/legacy';

	import { onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { fade, slide } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { getColorSchemeContext } from '$lib/contexts/color-scheme';
	import { getLeaderboardContext } from '$lib/contexts/leaderboard';
	import successMp3 from '$lib/sound/success.mp3';
	import { isPwa, formatTime } from '$utils';

	import Icon from './components/icon.svelte';
	import PokemonCards from './components/pokemon-cards.svelte';
	import ModalAbout from './components/about.svelte';

	const colorSchemeStore = getColorSchemeContext();
	let preferred = $derived(colorSchemeStore.preferred);
	function changeColorScheme() {
		const color = $preferred === 'dark' ? 'light' : 'dark';
		colorSchemeStore.change(color);
	}

	let sab = $state('0px');
	let leaderboard = getLeaderboardContext();
	let elapsed = $state(0);
	let interval: number | undefined = $state();
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
		if (newTime !== '00:00') {
			leaderboard?.update((data) => [...data, newTime]);
		}
		clearInterval(interval);
		interval = undefined;
	}

	onMount(() => {
		// handle bottom space "sab"
		const bottomSpace = getComputedStyle(document.documentElement).getPropertyValue('--sab');
		if (bottomSpace) {
			sab = bottomSpace;
		} else {
			// check if current web is installed as PWA
			if (isPwa()) sab = '34px';
		}

		return () => {
			// handle game time counter "elapsed & interval"
			clearInterval(interval);
		};
	});

	let refresh: number = $state(0);
	const reloadCards = () => {
		refresh = Math.random();
		clearInterval(interval);
		interval = undefined;
		elapsed = 0;
	};

	let finish = $derived(interval === undefined && elapsed > 0);
	run(() => {
		if (finish && browser) {
			let successSound = new Audio(successMp3)
			setTimeout(() => {
				successSound.play()
			}, 1200);
		}
	});
	let showModal = $state(false);
</script>

<div
	class={`
  flex flex-col h-dvh w-screen md:max-w-screen-sm p-4 md:mx-auto md:justify-center md:gap-4
  text-neutral-800 dark:text-white
  `}
	style={`padding-bottom: ${sab};`}
>
	<div
		class="relative py-4 md:mb-8 flex flex-1 md:flex-[0] flex-row items-center justify-between transition-all"
	>
		<div>
			{#if finish}
				<p
					class="text-5xl font-bold animate-flash-infinite"
					transition:slide={{ delay: 1000, duration: 300, easing: quintOut, axis: 'y' }}
				>
					Congratulation!
				</p>
			{:else}
				<h1
					class="text-5xl font-bold"
					transition:slide={{ delay: 1000, duration: 300, easing: quintOut, axis: 'y' }}
				>
					Poke Match
				</h1>
			{/if}
		</div>
		{#if finish}
			<button
				transition:fade={{ duration: 800 }}
				class="text-neutral-800 dark:text-white px-4 -mb-2"
				onclick={reloadCards}
			>
				<Icon name="reload" class="h-4 w-4" />
			</button>
		{/if}
	</div>

	{#key refresh}
		<PokemonCards {startTimer} {stopTimer} />
	{/key}

	<div class="grid grid-cols-3 w-full items-center text-neutral-800 dark:text-white min-h-8">
		<button onclick={changeColorScheme} class="py-4 opacity-60 text-left">
			<p>{$preferred === 'dark' ? 'Dark' : 'Light'} Mode</p>
		</button>
		<p
			class={`text-center ${interval ? 'animate-pulse font-bold' : ''} ${finish ? 'text-xl font-bold ' : 'opacity-60'}`}
		>
			{formatTime(elapsed)}
		</p>
		<button class="py-4 opacity-60 text-right" onclick={() => (showModal = true)}>
			<p>About ?</p>
		</button>
	</div>

	<ModalAbout bind:showModal {sab} />
</div>
