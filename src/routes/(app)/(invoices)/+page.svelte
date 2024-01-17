<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { organizationsStore, activeOrganizationStore } from '$lib/stores/organization';
	import { setActiveOrganization } from '$lib/appwrite';
	import { Check, ChevronsUpDown } from 'lucide-svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import { tick } from 'svelte';
	import { Loader2, Ban } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';

	let isPopoverOpen = false;

	$: activeOrganization = $activeOrganizationStore?.id ?? null;
	$: activeOrganizationName = $activeOrganizationStore?.name ?? 'No active organization';

	function closeAndFocusTrigger(triggerId: string) {
		isPopoverOpen = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	let switchingOrganizations = false;

	const handleSelectOrganization = async (organizationId: string, popperId: string) => {
		try {
			switchingOrganizations = true;
			closeAndFocusTrigger(popperId);
			await setActiveOrganization(organizationId);
		} catch (error) {
			console.error(error);
		} finally {
			switchingOrganizations = false;
		}
	};
</script>

<svelte:head>
	<title>Invoices - Get Invoice</title>
</svelte:head>

<div class="flex w-full items-center justify-between px-1 pb-5">
	<div class="hidden md:flex">
		<!-- <Input placeholder="Search..." /> -->
	</div>
	<div class="flex w-full items-center justify-between md:w-fit">
		<div class="mr-2 text-sm font-semibold">Active Org:</div>
		<div>
			<Popover.Root bind:open={isPopoverOpen} let:ids>
				<Popover.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						variant="outline"
						role="combobox"
						size="sm"
						aria-expanded={isPopoverOpen}
						class="w-[200px] justify-between"
					>
						<div class="flex w-full items-center justify-center">
							{#if switchingOrganizations}
								<Loader2 class="h-5 w-5 animate-spin" />
							{:else}
								{activeOrganizationName}
							{/if}
						</div>
						<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</Popover.Trigger>
				<Popover.Content class="w-[200px] p-0">
					<Command.Root>
						<Command.Input placeholder="Search framework..." />
						<Command.Empty>No organization!</Command.Empty>
						<Command.Group>
							{#each $organizationsStore as organization}
								<Command.Item
									value={organization.$id}
									onSelect={(currentValue) => {
										handleSelectOrganization(currentValue, ids.trigger);
									}}
								>
									<Check
										class={cn(
											'mr-2 h-4 w-4',
											activeOrganization !== organization.$id && 'text-transparent'
										)}
									/>

									{organization.name}
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
		</div>
	</div>
</div>

<Card.Root class="h-full">
	{#if $organizationsStore.length > 0}
		<Card.Header class="p-0">
			<div class="w-full rounded-t">
				<div class="flex items-center justify-center border-b px-5 py-2">
					<Card.Title tag="h2" class="text-2xl">Invoices</Card.Title>
					<div class="ml-auto">
						<Button href="/invoices/create">Create</Button>
					</div>
				</div>
			</div>
		</Card.Header>
		<Card.Content class="flex justify-center pt-5">
			{#if switchingOrganizations}
				<Loader2 class="animate-spin" />
			{:else}
				Table of invoices
			{/if}
		</Card.Content>
	{:else}
		<Card.Content>
			<div class="flex w-full flex-col items-center justify-center py-20 md:col-span-2">
				<div class="relative pb-5 pt-10">
					<Ban class="h-20 w-20 text-foreground md:h-36 md:w-36" />
				</div>
				<p class="text-center">
					You don't have any organizations yet. Click the button above to create one.
				</p>
				<Button href="/organizations/create" class="mt-7">Create</Button>
			</div>
		</Card.Content>
	{/if}
</Card.Root>
