<script lang="ts">
	import { browser } from '$app/environment';

	import Icon from '../components/icon.svelte';
	import { getLeaderboardContext } from '$lib/contexts/leaderboard';

	interface Props {
		showModal?: boolean;
		sab?: string;
	}

	let { showModal = $bindable(false), sab = '' }: Props = $props();
	let showSAB = $state(false);
	let dialog: HTMLDialogElement | undefined = $state();
	$effect(() => {
		if (showModal) dialog?.showModal();
	});

	const leaderboard = getLeaderboardContext();
	let bestTimes: { label: string; time: string }[] = $state([]);

	function toggleSAB() {
		showSAB = !showSAB;
	}

	const categoryMap: Record<string, string> = {
		'12': 'Easy',
		'18': 'Medium',
		'32': 'Hard'
	};

	leaderboard?.subscribe((data: Record<string, string[]>) => {
		const results: { label: string; time: string }[] = [];
		for (const [size, times] of Object.entries(data)) {
			if (times.length > 0) {
				const sortedTimes = [...times].sort();
				results.push({
					label: categoryMap[size] || `Size ${size}`,
					time: sortedTimes[0]
				});
			}
		}
		results.sort((a, b) => {
			const sizeA = Object.keys(categoryMap).find((key) => categoryMap[key] === a.label) || '0';
			const sizeB = Object.keys(categoryMap).find((key) => categoryMap[key] === b.label) || '0';
			return parseInt(sizeA) - parseInt(sizeB);
		});
		bestTimes = results;
	});

	function sendEmail() {
		if (browser) {
			// @ts-ignore
			window.location = 'mailto:singgihnn@gmail.com';
		}
	}
</script>

<dialog
	bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={(e) => {
		if (e.target === dialog) dialog?.close();
	}}
	onkeydown={(e) => {
		if (e.key === 'Escape') dialog?.close();
	}}
	class="h-fit w-3/4 md:w-[420px] rounded-xl bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white backdrop:bg-black backdrop:bg-opacity-70"
>
	<div
		role="document"
		class="gap-2 p-4 pb-0 flex flex-col justify-center items-center relative text-lg"
	>
		<h2 class="text-5xl font-bold mb-4">About</h2>
		<button
			class="absolute top-4 right-4 text-neutral-800 dark:text-white"
			onclick={() => dialog?.close()}
		>
			<Icon name="x" class="h-4 w-4" />
		</button>

		<p>Credit to <a href="https://pokeapi.co" target="_blank" class="underline">Poke API</a></p>
		<div class="flex flex-col items-center gap-1 mt-6" ondblclick={toggleSAB}>
			<p>Your fastest time is:</p>
			{#if bestTimes.length > 0}
				{#each bestTimes as entry}
					<p>
						<span class="font-bold uppercase">{entry.label}</span>:
						<span class="font-bold">{entry.time}</span>
					</p>
				{/each}
			{:else}
				<p>No records yet</p>
			{/if}
		</div>

		{#if showSAB}
			<p>sab: {sab}</p>
		{/if}

		<button class="flex gap-2 mt-8" onclick={sendEmail}>
			Give Feedback <Icon name="email" class="h-4 w-4 -bottom-1 relative" />
		</button>

		<div class="p-4 border border-neutral-800 dark:border-white rounded-lg text-center my-4">
			<p>This web is installable to your Mobile Home Screen</p>
			<p>Tap share / options then "Add to Home Screen"</p>
		</div>
	</div>
</dialog>

<style>
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
