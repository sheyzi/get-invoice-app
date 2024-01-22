<script lang="ts">
	import { Check, ChevronsUpDown, Loader2, Plus } from 'lucide-svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import { tick } from 'svelte';
	import { organizationsStore, activeOrganizationStore } from '$lib/stores/organization';

	import { setActiveOrganization } from '$lib/appwrite';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let isPopoverOpen = false;

	export let switchingOrganizations: boolean;
	export let fullWidth: boolean = true;
	export let isVertical: boolean = false;
	export let required: boolean = false;

	$: activeOrganization = $activeOrganizationStore?.$id;
	$: activeOrganizationName = $activeOrganizationStore?.name ?? 'No active organization';

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

	function closeAndFocusTrigger(triggerId: string) {
		isPopoverOpen = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<div class="flex w-full items-center justify-between px-1 pb-5">
	<div class="hidden md:flex" class:hidden={!fullWidth}>
		<!-- <Input placeholder="Search..." /> -->
	</div>
	<div
		class="flex w-full md:w-fit {isVertical
			? 'items-center justify-between space-y-2 md:flex-col md:items-start md:justify-start'
			: 'items-center justify-between'}"
	>
		<div class:mr-2={!isVertical} class=" flex space-x-2 text-sm font-semibold">
			<div>Active Org:</div>
			{#if required}
				<span class="text-destructive">*</span>
			{/if}
		</div>
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
						<Command.Empty class="p-0">
							<Button
								href="/organizations/create?redirect={$page.url.pathname}"
								variant="outline"
								size="sm"
								class="w-full"
							>
								<Plus class="mr-2 h-4 w-4" />
								New organization
							</Button>
						</Command.Empty>
						<Command.Group>
							{#each $organizationsStore as organization}
								<Command.Item
									class="cursor-pointer"
									value={organization.$id}
									onSelect={(currentValue) => {
										handleSelectOrganization(currentValue, ids.trigger);
									}}
								>
									<Check
										class={cn(
											'mr-2 h-4 w-4 ',
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
