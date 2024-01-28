<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Card from '$lib/components/ui/card';
	import { listOrganizations, deleteOrganization } from '$lib/appwrite';
	import { Loader2, Ban } from 'lucide-svelte';
	import { organizationsStore, activeOrganizationStore } from '$lib/stores/organization';
	import { toast } from 'svelte-sonner';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	let deleting = false;
	let deleteDialogOpen = false;

	const handleDelete = async (event: any, id: string) => {
		event.preventDefault();

		deleting = true;

		try {
			await deleteOrganization(id);
			const orgs = await listOrganizations();
			organizationsStore.set(orgs);

			if (orgs.length === 0) {
				activeOrganizationStore.set(null);
			}
			toast.success('Organization deleted successfully');
		} catch (error) {
			toast.error('Something went wrong. Please try again later.');
			console.error(error);
		} finally {
			deleting = false;
			deleteDialogOpen = false;
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
			{#each $organizationsStore as organization}
				<Card.Root class="mt-10 w-full">
					<Card.Header>
						<div class="flex items-center">
							{#if organization.logo}
								<img
									src={organization.logo}
									alt={organization.name}
									class="h-10 w-10 rounded-full"
								/>
							{:else}
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-500 text-white"
								>
									{organization.name[0]}
								</div>
							{/if}
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
							<Button variant="outline" href={`/organizations/${organization.$id}`}>Edit</Button>

							<AlertDialog.Root bind:open={deleteDialogOpen}>
								<AlertDialog.Trigger class={buttonVariants({ variant: 'destructive' })}
									>Delete</AlertDialog.Trigger
								>
								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>
											Are you sure you want to delete this organization?</AlertDialog.Title
										>
										<AlertDialog.Description>
											Deleting this organization cannot be undone. This will permanently delete this
											organization and all invoice and contacts associated with it.
										</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer>
										<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
										<AlertDialog.Action
											on:click={(e) => handleDelete(e, organization.$id)}
											class={buttonVariants({ variant: 'destructive' })}
										>
											{#if deleting}
												<Loader2 class="animate-spin" />
											{:else}
												Delete
											{/if}
										</AlertDialog.Action>
									</AlertDialog.Footer>
								</AlertDialog.Content>
							</AlertDialog.Root>
						</div>
					</Card.Footer>
				</Card.Root>
			{:else}
				<div class="flex flex-col w-full items-center justify-center md:col-span-2 py-20">
					<div class="relative py-10">
						<Ban class="h-20 w-20 text-foreground md:h-36 md:w-36" />
					</div>
					<p class="text-center">
						You don't have any organizations yet. Click the button above to create one.
					</p>
				</div>
			{/each}
		</div>
		<!-- {/if} -->
		<!-- {/await} -->
	</Card.Content>
</Card.Root>
