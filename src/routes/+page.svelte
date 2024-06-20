<script lang="ts">
	import { getColorSchemeContext } from '$lib/contexts/color-scheme';
  import Icon from '../components/icon.svelte';

	const colorSchemeStore = getColorSchemeContext();
	$:preferred = colorSchemeStore.preferred;

	const changeColorScheme = () => {
		const color = $preferred === 'dark' ? 'light' : 'dark';
		colorSchemeStore.change(color);
	};
</script>

<div
	class="
  flex flex-col w-screen h-screen
  bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white transition-colors
  "
>
	<div class="relative">
		<h1 class="text-3xl font-bold m-7 text-center">Poke Match</h1>
		<button
			on:click={changeColorScheme}
			class="absolute right-2 top-4 p-5 text-neutral-800 dark:text-white"
		>
			<Icon name={$preferred === 'dark' ? "dark" : 'light'} fill="parent" />
		</button>
	</div>
</div>
