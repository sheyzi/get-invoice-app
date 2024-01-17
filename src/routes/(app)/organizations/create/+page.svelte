<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import OrganizationForm from '../organization-form.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Create Organizations - Get Invoice</title>
</svelte:head>

<Card.Root class="w-full">
	<Card.Header>
		<Card.Title tag="h1" class="text-2xl font-semibold">Create Organization</Card.Title>
		<Card.Description>Fill the form below to create a new organization</Card.Description>
	</Card.Header>
	<Card.Content>
		<OrganizationForm form={data.form} />
	</Card.Content>
</Card.Root>
