<script lang="ts">
	import OrganizationForm from '../organization-form.svelte';
	import { FormWrapper } from '$lib/components/ui/form-wrapper';
</script>

<svelte:head>
	<title>Create Organizations - Get Invoice</title>
</svelte:head>

<FormWrapper
	title="Create Organization"
	description="Fill the form below to create a new organization"
>
	<OrganizationForm />
</FormWrapper>
