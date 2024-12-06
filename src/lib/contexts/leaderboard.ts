import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const LEADERBOARD_CONTEXT_ID = 'leaderboard';
type LeaderboardType = string[]

function createLeaderboardStore(initial: LeaderboardType) {
  if (!browser) return null;

  const local = localStorage.getItem(LEADERBOARD_CONTEXT_ID);
  const value = local ? JSON.parse(local) as LeaderboardType: initial;
	// NOTE a fix for previouse bugs, included zero time in leaderboard
	const noZeroValue = value.filter(time => time !== '00:00')
	const { subscribe, update} = writable(noZeroValue);

  subscribe((currentValue) => {
    localStorage.setItem(LEADERBOARD_CONTEXT_ID, JSON.stringify(currentValue));
  })

	return {
		subscribe,
		update,
	};
}

export function setLeaderboardContext(initial: LeaderboardType) {
	return setContext(LEADERBOARD_CONTEXT_ID, createLeaderboardStore(initial));
}

export function getLeaderboardContext() {
	return getContext<ReturnType<typeof setLeaderboardContext>>(LEADERBOARD_CONTEXT_ID);
}
