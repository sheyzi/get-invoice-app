<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { organizationsStore, activeOrganizationStore } from '$lib/stores/organization';

	import { Loader2, Ban } from 'lucide-svelte';
	import { ActiveOrg } from '$lib/components/ui/active-org';
	import OrganizationChildCard from '$lib/components/ui/organization-child-card/organization-child-card.svelte';

	let switchingOrganizations = false;

	$: showEmptyState = $activeOrganizationStore?.invoices.length === 0;
</script>

<svelte:head>
	<title>Invoices - Get Invoice</title>
</svelte:head>

<ActiveOrg bind:switchingOrganizations />

<OrganizationChildCard
	bind:showEmptyState
	name="invoice"
	bind:switchingOrganizations
	createUrl="/invoices/create"
	watchContact={true}
>
	Content Here
</OrganizationChildCard>
