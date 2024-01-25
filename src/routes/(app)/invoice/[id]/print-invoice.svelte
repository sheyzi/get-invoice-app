<div class="body hidden" id="invoice-print-template">
	<div class="header">
		<div class="header-left">
			<h1 class="company-name">Company Name</h1>
			<div class="company-details">
				<p>sheyzi@mafflle.com.ng</p>
				<p>24 Fadeyi Street, Lagos, Lagos, Nigeria , 101245.</p>
				<p>+22959153295</p>
				<p>VAT-55452245221</p>
			</div>
		</div>

		<div class="header-right">
			<h1 class="invoice-title">Invoice</h1>
		</div>
	</div>

	<div class="flex" style="margin-top: 4rem; align-items: center">
		<div>
			<h3 style="margin-bottom: 5px">Bill To:</h3>
			<div class="contact-details">
				<p>Client Name</p>
				<p>client@invoice.com</p>
				<p>24 Fadeyi Street, Lagos, Lagos, Nigeria , 101245.</p>
				<p>+22959153295</p>
				<p>VAT-55452245221</p>
			</div>
		</div>

		<div class="invoice-details">
			<div class="invoice-detail-item">
				<p class="invoice-detail-item-title">Invoice No</p>
				<span class="invoice-detail-item-column">:</span>
				<p>INV-0001</p>
			</div>

			<div class="invoice-detail-item">
				<p class="invoice-detail-item-title">Invoice Date</p>
				<span class="invoice-detail-item-column">:</span>
				<p>01/01/2021</p>
			</div>

			<div class="invoice-detail-item">
				<p class="invoice-detail-item-title">Due Date</p>
				<span class="invoice-detail-item-column">:</span>
				<p>01/01/2021</p>
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
			<tr>
				<td>
					<p class="item-name">Item Name</p>
					<p class="item-description">Item Description</p>
				</td>
				<td>1</td>
				<td>$1,000.00</td>
				<td>$100.00</td>
				<td>-$100.00</td>
				<td>$1,000.00</td>
			</tr>
		</tbody>
	</table>

	<div class="flex" style="margin-top: 4rem">
		<div></div>

		<div class="invoice-details">
			<div class="invoice-detail-item">
				<p class="invoice-detail-item-title">Sub Total</p>
				<span class="invoice-detail-item-column">:</span>
				<p>$1,000.00</p>
			</div>

			<div class="invoice-detail-item">
				<p class="invoice-detail-item-title">Tax</p>
				<span class="invoice-detail-item-column">:</span>
				<p>$100.00</p>
			</div>

			<div class="invoice-detail-item">
				<p class="invoice-detail-item-title">Discount</p>
				<span class="invoice-detail-item-column">:</span>
				<p>-$100.00</p>
			</div>

			<div class="invoice-detail-item">
				<p class="invoice-detail-item-title">Total</p>
				<span class="invoice-detail-item-column">:</span>
				<p>$1,000.00</p>
			</div>
		</div>
	</div>

	<div class="flex" style="margin-top: 4rem">
		<p class="note">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptatum, quibusdam, quia,
			voluptates voluptatem quod quos exercitationem quas voluptate quidem dolorum. Quisquam
			voluptatum, quibusdam, quia, voluptates voluptatem quod quos exercitationem quas voluptate
			quidem dolorum.
		</p>
	</div>
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

	.header-right {
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
</style>
