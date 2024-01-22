<script lang="ts">
	import ActiveOrg from '$lib/components/ui/active-org/active-org.svelte';
	import { activeOrganizationStore } from '$lib/stores/organization';
	import OrganizationChildCard from '$lib/components/ui/organization-child-card/organization-child-card.svelte';

	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import ContactTableActions from './contact-table-actions.svelte';
	import type { Contact } from '$lib/appwrite';

	let switchingOrganizations = false;
	$: showEmptyState = $activeOrganizationStore?.contacts.length === 0;

	let table: any | null = null;
	let columns: any | null = null;
	let headerRows: any | null = null;
	let pageRows: any | null = null;
	let tableAttrs: any | null = null;
	let tableBodyAttrs: any | null = null;

	$: if ($activeOrganizationStore) {
		table = createTable(readable($activeOrganizationStore.contacts));

		columns = table.createColumns([
			table.column({
				accessor: 'name',
				header: 'Name'
			}),
			table.column({
				accessor: 'email',
				header: 'Email'
			}),
			table.column({
				accessor: 'phone',
				header: 'Phone',
				cell: ({ value }: any) => {
					const formatted = value ?? '';
					return formatted;
				}
			}),
			table.column({
				accessor: 'vat_id',
				header: 'VAT ID',
				cell: ({ value }: any) => {
					const formatted = value ? `VAT-${value}` : '';
					return formatted;
				}
			}),
			table.column({
				accessor: (contact: Contact) => contact.$id,
				header: '',
				cell: ({ value }: any) => {
					return createRender(ContactTableActions, { id: value });
				}
			})
		]);

		let viewModel = table.createViewModel(columns);

		headerRows = viewModel.headerRows;
		pageRows = viewModel.pageRows;
		tableAttrs = viewModel.tableAttrs;
		tableBodyAttrs = viewModel.tableBodyAttrs;
	}
</script>

<svelte:head>
	<title>Contacts - Get Invoice</title>
</svelte:head>

<ActiveOrg bind:switchingOrganizations />
<OrganizationChildCard
	name="contact"
	bind:switchingOrganizations
	createUrl="/contacts/create"
	bind:showEmptyState
>
	{#if table && columns}
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
									<Table.Head {...attrs}>
										<Render of={cell.render()} />
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										<Render of={cell.render()} />
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}

	<div slot="empty-state-icon">
		<img src="/no-records.svg" alt="" class="h-full w-full" />
	</div>
</OrganizationChildCard>
