<script lang="ts">
	import '../app.pcss';
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores/user';
	import { account } from '$lib/appwrite';
	import { AppwriteException } from 'appwrite';
	import { Loader } from '$lib/components/ui/loader';
	import { navigating } from '$app/stores';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';

	let fetching = true;

	onMount(async () => {
		fetching = true;
		try {
			const user = await account.get();
			currentUser.set(user);
		} catch (error) {
			if (error instanceof AppwriteException && error.code === 401) {
				currentUser.set(null);
			} else {
				throw error;
			}
		} finally {
			fetching = false;
		}
	});
</script>

<Toaster richColors />
<ModeWatcher />

{#if !!$navigating}
	<Loader />
{/if}

{#if fetching}
	<Loader />
{:else}
	<slot />
{/if}
