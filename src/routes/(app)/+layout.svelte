<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/stores/user';
	import { page } from '$app/stores';
	import { Navbar } from '$lib/components/ui/navbar';
	import { onMount } from 'svelte';
	import { listOrganizations, getActiveOrganization } from '$lib/appwrite';
	import { organizationsStore, activeOrganizationStore } from '$lib/stores/organization';
	import { Loader2 } from 'lucide-svelte';

	$: if (!$currentUser) {
		goto(`/auth/login?redirect=${encodeURIComponent($page.url.pathname)}`);
	}

	let loading = false;

	onMount(async () => {
		loading = true;
		try {
			const orgs = await listOrganizations();
			organizationsStore.set(orgs);
			const activeOrg = await getActiveOrganization();
			activeOrganizationStore.set(activeOrg ?? null);
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	});
</script>

<Navbar />

<main class="container mt-16">
	<div
		class="mx-auto mt-32 flex h-full min-h-[calc(100vh-4rem)] w-full max-w-4xl flex-col items-center justify-start"
	>
		{#if loading}
			<Loader2 class="animate-spin" />
		{:else}
			<div class="h-full w-full">
				<slot />
			</div>
		{/if}
	</div>
</main>
