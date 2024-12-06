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
	setLeaderboardContext([]);
</script>

{@render children?.()}
