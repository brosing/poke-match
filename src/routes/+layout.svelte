<script lang="ts">
	import '../app.css';

	import { setColorSchemeContext } from '$lib/contexts/color-scheme';
	import { setLeaderboardContext } from '$lib/contexts/leaderboard';

	
	interface Props {
		data: import('./$types').LayoutData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();
	setColorSchemeContext(data.colorScheme);
	setLeaderboardContext({});

	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

{@render children?.()}
