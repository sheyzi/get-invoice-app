<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/stores/user';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	onMount(async () => {
		if ($currentUser) {
			const redirect = $page.url.searchParams.get('redirect') || '/';
			await goto(redirect);
		}
	});
</script>

<main class="container">
	<slot />
</main>
