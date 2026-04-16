import { getContext, setContext } from 'svelte';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const LEADERBOARD_CONTEXT_ID = 'leaderboard';
type LeaderboardType = Record<string, string[]>

function createLeaderboardStore(initial: LeaderboardType) {
  if (!browser) return null;

  const local = localStorage.getItem(LEADERBOARD_CONTEXT_ID);
  let value: LeaderboardType;
  
  if (local) {
    const parsed = JSON.parse(local);
    if (Array.isArray(parsed)) {
      // Migration: put old array into category '12' (Easy)
      value = { '12': parsed.filter(t => t !== '00:00') };
    } else {
      value = parsed as LeaderboardType;
    }
  } else {
    value = initial;
  }

	const noZeroValue: LeaderboardType = {};
	for (const key in value) {
		noZeroValue[key] = value[key].filter(time => time !== '00:00')
	}
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
