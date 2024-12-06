<script lang="ts">
	import { run, self, createBubbler, stopPropagation } from 'svelte/legacy';

	const bubble = createBubbler();
	import { browser } from '$app/environment';
	import { localStorageStore } from '$utils';
	
	import Icon from '../components/icon.svelte';
	import { getLeaderboardContext } from '$lib/contexts/leaderboard';

	interface Props {
		showModal?: boolean;
		sab?: string;
	}

	let { showModal = $bindable(false), sab = '' }: Props = $props();
	let showSAB = $state(false);
	let dialog: HTMLDialogElement | undefined = $state();
	run(() => {
		if (dialog && showModal) dialog.showModal();
	});

	const leaderboard = getLeaderboardContext();
	let fastestTime: string = $state('-');

	function toggleSAB() {
		showSAB = !showSAB
	}

	leaderboard?.subscribe((data: string[]) => {
		if (data[0]) {
			fastestTime = data.sort()[0];
		} else {
			fastestTime = '-';
		}
	});

	function sendEmail() {
		if (browser) {
			// @ts-ignore
			window.location = 'mailto:singgihnn@gmail.com';
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={self(() => dialog?.close())}
	class="h-fit w-3/4 md:w-[420px] rounded-xl bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white backdrop:bg-black backdrop:bg-opacity-70"
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		onclick={stopPropagation(bubble('click'))}
		class="gap-2 p-4 pb-0 flex flex-col justify-center items-center relative text-lg"
	>
		<h2 class="text-5xl font-bold mb-4">About</h2>
		<button
			class="absolute top-4 right-4 text-neutral-800 dark:text-white"
			onclick={() => dialog?.close()}
		>
			<Icon name="x" class="h-4 w-4" />
		</button>

		<p>Credit to <a href="https://beta.pokeapi.co" class="underline">Poke API</a></p>
		<p ondblclick={toggleSAB}>Your fastest time is: <span class="font-bold">{fastestTime}</span></p>
		
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
