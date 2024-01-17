<script lang="ts">
	import type { PageData } from './$types';
	import { getOrganization } from '$lib/appwrite';
	import { page } from '$app/stores';
	import { Loader2, Plus } from 'lucide-svelte';
	import OrganizationForm from '../organization-form.svelte';

	import * as Card from '$lib/components/ui/card';

	const getOrganizationData = async (id: string) => {
		const organization = await getOrganization(id);
		return organization;
	};

	export let data: PageData;

	$: organization = getOrganizationData($page.params.id);
</script>

<svelte:head>
	{#await organization}
		<title>Loading...</title>
	{:then organization}
		<title>{organization.name} - Get Invoice</title>
	{/await}
</svelte:head>

{#await organization}
	<div class="flex w-full items-center justify-center">
		<Loader2 class="animate-spin" />
	</div>
{:then organization}
	<Card.Root class="w-full">
		<Card.Header>
			<div class="flex w-full items-center justify-between">
				<h1 class="text-2xl font-semibold">Edit {organization.name}</h1>
			</div>
		</Card.Header>
		<Card.Content>
			<OrganizationForm form={data.form} organizationToEdit={organization} />
		</Card.Content>
	</Card.Root>
{/await}
