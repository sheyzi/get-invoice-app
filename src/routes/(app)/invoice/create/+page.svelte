<script lang="ts">
	import type { PageData } from './$types';
	import { FormWrapper } from '$lib/components/ui/form-wrapper';
	import InvoiceForm from '../invoice-form.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Create Invoice - Get Invoice</title>
</svelte:head>

<InvoiceForm />
