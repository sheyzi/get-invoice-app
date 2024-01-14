<script lang="ts">
	import type { PageData } from './$types';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Card from '$lib/components/ui/card';
	import { listOrganizations, deleteOrganization } from '$lib/appwrite';
	import { Loader2 } from 'lucide-svelte';
	import { AppwriteException } from 'appwrite';
	import { organizations } from '$lib/stores/organization';
	import { toast } from 'svelte-sonner';

	let loading = false;

	const handleDelete = async (id: string) => {
		loading = true;

		try {
			await deleteOrganization(id);
			toast.success('Organization deleted successfully');
			const orgs = await listOrganizations();
			organizations.set(orgs);
		} catch (error) {
			toast.error('Something went wrong. Please try again later.');
			console.error(error);
		} finally {
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>Organizations - Get Invoice</title>
</svelte:head>

<Card.Root class="mt-10 w-full">
	<Card.Header>
		<div class="flex w-full items-center justify-between">
			<h1 class="text-2xl font-semibold">Organizations</h1>

			<div class="flex">
				<Button href="/organizations/create">Create <Plus class="ml-2 h-4 w-4" /></Button>
			</div>
		</div>
	</Card.Header>
	<Card.Content>
		<!-- {#await organizations}
			<div class="flex w-full items-center justify-center">
				<Loader2 class="animate-spin" />
			</div>
		{:then organizations}
			<!-- {#if loading}
				<div class="flex w-full items-center justify-center">
					<Loader2 class="animate-spin" />
				</div>
			{:else} -->

		<div class="grid gap-4 md:grid-cols-2">
			{#each $organizations as organization}
				<Card.Root class="mt-10 w-full">
					<Card.Header>
						<div class="flex items-center">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-500 text-white"
							>
								{organization.name[0]}
							</div>
							<div class="ml-4">
								<div class="text-sm font-medium text-gray-900 dark:text-white">
									{organization.name}
								</div>
							</div>
						</div>
					</Card.Header>

					<Card.Content>
						<!-- organization address should be here. the street, city, state and country -->

						<div>
							<div class="text-sm font-medium text-gray-900 dark:text-gray-100">
								{organization.street}
							</div>
							<div class="text-sm text-gray-500 dark:text-gray-300">
								{organization.city}, {organization.state}, {organization.country}
							</div>
						</div>
					</Card.Content>

					<Card.Footer>
						<!-- Buttons to Edit, Delete -->

						<div class="flex w-full items-center space-x-2">
							<Button variant="outline" href={`/organizations/${organization.$id}/edit`}
								>Edit</Button
							>

							<Dialog.Root>
								<Dialog.Trigger class={buttonVariants({ variant: 'destructive' })}
									>Delete</Dialog.Trigger
								>

								<Dialog.Content class="sm:max-w-[425px]">
									<Dialog.Header>
										<Dialog.Title>Delete {organization.name}</Dialog.Title>
										<Dialog.Description>
											Are you sure you want to delete this organization?
										</Dialog.Description>
									</Dialog.Header>
									<div>
										Deleting this organization will delete all the invoices associated with it.
									</div>
									<Dialog.Footer>
										<Button
											type="submit"
											variant="destructive"
											on:click={() => handleDelete(organization.$id)}
										>
											{#if loading}
												<Loader2 class="animate-spin" />
											{:else}
												Delete
											{/if}
										</Button>
									</Dialog.Footer>
								</Dialog.Content>
							</Dialog.Root>
						</div>
					</Card.Footer>
				</Card.Root>
			{/each}
		</div>
		<!-- {/if} -->
		<!-- {/await} -->
	</Card.Content>
</Card.Root>
