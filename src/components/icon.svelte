<script lang="ts">
  type IconName = 'x' | 'email'
  export let name: IconName
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class={`w-6 h-6 ${$$props.class}`}>
  {#if name == 'x'}
  <line x1="18" y1="6" x2="6" y2="18" fill="currentColor"></line><line x1="6" y1="6" x2="18" y2="18" fill="currentColor"></line>

  {:else if name="email"}
  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>

  {:else}
  <circle cx="12" cy="12" r="10" fill="currentColor"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2" fill="currentColor"></path><line x1="9" y1="9" x2="9.01" y2="9" fill="currentColor"></line><line x1="15" y1="9" x2="15.01" y2="9" fill="currentColor"></line>
  {/if}
</svg>