<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { organizationSchema, type OrganizationSchema } from './schema';
	import * as Form from '$lib/components/ui/form';

	import { Loader2 } from 'lucide-svelte';
	import {
		createOrganization,
		type CreateOrganization,
		listOrganizations,
		setActiveOrganization,
		updateOrganization
	} from '$lib/appwrite';
	import { goto } from '$app/navigation';
	import { AppwriteException, type Models } from 'appwrite';
	import {
		organizationsStore as organizationStore,
		activeOrganizationStore
	} from '$lib/stores/organization';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/stores';

	export let form: SuperValidated<OrganizationSchema>;
	export let organizationToEdit: Models.Document | null = null;

	let loading = false;

	const handleResult = async (event: any) => {
		loading = true;
		const result = event.result as any;

		try {
			if (result.status === 200) {
				if (!organizationToEdit) {
					let dataToSend: CreateOrganization = {
						name: result.data.form.data.name as string,
						logo: '',
						email: result.data.form.data.email as string,
						street: result.data.form.data.street as string,
						city: result.data.form.data.city as string,
						state: result.data.form.data.state as string,
						zip: result.data.form.data.zip as string,
						country: result.data.form.data.country as string,
						phone: result.data.form.data.phone as string,
						website: result.data.form.data.website as string,
						vat_id: result.data.form.data.vat_id as string,
						last_invoice_number: '0001'
					};

					const organization = await createOrganization(dataToSend);

					const orgs = await listOrganizations();

					organizationStore.set(orgs);

					if (orgs.length === 1) {
						await setActiveOrganization(organization.$id);
					}

					toast.success('Organization created successfully');
				} else {
					let dataToSend: CreateOrganization = {
						name: result.data.form.data.name as string,
						logo: '',
						email: result.data.form.data.email as string,
						street: result.data.form.data.street as string,
						city: result.data.form.data.city as string,
						state: result.data.form.data.state as string,
						zip: result.data.form.data.zip as string,
						country: result.data.form.data.country as string,
						phone: result.data.form.data.phone as string,
						website: result.data.form.data.website as string,
						vat_id: result.data.form.data.vat_id as string
					};

					await updateOrganization(organizationToEdit.$id, dataToSend);

					const orgs = await listOrganizations();

					organizationStore.set(orgs);

					if ($activeOrganizationStore?.$id === organizationToEdit.$id) {
						await setActiveOrganization(organizationToEdit.$id);
					}

					toast.success('Organization updated successfully');
				}

				const redirect = $page.url.searchParams.get('redirect') || '/organizations';
				await goto(redirect);
			}
		} catch (e: any) {
			toast.error('Something went wrong. Please try again later.');
		} finally {
			loading = false;
		}
	};
</script>

<Form.Root
	method="POST"
	{form}
	schema={organizationSchema}
	let:config
	let:submitting
	let:message
	options={{
		onResult: handleResult
	}}
	class="grid grid-cols-1 gap-4  md:grid-cols-2"
>
	<Form.Field {config} name="logo">
		<Form.Item class="">
			<Form.Label>Logo</Form.Label>
			<Form.Input disabled type="image" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="name">
		<Form.Item>
			<Form.Label required>Organization Name</Form.Label>
			<Form.Input initialValue={organizationToEdit?.name ?? ''} placeholder="Get Invoice" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="email">
		<Form.Item>
			<Form.Label required>Email</Form.Label>
			<Form.Input
				initialValue={organizationToEdit?.email ?? ''}
				type="email"
				placeholder="johndoe@company.com"
			/>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="street">
		<Form.Item>
			<Form.Label required>Street</Form.Label>
			<Form.Input initialValue={organizationToEdit?.street ?? ''} placeholder="1234 Main St" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="city">
		<Form.Item>
			<Form.Label required>City</Form.Label>
			<Form.Input initialValue={organizationToEdit?.city ?? ''} placeholder="Ikeja" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="state">
		<Form.Item>
			<Form.Label required>State</Form.Label>
			<Form.Input initialValue={organizationToEdit?.state ?? ''} placeholder="Lagos" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="zip">
		<Form.Item>
			<Form.Label>Zip</Form.Label>
			<Form.Input initialValue={organizationToEdit?.zip ?? ''} placeholder="12345" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="country">
		<Form.Item>
			<Form.Label required>Country</Form.Label>
			<Form.Input initialValue={organizationToEdit?.country ?? ''} placeholder="Nigeria" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="phone">
		<Form.Item>
			<Form.Label>Phone</Form.Label>
			<Form.Input
				type="tel"
				initialValue={organizationToEdit?.phone ?? ''}
				placeholder="+2341234567890"
			/>
			<Form.Description>
				Phone number must start with a country code. For example, +2341234567890
			</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="vat_id">
		<Form.Item>
			<Form.Label>VAT ID</Form.Label>
			<Form.Input initialValue={organizationToEdit?.vat_id ?? ''} placeholder="123456789" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="website">
		<Form.Item class="md:col-span-2">
			<Form.Label>Website</Form.Label>
			<Form.Input
				type="url"
				initialValue={organizationToEdit?.website ?? ''}
				placeholder="https://example.com"
			/>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	{#if message}
		<div class="col-span-2 mt-3 rounded-sm bg-destructive/20 p-3">
			<p class="text-destructive">{message}</p>
		</div>
	{/if}

	<Form.Button type="submit" disabled={submitting} class="md:col-span-2">
		{#if submitting || loading}
			<Loader2 class="animate-spin" />
		{:else if organizationToEdit}
			Save Changes
		{:else}
			Create Organization
		{/if}
	</Form.Button>
</Form.Root>
