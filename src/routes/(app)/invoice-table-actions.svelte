<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Loader2, MoreHorizontal } from 'lucide-svelte';
	import { deleteInvoice, getActiveOrganization } from '$lib/appwrite';
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
			await deleteInvoice(id);

			const activeOrg = await getActiveOrganization();
			activeOrganizationStore.set(activeOrg);

			toast.success('Invoice deleted successfully');
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
		<DropdownMenu.Item class="cursor-pointer" href="/invoice/{id}">View invoice</DropdownMenu.Item>
		<!-- <DropdownMenu.Item class="cursor-pointer" href="/invoice/{id}">Edit invoice</DropdownMenu.Item> -->

		<DropdownMenu.Item class="cursor-pointer" on:click={() => (deleteDialogOpen = true)}>
			Delete invoice
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<AlertDialog.Root bind:open={deleteDialogOpen}>
	<!-- <AlertDialog.Trigger>Delete contact</AlertDialog.Trigger> -->
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure you want to delete this invoice?</AlertDialog.Title>
			<AlertDialog.Description>
				Deleting this invoice cannot be undone. This will permanently delete this invoice.
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
