<script lang="ts">
	import { Loader2 } from 'lucide-svelte';
	import { ActiveOrg } from '$lib/components/ui/active-org';
	import { FormWrapper } from '$lib/components/ui/form-wrapper';
	import ContactForm from '../contact-form.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let switchingOrganizations = false;
</script>

<svelte:head>
	<title>Create Contact - Get Invoice</title>
</svelte:head>

<ActiveOrg bind:switchingOrganizations />

<FormWrapper title="Create Contact" description="Fill the form below to create a new contact">
	{#if switchingOrganizations}
		<div class="flex w-full items-center justify-center">
			<Loader2 class="animate-spin" />
		</div>
	{:else}
		<ContactForm form={data.form} />
	{/if}
</FormWrapper>
