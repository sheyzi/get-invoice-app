<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Loader2, MoreHorizontal } from 'lucide-svelte';
	import { deleteContact, getActiveOrganization } from '$lib/appwrite';
	import { toast } from 'svelte-sonner';
	import { activeOrganizationStore } from '$lib/stores/organization';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	export let id: string;

	let deleting = false;
	let deleteDialogOpen = false;

	const handleDelete = async (event: any) => {
		event.preventDefault();

		deleting = true;

		try {
			await deleteContact(id);

			const activeOrg = await getActiveOrganization();
			activeOrganizationStore.set(activeOrg);

			toast.success('Contact deleted successfully');
		} catch (error) {
			toast.error('Something went wrong. Please try again later.');
			console.error(error);
		} finally {
			deleting = false;
			deleteDialogOpen = false;
		}
	};
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">Open menu</span>
			<MoreHorizontal class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Item class="cursor-pointer" href="/contacts/{id}">Edit contact</DropdownMenu.Item>

		<DropdownMenu.Item class="cursor-pointer" on:click={() => (deleteDialogOpen = true)}>
			Delete contact
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<AlertDialog.Root bind:open={deleteDialogOpen}>
	<!-- <AlertDialog.Trigger>Delete contact</AlertDialog.Trigger> -->
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure you want to delete this contact?</AlertDialog.Title>
			<AlertDialog.Description>
				Deleting this contact cannot be undone. This will permanently delete this organization and
				all invoices associated with it.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				on:click={(e) => handleDelete(e)}
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
