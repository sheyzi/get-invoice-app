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
		updateOrganization,
		storage,
		type UpdateOrganization
	} from '$lib/appwrite';
	import { goto } from '$app/navigation';
	import { AppwriteException, ID, type Models } from 'appwrite';
	import {
		organizationsStore as organizationStore,
		activeOrganizationStore
	} from '$lib/stores/organization';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/stores';
	import Label from '../../../lib/components/ui/label/label.svelte';
	import Input from '../../../lib/components/ui/input/input.svelte';
	import { Button } from '../../../lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { PUBLIC_APPWRITE_BUCKET_ID } from '$env/static/public';

	export let organizationToEdit: Models.Document | null = null;
	let organizationLogo = organizationToEdit?.logo ?? null;

	let loading = false;
	let errors: any = {};

	const handleResult = async () => {
		errors = {};
		loading = true;

		return async ({ result, update }: any) => {
			try {
				if (result.status === 200) {
					if (!organizationToEdit) {
						let logoUrl: URL | null = null;

						if (document.getElementById('logo')?.files[0]) {
							let logo = await storage.createFile(
								PUBLIC_APPWRITE_BUCKET_ID,
								ID.unique(),
								document.getElementById('logo')?.files[0]
							);

							logoUrl = await storage.getFileView(PUBLIC_APPWRITE_BUCKET_ID, logo.$id);
						}

						let dataToSend: CreateOrganization = {
							name: result.data.form.data.name as string,
							...(logoUrl && { logo: logoUrl.toString() }),
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
						let dataToSend: UpdateOrganization = {
							name: result.data.form.data.name as string,
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

						if (document.getElementById('logo')?.files[0]) {
							let logo = await storage.createFile(
								PUBLIC_APPWRITE_BUCKET_ID,
								ID.unique(),
								document.getElementById('logo')?.files[0]
							);

							const logoUrl = await storage.getFileView(PUBLIC_APPWRITE_BUCKET_ID, logo.$id);

							try {
								if (organizationToEdit?.logo) {
									let logoToDelete = organizationToEdit?.logo.split('/').at(-2) as string;
									console.log(logoToDelete);
									await storage.deleteFile(PUBLIC_APPWRITE_BUCKET_ID, logoToDelete);
								}
							} catch (err) {
								console.log(err);
							}

							dataToSend = {
								...dataToSend,
								logo: logoUrl.toString()
							};
						}

						await updateOrganization(organizationToEdit.$id, dataToSend);
						const orgs = await listOrganizations();
						organizationStore.set(orgs);
						toast.success('Organization updated successfully');
					}

					const redirect = $page.url.searchParams.get('redirect') || '/organizations';
					await goto(redirect);
				} else if (result.status === 400) {
					console.log(result);
					errors = result.data.form.errors;
				}
			} finally {
				loading = false;
				update();
			}
		};
		// const result = event.result as any;

		// try {
		// 	if (result.status === 200) {
		//
		// 	}
		// } catch (e: any) {
		// 	toast.error('Something went wrong. Please try again later.');
		// } finally {
		// 	loading = false;
		// }
	};

	const handleSelectLogo = (event: any) => {
		const file = event.target.files[0];

		if (file) {
			const reader = new FileReader();

			reader.onload = (e: any) => {
				organizationLogo = e.target.result;
			};

			reader.readAsDataURL(file);
		}
	};
</script>

<!-- <Form.Root
	method="POST"
	enctype="multipart/form-data"
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
			<Form.Input type="file" accept="image/*" />
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
		<div class="col-span-2 mt-3 rounded-sm bg-destructive text-xs/20 p-3">
			<p class="text-destructive text-xs">{message}</p>
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
</Form.Root> -->

<form
	method="post"
	enctype="multipart/form-data"
	class="grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2"
	use:enhance={handleResult}
>
	<div class="space-y-2 md:col-span-2">
		{#if organizationToEdit && organizationToEdit?.logo}
			<img src={organizationLogo} alt="Organization Logo" class="h-24 w-24 rounded-full" />
		{/if}
		<Label for="logo">Logo</Label>

		<Input type="file" accept="image/*" id="logo" name="logo" on:change={handleSelectLogo} />
		{#if errors.logo}
			{#each errors.logo as error}
				<p class="mt-2 text-xs text-destructive">{error}</p>
			{/each}
		{/if}
	</div>

	<div class="space-y-4">
		<Label for="name" required>Organization Name</Label>
		<Input
			type="text"
			id="name"
			name="name"
			placeholder="Get Invoice"
			value={organizationToEdit?.name}
		/>
		{#if errors.name}
			{#each errors.name as error}
				<p class="text-xs text-destructive">{error}</p>
			{/each}
		{/if}
	</div>

	<div class="space-y-4">
		<Label for="email" required>Email</Label>
		<Input
			type="email"
			id="email"
			name="email"
			placeholder="johndoe@company.com"
			value={organizationToEdit?.email}
		/>
		{#if errors.email}
			{#each errors.email as error}
				<p class="text-xs text-destructive">{error}</p>
			{/each}
		{/if}
	</div>

	<div class="space-y-4">
		<Label for="street" required>Street</Label>
		<Input
			type="text"
			id="street"
			name="street"
			placeholder="1234 Main St"
			value={organizationToEdit?.street}
		/>
		{#if errors.street}
			{#each errors.street as error}
				<p class="text-xs text-destructive">{error}</p>
			{/each}
		{/if}
	</div>

	<div class="space-y-4">
		<Label for="city" required>City</Label>
		<Input type="text" id="city" name="city" placeholder="Ikeja" value={organizationToEdit?.city} />
		{#if errors.city}
			{#each errors.city as error}
				<p class="text-xs text-destructive">{error}</p>
			{/each}
		{/if}
	</div>

	<div class="space-y-4">
		<Label for="state" required>State</Label>
		<Input
			type="text"
			id="state"
			name="state"
			placeholder="Lagos"
			value={organizationToEdit?.state}
		/>
		{#if errors.state}
			{#each errors.state as error}
				<p class="text-xs text-destructive">{error}</p>
			{/each}
		{/if}
	</div>

	<div class="space-y-4">
		<Label for="zip">Zip</Label>
		<Input type="text" id="zip" name="zip" placeholder="12345" value={organizationToEdit?.zip} />
		{#if errors.zip}
			{#each errors.zip as error}
				<p class="text-xs text-destructive">{error}</p>
			{/each}
		{/if}
	</div>

	<div class="space-y-4">
		<Label for="country" required>Country</Label>
		<Input
			type="text"
			id="country"
			name="country"
			placeholder="Nigeria"
			value={organizationToEdit?.country}
		/>
		{#if errors.country}
			{#each errors.country as error}
				<p class="text-xs text-destructive">{error}</p>
			{/each}
		{/if}
	</div>

	<div class="space-y-4">
		<Label for="phone">Phone</Label>
		<Input
			type="tel"
			id="phone"
			name="phone"
			placeholder="+2341234567890"
			value={organizationToEdit?.phone}
		/>
		<p class="text-xs text-gray-500">
			Phone number must start with a country code. For example, +2341234567890
		</p>
		{#if errors.phone}
			{#each errors.phone as error}
				<p class="text-xs text-destructive">{error}</p>
			{/each}
		{/if}
	</div>

	<div class="space-y-4">
		<Label for="vat_id">VAT ID</Label>
		<Input
			type="text"
			id="vat_id"
			name="vat_id"
			placeholder="123456789"
			value={organizationToEdit?.vat_id}
		/>
		{#if errors.vat_id}
			{#each errors.vat_id as error}
				<p class="text-xs text-destructive">{error}</p>
			{/each}
		{/if}
	</div>

	<div class=" ">
		<Label for="website">Website</Label>
		<Input
			type="url"
			id="website"
			name="website"
			placeholder="https://example.com"
			value={organizationToEdit?.website}
		/>
		{#if errors.website}
			{#each errors.website as error}
				<p class="text-xs text-destructive">{error}</p>
			{/each}
		{/if}
	</div>

	<Button type="submit" class="md:col-span-2">
		{#if loading}
			<Loader2 class="animate-spin" />
		{:else if organizationToEdit}
			Save Changes
		{:else}
			Create Organization
		{/if}
	</Button>
</form>
