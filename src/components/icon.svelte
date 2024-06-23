<script lang="ts">
  type IconName = 'x' | 'email' | 'reload'
  export let name: IconName
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class={`w-6 h-6 ${$$props.class}`}>
  {#if name === 'x'}
  <line x1="18" y1="6" x2="6" y2="18" fill="currentColor"></line><line x1="6" y1="6" x2="18" y2="18" fill="currentColor"></line>

  {:else if name === "email"}
  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>

  {:else if name === "reload"}
  <polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>

  {:else}
  <circle cx="12" cy="12" r="10" fill="currentColor"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2" fill="currentColor"></path><line x1="9" y1="9" x2="9.01" y2="9" fill="currentColor"></line><line x1="15" y1="9" x2="15.01" y2="9" fill="currentColor"></line>
  {/if}
</svg>