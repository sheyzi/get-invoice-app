<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/stores/user';
	import { page } from '$app/stores';
	import { Navbar } from '$lib/components/ui/navbar';
	import { onMount } from 'svelte';
	import { listOrganizations, getActiveOrganization } from '$lib/appwrite';
	import { organizationsStore, activeOrganizationStore } from '$lib/stores/organization';
	import { Loader2 } from 'lucide-svelte';
	import Breadcrumb from '../../lib/components/breadcrumb.svelte';

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

<main class="container mt-16 px-5 md:px-10">
	<div
		class="mx-auto mb-10 mt-32 flex h-full min-h-[calc(100vh-4rem)] w-full max-w-4xl flex-col items-center justify-start"
	>
		{#if loading}
			<Loader2 class="animate-spin" />
		{:else}
			<div class="h-full w-full">
				<Breadcrumb />
				<div class="mt-10">
					<slot />
				</div>
			</div>
		{/if}
	</div>
</main>
