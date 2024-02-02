<script lang="ts">
	import { formatCurrency } from '$lib/utils';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	export let invoice: any;

	let subTotal = 0;
	let tax = 0;
	let discount = 0;
	let total = 0;
	let organizationLogo: string | undefined;

	const toDataURL = (url: string) =>
		fetch(url)
			.then((response) => response.blob())
			.then(
				(blob) =>
					new Promise((resolve, reject) => {
						const reader = new FileReader();
						reader.onloadend = () => resolve(reader.result);
						reader.onerror = reject;
						reader.readAsDataURL(blob);
					})
			);

	onMount(() => {
		invoice.items.forEach((item: any) => {
			subTotal += item.quantity * item.unit_price;
			tax += item.is_taxable ? item.quantity * item.unit_price * (invoice.tax_rate / 100) : 0;
			discount += item.quantity * item.unit_price * (invoice.discount / 100);
		});
		total = subTotal + tax - discount;

		if (invoice.organization.logo) {
			toDataURL(invoice.organization.logo).then((dataUrl) => {
				organizationLogo = dataUrl as string;
			});
		}
	});
</script>

<div class="body hidden" id="invoice-print-template">
	<!-- <div class="body" id="invoice-print-template" style="relative"> -->
	<div class="status {invoice.paid ? 'paid' : 'unpaid'}">
		{invoice.paid ? 'Paid' : 'Unpaid'}
	</div>

	<div class="header">
		<div class="header-left">
			{#if invoice.organization.logo}
				<img src={organizationLogo} alt="Logo" style="width: 3rem; margin-bottom: 10px" />
			{/if}
			<h1 class="company-name">{invoice.organization.name}</h1>
			<div class="company-details">
				<p>{invoice.organization.email}</p>
				<p>
					{invoice.organization.street}, {invoice.organization.city}, {invoice.organization
						.state},{' '}
					{invoice.organization.country}
					{#if invoice.organization.zip}, {invoice.organization.zip}{/if}.
				</p>
				{#if invoice.organization.phone}
					<p>
						{invoice.organization.phone}
					</p>
				{/if}
				{#if invoice.organization.vat_id}
					<p>
						VAT-{invoice.organization.vat_id}
					</p>
				{/if}
			</div>
		</div>

		<!-- <div class="header-right">
			<h1 class="invoice-title">Invoice</h1>
		</div> -->
	</div>

	<div class="flex" style="margin-top: 4rem; align-items: center">
		<div>
			<h3 style="margin-bottom: 5px">Bill To:</h3>
			<div class="contact-details">
				<p>{invoice.contact.name}</p>
				<p>{invoice.contact.email}</p>
				<p>{invoice.contact.address}</p>
				<p>{invoice.contact.phone}</p>
				{#if invoice.contact.vat_id}
					<p>VAT-{invoice.contact.vat_id}</p>
				{/if}
			</div>
		</div>

		<div class="invoice-details">
			<div class="invoice-detail-item">
				<p class="invoice-detail-item-title">Invoice No</p>
				<span class="invoice-detail-item-column">:</span>
				<p>
					{invoice.invoice_prefix}{invoice.invoice_no
						.toString()
						.padStart(5 - JSON.stringify(invoice.invoice_no).length, '0')}
				</p>
			</div>

			<div class="invoice-detail-item">
				<p class="invoice-detail-item-title">Invoice Date</p>
				<span class="invoice-detail-item-column">:</span>
				<p>
					{new Date(invoice.date).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</p>
			</div>

			<div class="invoice-detail-item">
				<p class="invoice-detail-item-title">Due Date</p>
				<span class="invoice-detail-item-column">:</span>
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

	<table class="items-table" style="margin-top: 4rem">
		<thead>
			<tr>
				<th>Info</th>
				<th>Qty</th>
				<th>Unit Price</th>
				<th>Tax</th>
				<th>Discount</th>
				<th>Total</th>
			</tr>
		</thead>

		<tbody>
			{#each invoice.items as item}
				<tr>
					<td>
						<p class="item-name">{item.name}</p>
						<p class="item-description">{item.description}</p>
					</td>
					<td>{item.quantity}</td>
					<td>{formatCurrency(item.unit_price, invoice.currency_symbol)}</td>
					<td>
						{#if item.is_taxable}
							{formatCurrency(
								item.quantity * item.unit_price * (invoice.tax_rate / 100),
								invoice.currency_symbol
							)}
						{:else}
							0
						{/if}
					</td>
					<td>
						{discount > 0 ? '-' : ''}{formatCurrency(
							item.quantity * item.unit_price * (invoice.discount / 100),
							invoice.currency_symbol
						)}
					</td>
					<td>
						{#if item.is_taxable}
							{formatCurrency(
								item.quantity * item.unit_price +
									item.quantity * item.unit_price * (invoice.tax_rate / 100) -
									item.quantity * item.unit_price * (invoice.discount / 100),
								invoice.currency_symbol
							)}
						{:else}
							{formatCurrency(
								item.quantity * item.unit_price -
									item.quantity * item.unit_price * (invoice.discount / 100),
								invoice.currency_symbol
							)}
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<div class="flex" style="margin-top: 4rem">
		<div></div>

		<div class="invoice-details">
			<div class="invoice-detail-item">
				<p class="invoice-detail-item-title">Sub Total</p>
				<span class="invoice-detail-item-column">:</span>
				<p>{formatCurrency(subTotal, invoice.currency_symbol)}</p>
			</div>

			<div class="invoice-detail-item">
				<p class="invoice-detail-item-title">Tax</p>
				<span class="invoice-detail-item-column">:</span>
				<p>{formatCurrency(tax, invoice.currency_symbol)}</p>
			</div>

			<div class="invoice-detail-item">
				<p class="invoice-detail-item-title">Discount</p>
				<span class="invoice-detail-item-column">:</span>
				<p>{discount > 0 ? '-' : ''}{formatCurrency(discount, invoice.currency_symbol)}</p>
			</div>

			<div class="invoice-detail-item">
				<p class="invoice-detail-item-title">Total</p>
				<span class="invoice-detail-item-column">:</span>
				<p>{formatCurrency(total, invoice.currency_symbol)}</p>
			</div>
		</div>
	</div>

	{#if invoice.notes}
		<div style="margin-top: 4rem">
			<h3 style="margin-bottom: 5px; font-weight: 600;">Notes:</h3>
			<p class="note">
				{invoice.notes}
			</p>
		</div>
	{/if}

	<!-- <div class="watermark">
		<p>
			Preview at <a
				style="color: black; text-decoration: underline;"
				href={$page.url.protocol + '//' + $page.url.host + '/preview/' + invoice.$id}
			>
				{$page.url.protocol + '//' + $page.url.host + '/preview/' + invoice.$id}
			</a>
		</p>
		<div>
			<img src="/favicon.png" alt="" />
			<p>
				Generated by <a href={$page.url.protocol + '//' + $page.url.host}>{$page.url.host}</a>
			</p>
		</div>
	</div> -->
</div>

<style>
	*,
	*::before,
	*::after {
		box-sizing: inherit;
		margin: 0;
		padding: 0;
	}

	.body {
		font-family: 'Montserrat', sans-serif;
		font-size: 0.9rem;
		color: #212529;
		text-align: left;
		box-sizing: border-box;
		position: relative;
		height: calc(100vh - 2rem);
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: start;
		padding: 0 20px;
		margin-bottom: 20px;
	}

	.header-left {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: start;
	}

	.company-name {
		margin-bottom: 10px;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.invoice-title {
		font-size: 1.5rem;
		font-weight: 700;
	}

	.company-details {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: start;
		font-size: 0.9rem;
		line-height: 1.5;
		color: #64748b;
	}

	/* Space out all company details children on the vertical axis */
	.company-details > * {
		margin-bottom: 2px;
	}

	.flex {
		display: flex;
		justify-content: space-between;
		align-items: start;
		padding: 0 20px;
		margin-bottom: 20px;
	}

	.contact-details {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: start;
		font-size: 0.9rem;
		line-height: 1.5;
		color: #212529;
	}

	/* Space out all contact details children on the vertical axis */
	.contact-details > * {
		margin-bottom: 2px;
	}

	.invoice-details {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: start;
		font-size: 0.9rem;
		line-height: 1.5;
		color: #212529;
	}

	/* Space out all invoice details children on the vertical axis */
	.invoice-details > * {
		margin-bottom: 2px;
	}

	.invoice-detail-item {
		display: flex;
		align-items: center;
	}

	.invoice-detail-item-title {
		width: 8rem;
		display: block;
		font-weight: 700;
		text-transform: uppercase;
	}

	.invoice-detail-item-column {
		margin-right: 1rem;
		display: inline-block;
	}

	.items-table {
		width: 100%;
		border-collapse: collapse;
		border-spacing: 0;
		margin-bottom: 20px;
	}

	.items-table thead {
		background-color: #f8fafc;
		border-bottom: 1px solid #e3ebf6;
	}

	.items-table th,
	.items-table td {
		padding: 0.75rem 1rem;
		text-align: left;
	}

	.items-table th {
		font-weight: 700;
		text-transform: uppercase;
	}

	.items-table tbody tr {
		border-bottom: 1px solid #e3ebf6;
	}

	.items-table tbody tr:last-child {
		border-bottom: 0;
	}

	.item-name {
		font-weight: 700;
		margin-bottom: 0.25rem;
	}

	.item-description {
		font-size: 0.875rem;
		line-height: 1.5;
		color: #64748b;
	}

	.note {
		font-size: 0.875rem;
		line-height: 1.5;
		color: #64748b;
		text-align: justify;
	}

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
	}

	.status.unpaid {
		background-color: #e3342f;
	}

	/* Watermark at the bottom of the page */
	.watermark {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		display: flex;
		/* flex-direction: column; */
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		/* line-height: 1.5; */
		color: #64748b;
		text-align: center;
		background-color: #f8fafc;
		z-index: 1;
	}

	.watermark img {
		width: 2rem;
	}

	.watermark p {
		margin-left: 1rem;
	}

	.watermark div {
		display: flex;
		align-items: center;
	}
</style>
