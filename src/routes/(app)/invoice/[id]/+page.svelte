<script lang="ts">
	import { page } from '$app/stores';
	import { getInvoice, updateInvoice } from '$lib/appwrite';
	import { Loader2, RotateCw } from 'lucide-svelte';
	import * as Table from '$lib/components/ui/table';

	import { formatCurrency } from '$lib/utils';
	import { Button } from '../../../../lib/components/ui/button';

	let subTotal = 0;
	let tax = 0;
	let discount = 0;
	let total = 0;

	const getInvoiceData = async () => {
		const invoice = await getInvoice($page.params.id);
		invoice.items.forEach((item: any) => {
			subTotal += item.quantity * item.unit_price;
			tax += item.is_taxable ? item.quantity * item.unit_price * (invoice.tax_rate / 100) : 0;
			discount += item.quantity * item.unit_price * (invoice.discount / 100);
		});

		total = subTotal + tax - discount;
		return invoice;
	};

	$: invoice = getInvoiceData();

	const printInvoice = async () => {
		let printContent = document.getElementById('invoice-print-template');

		if (printContent) {
			await printContent.classList.remove('hidden');
			const options = {
				margin: 0.5,
				filename: `${(await invoice).title}.pdf`,
				image: { type: 'jpeg', quality: 0.98 },
				html2canvas: { scale: 2, useCors: true },
				jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
			};
			await html2pdf().from(printContent).set(options).save();
			await printContent.classList.add('hidden');
		}
	};

	let togglingPaymentStatus = false;

	const togglePaymentStatus = async () => {
		togglingPaymentStatus = true;
		try {
			const invoiceToEdit = await getInvoice($page.params.id);
			await updateInvoice($page.params.id, {
				paid: invoiceToEdit.paid ? false : true
			});

			invoice = getInvoiceData();
		} catch (error) {
			console.log(error);
			toast.error("Couldn't update invoice status");
		} finally {
			togglingPaymentStatus = false;
		}
	};

	import PrintInvoice from './print-invoice.svelte';
	import { toast } from 'svelte-sonner';
</script>

