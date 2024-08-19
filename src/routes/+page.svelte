<script lang="ts">
	import { onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { fade, slide } from 'svelte/transition';
	import { browser } from '$app/environment';

	import { Capacitor } from '@capacitor/core';
	import { StatusBar, Style } from '@capacitor/status-bar';

	import { getColorSchemeContext } from '$lib/contexts/color-scheme';
	import { getLeaderboardContext } from '$lib/contexts/leaderboard';
	import successMp3 from '$lib/sound/success.mp3';
	import { isPwa, formatTime } from '$utils';

	import Icon from './components/icon.svelte';
	import PokemonCards from './components/pokemon-cards.svelte';
	import ModalAbout from './components/about.svelte';

	const isMobile = Capacitor.isNativePlatform()
	const colorSchemeStore = getColorSchemeContext();
	$: preferred = colorSchemeStore.preferred;
	function changeColorScheme() {
		const color = $preferred === 'dark' ? 'light' : 'dark';
		colorSchemeStore.change(color);
	}
	colorSchemeStore.subscribe(color => {
		if (isMobile) {
			if (color === 'system') {
				const isDark = $preferred === 'dark';
				StatusBar.setStyle({
					style: isDark ? Style.Dark : Style.Light
				})
				StatusBar.setBackgroundColor({ color: $preferred === 'dark' ? '#262626' : '#ffffff' })
				return
			}

			const isDark = color === 'dark';
			StatusBar.setStyle({
				style: isDark ? Style.Dark : Style.Light
			})
			StatusBar.setBackgroundColor({ color: isDark ? '#262626' : '#ffffff' })
		}
	})

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
			if (isPwa()) sab = '34px';
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
	$: if (finish && browser) {
		let successSound = new Audio(successMp3)
		setTimeout(() => {
			successSound.play()
		}, 1200);
	}
	let showModal = false;
</script>

<div
	class={`
  flex flex-col h-dvh w-screen md:max-w-screen-sm p-4 md:mx-auto md:justify-center md:gap-4
  text-neutral-800 dark:text-white pb-[${sab}]
  `}
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
				on:click={reloadCards}
			>
				<Icon name="reload" class="h-4 w-4" />
			</button>
		{/if}
	</div>

	{#key refresh}
		<PokemonCards {startTimer} {stopTimer} />
	{/key}

	<div class={`grid grid-cols-3 w-full items-center text-neutral-800 dark:text-white min-h-8 ${isMobile ? 'pb-4' : ''}`}>
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

	<ModalAbout bind:showModal {sab} />
</div>
