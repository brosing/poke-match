<script lang="ts">
	import '../app.css';

	import { setColorSchemeContext } from '$lib/contexts/color-scheme';
	import { setLeaderboardContext } from '$lib/contexts/leaderboard';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	inject({ mode: dev ? 'development' : 'production' });

	/** @type {import('./$types).LayoutData} */
	export let data;
	setColorSchemeContext(data.colorScheme);
	setLeaderboardContext([]);
</script>

<slot />
