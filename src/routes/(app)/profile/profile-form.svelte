<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { profileSchema, type ProfileSchema } from './schema';
	import { currentUser } from '$lib/stores/user';
	import type { FormResult } from 'sveltekit-superforms/client';
	import type { ActionData } from './$types';
	import * as Form from '$lib/components/ui/form';
	import { Loader2 } from 'lucide-svelte';
	import { account } from '$lib/appwrite';

	export let form: SuperValidated<ProfileSchema>;

	let loading = false;

	const handleResult = async (event: any) => {
		loading = true;
		const result = event.result as FormResult<ActionData>;

		try {
			if (result.status === 200) {
				let name = result.data.form.data.name as string;

				if (name.trim() !== $currentUser?.name) {
					await account.updateName(name);
				}

				const user = await account.get();
				currentUser.set(user);
			}
		} finally {
			loading = false;
		}
	};
</script>

<Form.Root
	method="POST"
	{form}
	schema={profileSchema}
	let:config
	let:submitting
	let:message
	options={{
		onResult: handleResult
	}}
>
	<Form.Field {config} name="name" let:value>
		<Form.Item>
			<Form.Label>Full Name</Form.Label>
			<Form.Input initialValue={$currentUser?.name} />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="email">
		<Form.Item>
			<Form.Label>Email</Form.Label>
			<Form.Input initialValue={$currentUser?.email} />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Button class="mt-2 w-full" size="lg">
		{#if submitting || loading}
			<Loader2 class="animate-spin" />
		{:else}
			Save
		{/if}
	</Form.Button>
</Form.Root>
