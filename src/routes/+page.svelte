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

	// Handle global keyboard listeners
	function handleKeyDown(e: KeyboardEvent) {
		if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName) || (e.target as HTMLElement)?.isContentEditable) return;
		
		const key = e.key.toLowerCase();
		if (key === 't') {
			e.preventDefault();
			changeColorScheme();
		} else if (key === 'r') {
			e.preventDefault();
			reloadCards();
		}
	}
</script>

<svelte:window bind:innerWidth={windowWidth} onkeydown={handleKeyDown} />

<div
	class={`
	flex flex-col h-dvh w-screen ${gameSize >= 18 ? 'md:max-w-screen-lg' : 'md:max-w-screen-sm'} p-4 md:mx-auto md:justify-center md:gap-6
	transition-all duration-500 ease-in-out
	`}
	style={`padding-bottom: ${sab};`}
>
	<!-- Header Bar -->
	<header
		class="relative py-4 md:py-6 flex flex-row items-center justify-between border-b"
		style="border-color: var(--border-color);"
	>
		<div class="flex-1">
			{#if finish}
				<h1
					class="text-4xl md:text-5xl font-bold uppercase tracking-tight"
					style="color: var(--accent-green-text);"
					transition:slide={{ delay: 300, duration: 300, easing: quintOut, axis: 'y' }}
				>
					Congratulations!
				</h1>
			{:else}
				<h1
					class="text-4xl md:text-5xl font-bold tracking-tight"
					style="color: var(--text-primary);"
					transition:slide={{ delay: 300, duration: 300, easing: quintOut, axis: 'y' }}
				>
					Poke Match
				</h1>
			{/if}
		</div>

		<!-- Difficulty selector and Reset control -->
		<div class="relative flex items-center gap-4">
			{#if !finish}
				<!-- Segmented difficulty selector on desktop -->
				<div 
					class="hidden md:flex flex-row items-center gap-0.5 p-0.5 rounded-lg border text-sm font-medium" 
					style="background-color: var(--bg-color); border-color: var(--border-color);"
					transition:fade={{ duration: 200 }}
				>
					{#each [
						{ label: 'Easy', size: 12 },
						{ label: 'Medium', size: 18 },
						{ label: 'Hard', size: 32 }
					] as { label, size }}
						<button 
							onclick={() => updateGameSize(size)}
							class={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap text-xs font-semibold ${gameSize === size ? 'shadow-sm' : 'opacity-60 hover:opacity-100'}`}
							style={gameSize === size ? 'background-color: var(--surface-color); border: 1px solid var(--border-color-hover); color: var(--text-primary);' : 'background-color: transparent; border: 1px solid transparent; color: var(--text-secondary);'}
						>
							{label} ({size})
						</button>
					{/each}
				</div>
			{/if}

			<!-- Always-available Restart Button -->
			<button
				class="p-2 rounded-md border hover-lift opacity-80 hover:opacity-100 flex items-center gap-1.5 transition-all text-xs"
				style="background-color: var(--surface-color); border-color: var(--border-color); color: var(--text-primary);"
				onclick={reloadCards}
				aria-label="Restart game"
			>
				<Icon name="reload" class="h-3.5 w-3.5" />
				<span class="hidden md:inline font-mono opacity-50 uppercase text-[10px] tracking-widest">[R]</span>
			</button>
		</div>
	</header>

	<!-- Cards Canvas Area -->
	<div class="flex-1 grid grid-cols-1 grid-rows-1 overflow-hidden py-2 md:py-4">
		{#key refresh}
			<div
				class="col-start-1 row-start-1 h-full w-full"
				in:fade={{ duration: 300, delay: 100 }}
				out:fade={{ duration: 150 }}
			>
				<!-- Cards grid components -->
				<PokemonCards {startTimer} {stopTimer} pairCount={gameSize / 2} />
			</div>
		{/key}
	</div>

	<!-- Bottom Control Dashboard -->
	<footer 
		class="grid grid-cols-3 w-full items-center min-h-12 border-t text-sm font-semibold"
		style="border-color: var(--border-color);"
	>
		<!-- Theme toggle button -->
		<button 
			onclick={changeColorScheme} 
			class="py-3 opacity-60 hover:opacity-100 text-left hover-lift flex items-center gap-2"
			style="color: var(--text-secondary);"
		>
			<span class="capitalize text-xs md:text-sm">{$preferred === 'dark' ? 'Dark' : 'Light'} Mode</span>
			<span class="hidden md:inline font-mono text-[10px] opacity-65 border px-1 rounded" style="border-color: var(--border-color); background-color: var(--surface-color);">T</span>
		</button>

		<!-- Large, centered game timer -->
		<div class="flex justify-center items-center">
			<p
				class={`text-center font-mono tracking-widest text-lg py-1 px-3 rounded-full border ${interval ? 'animate-pulse font-bold' : ''} ${finish ? 'font-bold' : 'opacity-70'}`}
				style={finish ? 'background-color: var(--accent-green-bg); color: var(--accent-green-text); border-color: var(--accent-green-text);' : 'background-color: var(--surface-color); border-color: var(--border-color); color: var(--text-primary);'}
			>
				{formatTime(elapsed)}
			</p>
		</div>

		<!-- About info trigger -->
		<button 
			class="py-3 opacity-60 hover:opacity-100 text-right hover-lift text-xs md:text-sm" 
			style="color: var(--text-secondary);"
			onclick={() => (showModal = true)}
		>
			About ?
		</button>
	</footer>

	<!-- Modal definition -->
	<ModalAbout bind:showModal {sab} />
</div>
