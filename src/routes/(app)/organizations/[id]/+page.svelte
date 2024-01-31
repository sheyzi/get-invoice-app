<script lang="ts">
	import { getOrganization } from '$lib/appwrite';
	import { page } from '$app/stores';
	import { Loader2 } from 'lucide-svelte';
	import OrganizationForm from '../organization-form.svelte';

	import { FormWrapper } from '$lib/components/ui/form-wrapper';

	const getOrganizationData = async (id: string) => {
		const organization = await getOrganization(id);
		return organization;
	};

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
		<OrganizationForm organizationToEdit={organization} />
	</FormWrapper>
{/await}
