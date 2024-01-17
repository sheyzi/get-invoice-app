<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	export let title: string;
	export let description: string;
</script>

<Card.Root class="w-full">
	<Card.Header>
		<Card.Title tag="h1" class="text-2xl font-semibold">
			{title}
		</Card.Title>
		<Card.Description>
			{description}
		</Card.Description>
	</Card.Header>
	<Card.Content>
		<slot />
	</Card.Content>
</Card.Root>
