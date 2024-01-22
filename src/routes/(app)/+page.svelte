<script lang="ts">
	import { activeOrganizationStore } from '$lib/stores/organization';

	import { ActiveOrg } from '$lib/components/ui/active-org';
	import OrganizationChildCard from '$lib/components/ui/organization-child-card/organization-child-card.svelte';
	import { Render, Subscribe, createRender, createTable } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import InvoiceTableActions from './invoice-table-actions.svelte';

	let switchingOrganizations = false;

	$: showEmptyState = $activeOrganizationStore?.invoices.length === 0;

	let table: any | null = null;
	let columns: any | null = null;
	let headerRows: any | null = null;
	let pageRows: any | null = null;
	let tableAttrs: any | null = null;
	let tableBodyAttrs: any | null = null;

	$: if ($activeOrganizationStore) {
		table = createTable(readable($activeOrganizationStore.invoices));

		columns = table.createColumns([
			table.column({
				accessor: 'title',
				header: 'Title'
			}),
			table.column({
				accessor: (invoice: any) => `${invoice.invoice_prefix}${invoice.invoice_no}`,
				header: 'Invoice Number'
			}),
			table.column({
				accessor: (invoice: any) => invoice.contact.name,
				header: 'Contact'
			}),
			table.column({
				accessor: (invoice: any) => new Date(invoice.date).toLocaleDateString(),
				header: 'Date'
			}),
			table.column({
				accessor: (invoice: any) =>
					invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '',
				header: 'Due Date'
			}),

			table.column({
				accessor: (invoice: any) => invoice.$id,
				header: '',
				cell: ({ value }: any) => {
					return createRender(InvoiceTableActions, { id: value });
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
	<title>Invoices - Get Invoice</title>
</svelte:head>

<ActiveOrg bind:switchingOrganizations />

<OrganizationChildCard
	bind:showEmptyState
	name="invoice"
	bind:switchingOrganizations
	createUrl="/invoice/create"
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
</OrganizationChildCard>
