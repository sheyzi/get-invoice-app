<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import OrganizationForm from '../organization-form.svelte';
	import { FormWrapper } from '$lib/components/ui/form-wrapper';

	export let data: PageData;
</script>

<svelte:head>
	<title>Create Organizations - Get Invoice</title>
</svelte:head>

<FormWrapper
	title="Create Organization"
	description="Fill the form below to create a new organization"
>
	<OrganizationForm form={data.form} />
</FormWrapper>
