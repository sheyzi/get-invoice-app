<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { organizationsStore, activeOrganizationStore } from '$lib/stores/organization';

	import { Loader2, Ban } from 'lucide-svelte';
	import { pluralizeString } from '../../../utils';
	import { page } from '$app/stores';

	export let switchingOrganizations: boolean;
	export let name: string;
	export let createUrl: string;
	export let showEmptyState: boolean = false;
	export let watchContact: boolean = false;

	$: pluralizedName = pluralizeString(name);
</script>

<Card.Root class="h-full">
	<Card.Header class="p-0">
		<div class="w-full rounded-t">
			<div class="flex items-center justify-center border-b px-5 py-2">
				<Card.Title tag="h2" class="text-2xl">
					{pluralizedName.charAt(0).toUpperCase() + pluralizedName.slice(1)}
				</Card.Title>
				<div
					class="ml-auto"
					class:invisible={$organizationsStore.length < 1 ||
						(watchContact && $activeOrganizationStore?.contacts.length < 1)}
				>
					<Button href={createUrl}>Create</Button>
				</div>
			</div>
		</div>
	</Card.Header>
	{#if $organizationsStore.length > 0}
		<Card.Content class="flex justify-center overflow-x-auto pt-5">
			{#if switchingOrganizations}
				<Loader2 class="animate-spin" />
			{:else if watchContact && $activeOrganizationStore?.contacts.length < 1}
				<div class="flex w-full flex-col items-center justify-center py-20 md:col-span-2">
					<div class="relative pb-5 pt-10">
						<img src="/no-records.svg" alt="" class="h-full w-full" />
					</div>
					<p class="text-center">
						To create an {name.toLowerCase()}, you need to have at least one contact. Click the
						button below to create one.
					</p>
					<Button href="/contacts/create?redirect={$page.url.pathname}" class="mt-7"
						>Create contact</Button
					>
				</div>
			{:else if showEmptyState}
				<div class="flex w-full flex-col items-center justify-center py-20 md:col-span-2">
					<div class="relative pb-5 pt-10">
						<slot name="empty-state-icon">
							<img src="/empty-box.svg" alt="" class="h-full w-full" />
						</slot>
					</div>
					<p class="text-center">
						You don't have any {name} yet. Click the button above to create one.
					</p>
					<Button href={createUrl} class="mt-7">Create {name.toLowerCase()}</Button>
				</div>
			{:else}
				<slot />
			{/if}
		</Card.Content>
	{:else}
		<Card.Content>
			<div class="flex w-full flex-col items-center justify-center py-20 md:col-span-2">
				<div class="relative pb-5 pt-10">
					<Ban class="h-20 w-20 text-foreground md:h-36 md:w-36" />
				</div>
				<p class="text-center">
					You don't have any organizations yet. Click the button below to create one.
				</p>
				<Button href="/organizations/create?redirect={$page.url.pathname}" class="mt-7"
					>Create organization</Button
				>
			</div>
		</Card.Content>
	{/if}
</Card.Root>
