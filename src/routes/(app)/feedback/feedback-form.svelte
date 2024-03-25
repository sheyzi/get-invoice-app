<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { feedbackSchema, type FeedbackSchema } from './schema';
	import { createFeedback, type CreateFeedback } from '$lib/appwrite';
	import type { FormResult } from 'sveltekit-superforms/client';
	import type { ActionData } from './$types';

	import * as Form from '$lib/components/ui/form';
	import { Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { currentUser } from '../../../lib/stores/user';
	import { goto } from '$app/navigation';

	export let form: SuperValidated<FeedbackSchema>;

	let loading = false;

	const handleResult = async (event: any) => {
		loading = true;
		const result = event.result as FormResult<ActionData>;

		try {
			if (result.status === 200) {
				try {
					await createFeedback({
						email: $currentUser?.email as string,
						title: result.data.form.data.title as string,
						message: result.data.form.data.message as string
					});
					toast.success('Feedback sent successfully');
					await goto('/');
				} catch (error) {
					toast.error('Oops! Something went wrong. Please try again.');
				}
			}
		} finally {
			loading = false;
		}
	};
</script>

<Form.Root
	method="POST"
	{form}
	schema={feedbackSchema}
	let:config
	let:submitting
	options={{
		onResult: handleResult
	}}
	class="space-y-4"
>
	<Form.Field {config} name="title" let:value>
		<Form.Item>
			<Form.Label>Title</Form.Label>
			<Form.Input />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="message" let:value>
		<Form.Item>
			<Form.Label>Message</Form.Label>
			<Form.Textarea />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Button class="mt-2 w-full" size="lg">
		{#if submitting || loading}
			<Loader2 class="h-6 w-6 animate-spin" />
		{:else}
			Send Feedback
		{/if}
	</Form.Button>
</Form.Root>
