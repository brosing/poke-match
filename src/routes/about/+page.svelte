<script lang="ts">
	import { goto } from "$app/navigation";
	import { localStorageStore } from "../../utils/local-storage";

  const leaderboard = localStorageStore<string[]>('leaderboard', []);
  let fastestTime: string;

  leaderboard?.subscribe((data: string[]) => {
    if (data[0]) {
      fastestTime = data.sort()[0]
    } else {
      fastestTime = '-'
    }
  })
</script>

<div class="relative flex flex-col h-screen w-screen justify-center items-center text-neutral-800 dark:text-white gap-2">
  <button on:click={() => goto('/')} class="absolute top-4 right-4">x</button>
  <h2 class="text-xl font-bold mb-4">About</h2>
  <p>Credit to <a href="https://beta.pokeapi.co" class="underline">Poke API</a></p>
  <p>Your fastest time is: {fastestTime}</p>
</div>