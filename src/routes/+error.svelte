<script>
	import { page } from '$app/stores';
</script>

<div class="w-svw h-dvh flex justify-center items-center">
	<h1>{$page.error?.message}</h1>
</div>