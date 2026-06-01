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
	class="h-fit w-[85%] md:w-[420px] rounded-2xl border p-0 overflow-hidden relative backdrop-blur-md"
	style="background-color: var(--surface-color); border-color: var(--border-color); color: var(--text-primary); outline: none;"
>
	<!-- Modal Content Panel -->
	<div
		role="document"
		class="gap-5 p-6 pb-6 flex flex-col relative text-md"
	>
		<!-- Close Button -->
		<button
			class="absolute top-4 right-4 p-1.5 rounded-full border hover-lift opacity-70 hover:opacity-100 transition-all"
			style="background-color: var(--bg-color); border-color: var(--border-color); color: var(--text-primary);"
			onclick={() => dialog?.close()}
			aria-label="Close About"
		>
			<Icon name="x" class="h-3 w-3" />
		</button>

		<!-- Heading -->
		<div>
			<h2 class="text-4xl font-bold tracking-tight mb-1" style="color: var(--text-primary);">About</h2>
			<p class="text-xs uppercase tracking-wider opacity-65" style="color: var(--text-secondary);">
				Memory Match Game
			</p>
		</div>

		<!-- Credits -->
		<p class="text-sm opacity-85">
			Game data from <a href="https://pokeapi.co" target="_blank" rel="noopener" class="underline hover:opacity-100 transition-opacity">Poke API</a>.
		</p>

		<!-- Leaderboard best times -->
		<div class="flex flex-col gap-2 mt-2" ondblclick={toggleSAB}>
			<h3 class="text-xs uppercase tracking-widest font-mono font-semibold" style="color: var(--text-secondary);">Your Best Times</h3>
			<div class="border rounded-xl p-3.5 flex flex-col gap-2.5" style="background-color: var(--bg-color); border-color: var(--border-color);">
				{#if bestTimes.length > 0}
					{#each bestTimes as entry}
						<div class="flex justify-between items-center text-sm border-b pb-1.5 last:border-0 last:pb-0" style="border-color: var(--border-color);">
							<span class="font-mono text-xs uppercase tracking-wider" style="color: var(--text-secondary);">{entry.label}</span>
							<span class="font-mono font-bold tracking-widest" style="color: var(--text-primary);">{entry.time}</span>
						</div>
					{/each}
				{:else}
					<p class="text-center text-xs opacity-50 py-2">No records yet</p>
				{/if}
			</div>
		</div>

		{#if showSAB}
			<p class="font-mono text-xs opacity-60">SAB Offset: {sab}</p>
		{/if}

		<!-- Feedback button -->
		<button 
			class="flex items-center justify-center gap-2 py-2.5 px-4 border rounded-xl w-full text-xs font-semibold uppercase tracking-wider hover-lift transition-all"
			style="background-color: var(--surface-color); border-color: var(--border-color); color: var(--text-primary);"
			onclick={sendEmail}
		>
			Give Feedback <Icon name="email" class="h-3.5 w-3.5" />
		</button>

		<!-- PWA Prompt -->
		<div 
			class="p-4 border rounded-xl text-center text-xs leading-relaxed" 
			style="background-color: var(--accent-blue-bg); border-color: rgba(31, 108, 159, 0.12); color: var(--accent-blue-text);"
		>
			<p class="font-bold mb-1.5">Add to Home Screen</p>
			<p class="opacity-90">Install this web app to your Mobile Home Screen: Tap share / option then select <span class="font-bold">"Add to Home Screen"</span>.</p>
		</div>
	</div>
</dialog>

<style>
	/* Animation: entry zoom and backdrop fade-in */
	dialog[open] {
		animation: zoom 0.3s var(--transition-smooth);
	}
	@keyframes zoom {
		from {
			transform: scale(0.96);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	
	dialog[open]::backdrop {
		animation: fade-in 0.25s ease-out;
		background-color: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
	}
	
	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
