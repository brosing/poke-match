<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import Icon from '../../components/icon.svelte';
	import { localStorageStore } from '../../utils/local-storage';

	const leaderboard = localStorageStore<string[]>('leaderboard', []);
	let fastestTime: string;

	leaderboard?.subscribe((data: string[]) => {
		if (data[0]) {
			fastestTime = data.sort()[0];
		} else {
			fastestTime = '-';
		}
	});

	function handleCloseButton() {
    goto('/');
	}

	function sendEmail() {
		if (browser) { // @ts-ignore
			window.location = 'mailto:singgihnn@gmail.com';
		}
	}
</script>

<div
	class="relative flex flex-col h-screen w-screen justify-center items-center text-neutral-800 dark:text-white gap-2"
>
	<a
		href="/"
		class="absolute top-4 right-4 text-neutral-800 dark:text-white"
	>
		<Icon name="x" class="h-4 w-4" />
	</a>
	<h2 class="text-xl font-bold mb-4">About</h2>
	<p>Credit to <a href="https://beta.pokeapi.co" class="underline">Poke API</a></p>
	<p>Your fastest time is: <span class="font-bold">{fastestTime}</span></p>
	<button class="flex gap-4 mt-8" on:click={sendEmail}>
		Give Feedback <Icon name="email" class="h-4 w-4" />
	</button>
</div>
