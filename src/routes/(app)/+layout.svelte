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
	<div
		class="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl flex-col items-center justify-center"
	>
		<slot />
	</div>
</main>
