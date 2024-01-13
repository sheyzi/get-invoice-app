<script lang="ts">
	import { currentUser } from '$lib/stores/user';
	import { Button } from '$lib/components/ui/button';
</script>

<svelte:head>
	<title>Invoices - Get Invoice</title>
</svelte:head>

{$currentUser ? `${$currentUser.name} is logged in` : `No user logged in`}
