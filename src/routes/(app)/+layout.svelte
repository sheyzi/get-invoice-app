<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/stores/user';
	import { page } from '$app/stores';
	import { Navbar } from '$lib/components/ui/navbar';

	$: if (!$currentUser) {
		goto(`/auth/login?redirect=${encodeURIComponent($page.url.pathname)}`);
	}
</script>

<Navbar />

<main class="container mt-16">
	<slot />
</main>
