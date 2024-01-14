<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { organizationSchema, type OrganizationSchema } from './schema';
	import * as Form from '$lib/components/ui/form';
	import type { FormResult } from 'sveltekit-superforms/client';
	import type { ActionData } from '../$types';
	import { Loader2 } from 'lucide-svelte';
	import { createOrganization, type CreateOrganization, listOrganizations } from '$lib/appwrite';
	import { goto } from '$app/navigation';
	import { AppwriteException } from 'appwrite';
	import { organizations as organizationStore } from '$lib/stores/organization';

	export let form: SuperValidated<OrganizationSchema>;

	let loading = false;
	let error: string | null = null;

	const handleResult = async (event: any) => {
		loading = true;
		error = null;
		const result = event.result as FormResult<ActionData>;

		try {
			if (result.status === 200) {
				let dataToSend: CreateOrganization = {
					name: result.data.form.data.name as string,
					logo: '',
					street: result.data.form.data.street as string,
					city: result.data.form.data.city as string,
					state: result.data.form.data.state as string,
					zip: result.data.form.data.zip as string,
					country: result.data.form.data.country as string,
					phone: result.data.form.data.phone as string,
					website: result.data.form.data.website as string
				};

				const organization = await createOrganization(dataToSend);
				const orgs = await listOrganizations();
				organizationStore.set(orgs);

				await goto('/organizations');
			}
		} catch (e: any) {
			if (e instanceof AppwriteException) {
				error = e.message;
			} else {
				error = 'An error occurred. Please try again later.';
			}
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
	class="grid grid-cols-1 gap-4 space-y-4 md:grid-cols-2"
>
	<Form.Field {config} name="logo">
		<Form.Item class="md:col-span-2">
			<Form.Label>Logo</Form.Label>
			<Form.Input disabled type="image" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="name">
		<Form.Item>
			<Form.Label>Organization Name <span class="text-destructive">*</span></Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="street">
		<Form.Item>
			<Form.Label>Street <span class="text-destructive">*</span></Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="city">
		<Form.Item>
			<Form.Label>City <span class="text-destructive">*</span></Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="state">
		<Form.Item>
			<Form.Label>State <span class="text-destructive">*</span></Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="zip">
		<Form.Item>
			<Form.Label>Zip</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="country">
		<Form.Item>
			<Form.Label>Country <span class="text-destructive">*</span></Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="phone">
		<Form.Item>
			<Form.Label>Phone</Form.Label>
			<Form.Input type="tel" />
			<Form.Description>
				Phone number must start with a country code. For example, +2341234567890
			</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="website">
		<Form.Item>
			<Form.Label>Website</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	{#if message}
		<div class="col-span-2 mt-3 rounded-sm bg-destructive/20 p-3">
			<p class="text-destructive">{message}</p>
		</div>
	{/if}

	{#if error}
		<div class="col-span-2 mt-3 rounded-sm bg-destructive/20 p-3">
			<p class="text-destructive">{error}</p>
		</div>
	{/if}

	<Form.Button type="submit" disabled={submitting} class="md:col-span-2">
		{#if submitting || loading}
			<Loader2 class="animate-spin" />
		{:else}
			Create Organization
		{/if}
	</Form.Button>
</Form.Root>
