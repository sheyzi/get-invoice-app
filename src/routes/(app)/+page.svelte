<script lang="ts">
	import { activeOrganizationStore } from '$lib/stores/organization';

	import { ActiveOrg } from '$lib/components/ui/active-org';
	import OrganizationChildCard from '$lib/components/ui/organization-child-card/organization-child-card.svelte';

	import { writable } from 'svelte/store';
	import InvoiceTableActions from './invoice-table-actions.svelte';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '../../lib/components/ui/input';

	let switchingOrganizations = false;

	$: showEmptyState = $activeOrganizationStore?.invoices.length === 0;

	let invoices = writable($activeOrganizationStore?.invoices || []);

	let columnSortStates = {
		column: 'invoice_no',
		order: 'asc'
	};

	const search = (value: string) => {
		invoices.update((invoices: any[]) => {
			if (value === '') {
				return $activeOrganizationStore?.invoices || [];
			}
			const filtered = invoices.filter((invoice) => {
				const invoiceNo = `${invoice.invoice_prefix}${invoice.invoice_no}`;
				const contactName = invoice.contact.name;
				const date = new Date(invoice.date).toLocaleDateString();
				const dueDate = invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '';

				return (
					invoiceNo.toLowerCase().includes(value.toLowerCase()) ||
					contactName.toLowerCase().includes(value.toLowerCase()) ||
					date.toLowerCase().includes(value.toLowerCase()) ||
					dueDate.toLowerCase().includes(value.toLowerCase())
				);
			});
			return filtered;
		});
	};

	let columns = [
		{
			id: 'invoice_no',
			name: 'Invoice Number',
			accesor: (invoice: any) => `${invoice.invoice_prefix}${invoice.invoice_no}`,
			sortable: true,
			sortFn: (order: 'asc' | 'desc') => {
				columnSortStates = {
					column: 'invoice_no',
					order
				};

				if (order === 'asc') {
					invoices.update((invoices: any[]) => {
						const sorted = invoices.sort((a, b) => {
							const aInvoiceNo = a.invoice_no;
							const bInvoiceNo = b.invoice_no;

							if (aInvoiceNo < bInvoiceNo) {
								return -1;
							}

							if (aInvoiceNo > bInvoiceNo) {
								return 1;
							}

							columnSortStates;

							return 0;
						});
						return sorted;
					});
				} else {
					invoices.update((invoices: any[]) => {
						const sorted = invoices.sort((a, b) => {
							const aInvoiceNo = a.invoice_no;
							const bInvoiceNo = b.invoice_no;

							if (aInvoiceNo > bInvoiceNo) {
								return -1;
							}

							if (aInvoiceNo < bInvoiceNo) {
								return 1;
							}

							return 0;
						});
						return sorted;
					});
				}
			}
		},
		{
			id: 'status',
			name: 'Status',
			accesor: (invoice: any) => (invoice.paid ? 'Paid' : 'Unpaid'),
			sortable: true,
			sortFn: (order: 'asc' | 'desc') => {
				columnSortStates = {
					column: 'status',
					order
				};

				if (order === 'asc') {
					invoices.update((invoices: any[]) => {
						const sorted = invoices.sort((a, b) => {
							const aPaid = a.paid;
							const bPaid = b.paid;

							if (aPaid < bPaid) {
								return -1;
							}

							if (aPaid > bPaid) {
								return 1;
							}

							return 0;
						});
						return sorted;
					});
				} else {
					invoices.update((invoices: any[]) => {
						const sorted = invoices.sort((a, b) => {
							const aPaid = a.paid;
							const bPaid = b.paid;

							if (aPaid > bPaid) {
								return -1;
							}

							if (aPaid < bPaid) {
								return 1;
							}

							return 0;
						});
						return sorted;
					});
				}
			}
		},
		{
			id: 'contact',
			name: 'Contact',
			accesor: (invoice: any) => invoice.contact.name
		},
		{
			id: 'date',
			name: 'Date',
			accesor: (invoice: any) => new Date(invoice.date).toLocaleDateString(),
			sortable: true,
			sortFn: (order: 'asc' | 'desc') => {
				columnSortStates = {
					column: 'date',
					order
				};

				if (order === 'asc') {
					invoices.update((invoices: any[]) => {
						const sorted = invoices.sort((a, b) => {
							const aDate = a.date;
							const bDate = b.date;

							if (aDate < bDate) {
								return -1;
							}

							if (aDate > bDate) {
								return 1;
							}

							return 0;
						});
						return sorted;
					});
				} else {
					invoices.update((invoices: any[]) => {
						const sorted = invoices.sort((a, b) => {
							const aDate = a.date;
							const bDate = b.date;

							if (aDate > bDate) {
								return -1;
							}

							if (aDate < bDate) {
								return 1;
							}

							return 0;
						});
						return sorted;
					});
				}
			}
		},
		{
			id: 'due_date',
			name: 'Due Date',
			accesor: (invoice: any) =>
				invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '',
			sortable: true,
			sortFn: (order: 'asc' | 'desc') => {
				columnSortStates = {
					column: 'due_date',
					order
				};

				if (order === 'asc') {
					invoices.update((invoices: any[]) => {
						const sorted = invoices.sort((a, b) => {
							const aDueDate = a.due_date;
							const bDueDate = b.due_date;

							if (aDueDate < bDueDate) {
								return -1;
							}

							if (aDueDate > bDueDate) {
								return 1;
							}

							return 0;
						});
						return sorted;
					});
				} else {
					invoices.update((invoices: any[]) => {
						const sorted = invoices.sort((a, b) => {
							const aDueDate = a.due_date;
							const bDueDate = b.due_date;

							if (aDueDate > bDueDate) {
								return -1;
							}

							if (aDueDate < bDueDate) {
								return 1;
							}

							return 0;
						});
						return sorted;
					});
				}
			}
		},
		{
			id: 'action',
			name: '',
			accesor: (invoice: any) => invoice.$id,
			actionColumn: true
		}
	];
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
	<div class="w-full space-y-4">
		<Input
			placeholder="Search by name, contact name, date or due date"
			on:input={(e) => search(e.target.value)}
		/>
		<table class="invoice-table">
			<thead>
				<tr>
					{#each columns as column}
						<th class="">
							<div class="flex items-center space-x-2">
								<p>
									{column.name}
								</p>
								{#if column.sortable}
									{#if columnSortStates.column === column.id}
										{#if columnSortStates.order === 'asc'}
											<Button
												variant="ghost"
												size="no-padding"
												on:click={() => column.sortFn && column.sortFn('desc')}
											>
												<ChevronUp class="h-4 w-4 text-muted-foreground" />
											</Button>
										{:else}
											<Button
												variant="ghost"
												size="no-padding"
												on:click={() => column.sortFn && column.sortFn('asc')}
											>
												<ChevronDown class="h-4 w-4 text-muted-foreground" />
											</Button>
										{/if}
									{:else}
										<Button
											variant="ghost"
											size="no-padding"
											on:click={() => column.sortFn && column.sortFn('asc')}
										>
											<ChevronDown class="h-4 w-4 text-muted-foreground" />
										</Button>
									{/if}
								{/if}
							</div>
						</th>
					{/each}
				</tr>
			</thead>

			<tbody>
				{#each $invoices as invoice}
					<tr>
						{#each columns as column}
							<td>
								{#if column.actionColumn}
									<InvoiceTableActions id={invoice.$id} />
								{:else}
									{column.accesor(invoice)}
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</OrganizationChildCard>

<style>
	.invoice-table {
		width: 100%;
		border-collapse: collapse;
	}

	.invoice-table thead {
		background-color: #f7fafc;
		border-bottom: 1px solid #edf2f7;
	}

	.dark .invoice-table thead {
		background-color: #1f2937;
		border-bottom: 1px solid #1f2937;
	}

	.invoice-table th {
		text-align: left;
		padding: 0.5rem 1rem;
		font-weight: 500;
	}

	.invoice-table td {
		padding: 0.5rem 1rem;
	}

	.invoice-table tr {
		border-bottom: 1px solid var(--border-color);
	}

	.invoice-table tr:last-child {
		border-bottom: none;
	}

	.invoice-table tr:hover {
		background-color: var(--background-color);
	}
</style>
