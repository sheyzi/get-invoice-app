<script lang="ts">
	import type { PageData } from './$types';
	import { getOrganization } from '$lib/appwrite';
	import { page } from '$app/stores';
	import { Loader2 } from 'lucide-svelte';
	import OrganizationForm from '../organization-form.svelte';

	import { FormWrapper } from '$lib/components/ui/form-wrapper';

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
	<FormWrapper
		title="Edit Organization"
		description="Fill the form below to edit this organization"
	>
		<OrganizationForm form={data.form} organizationToEdit={organization} />
	</FormWrapper>
{/await}
