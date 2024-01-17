<script lang="ts">
	import { FormWrapper } from '$lib/components/ui/form-wrapper';
	import ContactForm from '../contact-form.svelte';
	import type { PageData } from './$types';
	import { getContact } from '$lib/appwrite';
	import { page } from '$app/stores';
	import { Loader2 } from 'lucide-svelte';

	const getContactData = async (id: string) => {
		const contact = await getContact(id);

		return contact;
	};

	export let data: PageData;

	$: contact = getContactData($page.params.id);
</script>

<svelte:head>
	{#await contact}
		<title>Loading...</title>
	{:then contact}
		<title>{contact.name} - Get Invoice</title>
	{/await}
</svelte:head>

{#await contact}
	<div class="flex w-full items-center justify-center">
		<Loader2 class="animate-spin" />
	</div>
{:then contact}
	<FormWrapper
		title="Edit {contact.name}"
		description="Fill the form below to create a new contact"
	>
		<ContactForm form={data.form} contactToEdit={contact} />
	</FormWrapper>
{/await}
