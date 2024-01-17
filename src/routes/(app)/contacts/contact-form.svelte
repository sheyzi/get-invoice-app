<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { contactSchema, type ContactSchema } from './schema';

	import * as Form from '$lib/components/ui/form';
	import { toast } from 'svelte-sonner';
	import { type Models } from 'appwrite';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import {
		createContact,
		updateContact,
		type CreateContact,
		getActiveOrganization
	} from '$lib/appwrite';
	import { activeOrganizationStore } from '$lib/stores/organization';
	import { Loader2 } from 'lucide-svelte';

	export let form: SuperValidated<ContactSchema>;
	export let contactToEdit: Models.Document | null = null;

	let loading = false;

	const handleResult = async (event: any) => {
		const result = event.result as any;
		try {
			if (result.status === 200) {
				if (!contactToEdit) {
					let dataToSend: CreateContact = {
						name: result.data.form.data.name as string,
						email: result.data.form.data.email as string,
						address: result.data.form.data.address as string,
						phone: result.data.form.data.phone as string,
						vat_id: result.data.form.data.vat_id as string
					};

					await createContact(dataToSend);

					const activeOrganization = await getActiveOrganization();
					activeOrganizationStore.set(activeOrganization);

					toast.success('Contact created successfully');
				} else {
					let dataToSend: CreateContact = {
						name: result.data.form.data.name as string,
						email: result.data.form.data.email as string,
						address: result.data.form.data.address as string,
						phone: result.data.form.data.phone as string,
						vat_id: result.data.form.data.vat_id as string
					};

					await updateContact(contactToEdit.$id, dataToSend);

					const activeOrganization = await getActiveOrganization();

					activeOrganizationStore.set(activeOrganization);

					toast.success('Contact updated successfully');
				}

				const redirect = $page.url.searchParams.get('redirect') || '/contacts';
				await goto(redirect);
			}
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong. Please try again later.');
		} finally {
			loading = false;
		}
	};
</script>

<Form.Root
	{form}
	method="POST"
	schema={contactSchema}
	let:config
	let:submitting
	options={{
		onResult: handleResult
	}}
	class="space-y-4"
>
	<Form.Field {config} name="name">
		<Form.Label required>Name</Form.Label>
		<Form.Input initialValue={contactToEdit?.name ?? ''} />
		<Form.Validation />
	</Form.Field>

	<Form.Field {config} name="email">
		<Form.Label required>Email</Form.Label>
		<Form.Input initialValue={contactToEdit?.email ?? ''} />
		<Form.Validation />
	</Form.Field>

	<Form.Field {config} name="address">
		<Form.Label required>Address</Form.Label>
		<Form.Input initialValue={contactToEdit?.address ?? ''} />
		<Form.Validation />
	</Form.Field>

	<Form.Field {config} name="phone">
		<Form.Label>Phone</Form.Label>
		<Form.Input initialValue={contactToEdit?.phone ?? ''} />
		<Form.Validation />
	</Form.Field>

	<Form.Field {config} name="vat_id">
		<Form.Label>Vat ID</Form.Label>
		<Form.Input initialValue={contactToEdit?.phone ?? ''} />
		<Form.Validation />
	</Form.Field>

	<Form.Button type="submit" disabled={loading}>
		{#if loading || submitting}
			<Loader2 class="animate-spin" />
		{:else}
			{contactToEdit ? 'Save Changes' : 'Create Contact'}
		{/if}
	</Form.Button>
</Form.Root>
