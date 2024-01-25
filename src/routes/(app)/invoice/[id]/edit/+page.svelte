<script lang="ts">
	import { getInvoice } from '$lib/appwrite';
	import { page } from '$app/stores';
	import { Loader2 } from 'lucide-svelte';
	import InvoiceForm from '../../invoice-form.svelte';

	const getInvoiceData = async () => {
		const invoice = await getInvoice($page.params.id);
		return invoice;
	};

	const invoice = getInvoiceData();
</script>

<svelte:head>
	{#await invoice}
		<title>Loading...</title>
	{:then invoice}
		<title>
			Edit {invoice.title}
		</title>
	{/await}
</svelte:head>

{#await invoice}
	<div class="flex w-full items-center justify-center">
		<Loader2 class="animate-spin" />
	</div>
{:then invoice}
	<InvoiceForm invoiceToEdit={invoice} />
{/await}
