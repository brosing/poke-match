<script lang="ts">
	import { page } from '$app/state';
	import { PUBLIC_IMAGE_URL } from '$env/static/public';
	import Icon from '../../components/icon.svelte';
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { browser } from '$app/environment';

	let id = $derived(page.params.id);
	let pokemonDetails = $state<any>(null);
	let loadingDetails = $state(true);
	let name = $state('');

	async function fetchDetails(pokemonId: string) {
		loadingDetails = true;
		try {
			const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
			if (res.ok) {
				pokemonDetails = await res.json();
				name = pokemonDetails.name;
			}
		} catch (e) {
			console.error(e);
		} finally {
			loadingDetails = false;
		}
	}

	$effect(() => {
		if (id) {
			fetchDetails(id);
		}
	});

	function goBack() {
		window.history.back();
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md" style="background-color: rgba(0, 0, 0, 0.4);">
	<div 
		class="relative w-full max-w-sm p-6 rounded-2xl border shadow-2xl flex flex-col gap-5 overflow-hidden"
		style="background-color: var(--surface-color); border-color: var(--border-color); color: var(--text-primary); view-transition-name: pokemon-detail-card;"
	>
		<!-- Header Details -->
		<div class="flex justify-between items-start">
			<div>
				<span class="font-mono text-xs opacity-65 tracking-widest font-bold">#{String(id).padStart(4, '0')}</span>
				<h2 class="text-4xl font-bold tracking-tight capitalize mt-0.5">{name}</h2>
			</div>
			<button 
				class="p-1.5 rounded-full border hover-lift opacity-70 hover:opacity-100 transition-all"
				style="background-color: var(--bg-color); border-color: var(--border-color); color: var(--text-primary);"
				onclick={goBack}
				aria-label="Close Details"
			>
				<Icon name="x" class="h-3 w-3" />
			</button>
		</div>

		<!-- Image Artwork Showcase -->
		<div class="w-full h-44 flex items-center justify-center rounded-xl p-3 relative overflow-hidden" style="background-color: var(--bg-color);">
			<img 
				alt={name}
				src={`${PUBLIC_IMAGE_URL}/${id}.png`}
				class="max-w-[75%] max-h-[75%] object-contain z-10 animate-bounce-slow"
				style={`view-transition-name: pokemon-image-${id};`}
			/>
		</div>

		<!-- Dynamic stats load -->
		{#if loadingDetails}
			<div class="h-44 flex flex-col justify-center items-center gap-3">
				<div class="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style="border-color: var(--text-secondary); border-top-color: transparent;"></div>
				<span class="text-[10px] uppercase tracking-widest font-mono opacity-60">Fetching Attributes...</span>
			</div>
		{:else}
			{@const details = pokemonDetails}
			{#if details}
				<div class="flex flex-col gap-4 overflow-y-auto max-h-56 pr-0.5">
					<!-- Row of Types & Attributes -->
					<div class="grid grid-cols-2 gap-4 border-b pb-3.5" style="border-color: var(--border-color);">
						<div>
							<span class="text-[10px] font-mono uppercase tracking-widest opacity-60 block mb-1.5">Types</span>
							<div class="flex flex-wrap gap-1">
								{#each details.types as { type }}
									<span class="px-2 py-0.5 text-[10px] rounded border font-mono font-semibold capitalize" style="background-color: var(--accent-blue-bg); color: var(--accent-blue-text); border-color: rgba(31,108,159,0.12);">
										{type.name}
									</span>
								{/each}
							</div>
						</div>
						<div>
							<span class="text-[10px] font-mono uppercase tracking-widest opacity-60 block mb-1.5">Physical</span>
							<p class="text-xs font-semibold leading-relaxed">
								Height: {details.height / 10} m <br />
								Weight: {details.weight / 10} kg
							</p>
						</div>
					</div>

					<!-- Base Stats bars -->
					<div class="flex flex-col gap-2">
						<span class="text-[10px] font-mono uppercase tracking-widest opacity-60 block">Base Stats</span>
						<div class="flex flex-col gap-1.5">
							{#each details.stats as { base_stat, stat }}
								<div class="flex items-center text-xs gap-3">
									<span class="w-16 uppercase font-mono text-[9px] opacity-75 truncate">{stat.name.replace('special-', 'sp. ')}</span>
									<div class="flex-1 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
										<div class="h-full rounded-full transition-all duration-500" style={`width: ${Math.min(100, (base_stat / 150) * 100)}%; background-color: var(--accent-blue-text);`}></div>
									</div>
									<span class="w-6 text-right font-mono text-[10px] font-bold">{base_stat}</span>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{:else}
				<div class="h-44 flex items-center justify-center text-center text-xs opacity-60">
					Failed to load Pokemon statistics.
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	/* Custom bounce animation for detail card pokemon artwork */
	:global(.animate-bounce-slow) {
		animation: bounce-slow 4s ease-in-out infinite;
	}
	@keyframes bounce-slow {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-8px);
		}
	}
</style>
