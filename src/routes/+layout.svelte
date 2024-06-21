<script lang="ts">
  import "../app.css";

  import { setColorSchemeContext } from '$lib/contexts/color-scheme';
  /** @type {import('./$types).LayoutData} */
  export let data;
  setColorSchemeContext(data.colorScheme);
</script>

<slot />