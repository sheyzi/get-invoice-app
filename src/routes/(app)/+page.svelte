<script lang="ts">
	import { currentUser } from '$lib/stores/user';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Loader2 } from 'lucide-svelte';
	import { listOrganizations } from '$lib/appwrite';
	import { organizations } from '$lib/stores/organization';
	import { onMount } from 'svelte';
</script>

<svelte:head>
	<title>Invoices - Get Invoice</title>
</svelte:head>

{#if $organizations.length > 0}
	List of invoices
{:else}
	<Card.Root>
		<Card.Header>
			<Card.Title>You don't have any organizations yet.</Card.Title>
		</Card.Header>
		<Card.Footer>
			<Button href="/organizations/create" class="w-full">Create</Button>
		</Card.Footer>
	</Card.Root>
{/if}
