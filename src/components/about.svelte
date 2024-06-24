<script lang="ts">
	import { browser } from '$app/environment';
	import Icon from '../components/icon.svelte';
	import { localStorageStore } from '../utils/local-storage';

	export let showModal = false;
	let dialog: HTMLDialogElement;
	$: if (dialog && showModal) dialog.showModal();

	const leaderboard = localStorageStore<string[]>('leaderboard', []);
	let fastestTime: string;

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

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
	class="h-fit w-3/4 rounded-xl bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white backdrop:bg-black backdrop:bg-opacity-70"
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		on:click|stopPropagation
		class="gap-2 p-4 pb-0 flex flex-col justify-center items-center relative text-lg"
	>
		<h2 class="text-5xl font-bold mb-4">About</h2>
		<button
			class="absolute top-4 right-4 text-neutral-800 dark:text-white"
			on:click={() => dialog.close()}
		>
			<Icon name="x" class="h-4 w-4" />
		</button>

		<p>Credit to <a href="https://beta.pokeapi.co" class="underline">Poke API</a></p>
		<p>Your fastest time is: <span class="font-bold">{fastestTime}</span></p>
		<button class="flex gap-2 mt-8" on:click={sendEmail}>
			Give Feedback <Icon name="email" class="h-4 w-4 -bottom-1 relative" />
		</button>


		<div class="p-4 border border-neutral-800 dark:border-white rounded-lg text-center my-4">
			<p>This web is installable to your Mobile Home Screen. Tap share / options then "Add to Home Screen"</p>
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
