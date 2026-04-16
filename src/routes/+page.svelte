<script lang="ts">
	import { onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { fade, slide } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { getColorSchemeContext } from '$lib/contexts/color-scheme';
	import { getLeaderboardContext } from '$lib/contexts/leaderboard';
	import successMp3 from '$lib/sound/success.mp3';
	import { isPwa, formatTime, localStorageStore } from '$utils';

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
	let windowWidth = $state(0);

	const gameSizeStore = localStorageStore<number>('gameSize', 12);
	let gameSize = $derived(gameSizeStore ? $gameSizeStore : 12);

	$effect(() => {
		if (windowWidth > 0 && windowWidth < 768 && gameSize !== 12) {
			updateGameSize(12);
		}
	});

	function updateGameSize(size: number) {
		gameSizeStore?.set(size);
		reloadCards();
	}
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
			leaderboard?.update((data) => {
				const current = data[gameSize] || [];
				return { ...data, [gameSize]: [...current, newTime] };
			});
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

	let refresh = $state(false);
	const reloadCards = () => {
		refresh = !refresh
		clearInterval(interval);
		interval = undefined;
		elapsed = 0;
	};

	let finish = $derived(interval === undefined && elapsed > 0);
	$effect(() => {
		if (browser && finish) {
			let successSound = new Audio(successMp3)
			setTimeout(() => {
				successSound.play()
			}, 1200);
		}
	});
	let showModal = $state(false);
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div
	class={`
  flex flex-col h-dvh w-screen ${gameSize >= 18 ? 'md:max-w-screen-lg' : 'md:max-w-screen-sm'} p-4 md:mx-auto md:justify-center md:gap-4
  text-neutral-800 dark:text-white
  `}
	style={`padding-bottom: ${sab};`}
>
	<div
		class="relative py-4 md:mb-2 flex flex-1 md:flex-[0] flex-row items-center justify-between transition-all"
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
		<div class="relative flex items-center justify-end min-w-[200px]">
			{#if finish}
				<div class="absolute right-0 -top-4 h-8 flex justify-center items-center" transition:fade={{ duration: 300 }}>
					<button
						class="text-neutral-800 dark:text-white px-4"
						onclick={reloadCards}
					>
						<Icon name="reload" class="h-4 w-4" />
					</button>
				</div>
			{:else}
				<div class="absolute right-0 hidden md:flex flex-row items-center gap-2 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg text-sm font-medium border border-neutral-200 dark:border-neutral-700" transition:fade={{ duration: 300 }}>
					{#each [
						{ label: 'Easy', size: 12 },
						{ label: 'Medium', size: 18 },
						{ label: 'Hard', size: 32 }
					] as { label, size }}
						<button 
							onclick={() => updateGameSize(size)}
							class={`px-3 py-2 rounded-md transition-all whitespace-nowrap ${gameSize === size ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
						>
							{label} ({size})
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	{#key refresh}
		<!-- Pass pairCount based on selected game size -->
		<PokemonCards {startTimer} {stopTimer} pairCount={gameSize / 2} />
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