<svelte:head>
	{#await invoice}
		<title>Loading...</title>
	{:then invoice}
		<title>{invoice.title} - Get Invoice</title>
	{/await}
</svelte:head>

{#await invoice}
	<div class="flex w-full items-center justify-center">
		<Loader2 class="animate-spin" />
	</div>
{:then invoice}
	<div class=" relative h-full w-full bg-background">
		<button
			class="status flex {invoice.paid ? 'paid' : 'unpaid'}"
			on:click={togglePaymentStatus}
			disabled={togglingPaymentStatus}
		>
			{#if togglingPaymentStatus}
				<Loader2 class="animate-spin" />
			{:else}
				<p>
					{invoice.paid ? 'Paid' : 'Unpaid'}
				</p>
				<RotateCw class="ml-2 h-5 w-5" />
			{/if}
		</button>
		<div class="items-start justify-between md:flex">
			<div>
				{#if invoice.organization.logo}
					<img
						style="width: 3rem; margin-bottom: 10px"
						src={invoice.organization.logo}
						alt={invoice.organization.name}
					/>
				{/if}
				<h3 class="text-3xl font-semibold">
					{invoice.organization.name}
				</h3>
				<p class="text-sm text-muted-foreground">
					{invoice.organization.email}
				</p>
				<p class="text-sm text-muted-foreground">
					{invoice.organization.street}, {invoice.organization.city}, {invoice.organization
						.state},{' '}
					{invoice.organization.country}
					{#if invoice.organization.zip}, {invoice.organization.zip}{/if}.
				</p>
				{#if invoice.organization.phone}
					<p class="text-sm text-muted-foreground">
						{invoice.organization.phone}
					</p>
				{/if}
				{#if invoice.organization.vat_id}
					<p class="text-sm text-muted-foreground">
						VAT-{invoice.organization.vat_id}
					</p>
				{/if}
			</div>

			<!-- <p class="hidden text-3xl font-bold md:block">INVOICE</p> -->
		</div>

		<div
			class="mt-10 flex h-full w-full flex-col-reverse items-start justify-between gap-x-8 gap-y-8 md:mt-16 md:flex-row"
		>
			<div class="space-y-4">
				<h3 class="font-semibold">Bill To:</h3>

				<div class=" space-y-4">
					<p>
						{invoice.contact.name}
					</p>
					<p>
						{invoice.contact.email}
					</p>

					<p>
						{invoice.contact.address}
					</p>

					{#if invoice.contact.phone}
						<p>
							{invoice.contact.phone}
						</p>
					{/if}

					{#if invoice.contact.vat_id}
						<p>
							VAT-{invoice.contact.vat_id}
						</p>
					{/if}
				</div>
			</div>

			<div class="space-y-4">
				<div class="mb-1 flex items-center">
					<p class="block w-32 font-bold uppercase tracking-wide">Invoice #</p>
					<span class="mr-4 inline-block">:</span>
					<p>
						{invoice.invoice_prefix}{invoice.invoice_no
							.toString()
							.padStart(5 - JSON.stringify(invoice.invoice_no).length, '0')}
					</p>
				</div>
				<div class="mb-1 flex items-center">
					<p class="block w-32 font-bold uppercase tracking-wide">Date</p>
					<span class="mr-4 inline-block">:</span>
					<p>
						{new Date(invoice.date).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}
					</p>
				</div>
				<div class="mb-1 flex items-center">
					<p class="block w-32 font-bold uppercase tracking-wide">Due Date</p>
					<span class="mr-4 inline-block">:</span>
					<p>
						{new Date(invoice.due_date).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}
					</p>
				</div>
			</div>
		</div>

		<div class="mt-16 w-full">
			<Table.Root class="w-full ">
				<Table.Header class="w-full">
					<Table.Row>
						<Table.Head class="min-w-full">Info</Table.Head>
						<Table.Head class="min-w-full">Qty</Table.Head>
						<Table.Head class="min-w-full">Unit Price</Table.Head>
						<Table.Head class="min-w-full">Tax</Table.Head>
						<Table.Head class="min-w-full">Discount</Table.Head>
						<Table.Head class="min-w-full">Total</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each invoice.items as item, i (i)}
						<Table.Row>
							<Table.Cell class="align-top">
								<p class="font-semibold">{item.name}</p>
								<p class="text-sm text-muted-foreground">{item.description}</p>
							</Table.Cell>
							<Table.Cell class="align-top">
								<p>{item.quantity}</p>
							</Table.Cell>
							<Table.Cell class="align-top font-medium">
								<p>{formatCurrency(item.unit_price)}</p>
							</Table.Cell>
							<Table.Cell class="align-top font-medium">
								{#if item.is_taxable}
									<p>
										{formatCurrency(item.quantity * item.unit_price * (invoice.tax_rate / 100))}
									</p>
								{:else}
									<p>0</p>
								{/if}
							</Table.Cell>

							<Table.Cell class="align-top font-medium">
								<p>
									-{formatCurrency(item.quantity * item.unit_price * (invoice.discount / 100))}
								</p>
							</Table.Cell>

							<Table.Cell class="align-top font-medium">
								{#if item.is_taxable}
									<p>
										{formatCurrency(
											item.quantity * item.unit_price +
												item.quantity * item.unit_price * (invoice.tax_rate / 100) -
												item.quantity * item.unit_price * (invoice.discount / 100)
										)}
									</p>
								{:else}
									<p>
										{formatCurrency(
											item.quantity * item.unit_price -
												item.quantity * item.unit_price * (invoice.discount / 100)
										)}
									</p>
								{/if}
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>

		<div class="my-16">
			<div class="mt-3 flex justify-end">
				<div class="flex flex-col items-end">
					<div class="flex items-center space-x-2">
						<p class="text-sm">Subtotal:</p>
						<p class="text-sm font-semibold">
							{formatCurrency(subTotal)}
						</p>
					</div>
					<div class="flex items-center space-x-2">
						<p class="text-sm">Tax:</p>
						<p class="text-sm font-semibold">
							{formatCurrency(tax)}
						</p>
					</div>

					<div class="flex items-center space-x-2">
						<p class="text-sm">Discount:</p>
						<p class="text-sm font-semibold">
							-{formatCurrency(discount)}
						</p>
					</div>

					<div class="flex items-center space-x-2">
						<p class="text-sm">Total:</p>
						<p class="text-sm font-semibold">
							{formatCurrency(total)}
						</p>
					</div>
				</div>
			</div>
		</div>

		{#if invoice.notes}
			<div class="space-y-4">
				<h3 class="font-semibold">NOTES:</h3>
				<p>
					{invoice.notes}
				</p>
			</div>
		{/if}
	</div>

	<PrintInvoice {invoice} />

	<div class="flex items-center space-x-4">
		<Button href="/invoice/{$page.params.id}/edit">Edit Invoice</Button>
		<Button on:click={printInvoice} variant="secondary">Download Invoice</Button>
	</div>
{/await}

<style>
	.status {
		position: absolute;
		top: 0;
		right: 0;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 700;
		text-transform: uppercase;
		color: #fff;
		background-color: #38c172;
		z-index: 1;
		cursor: pointer;
	}

	.status.unpaid {
		background-color: #e3342f;
	}
</style>
