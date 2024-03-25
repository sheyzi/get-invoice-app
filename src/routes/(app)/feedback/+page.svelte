<script lang="ts">
	import type { PageData } from '../$types';
	import * as Card from '$lib/components/ui/card';
	import FeedbackForm from './feedback-form.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Feedback - Get Invoice</title>
</svelte:head>

<div class="mx-auto w-full max-w-[650px]">
	<Card.Root class="w-full">
		<Card.Header>
			<Card.Title tag="h2" class="text-2xl">Send Feedback</Card.Title>
			<Card.Description>Send us your feedback</Card.Description>
		</Card.Header>
		<Card.Content>
			<FeedbackForm form={data.form} />
		</Card.Content>
	</Card.Root>
</div>
