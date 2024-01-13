<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Button } from '$lib/components/ui/button';
	import { loginSchema, type LoginSchema } from './schema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { FormResult } from 'sveltekit-superforms/client';
	import type { ActionData } from './$types';
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/stores/user';
	import { account } from '$lib/appwrite';
	import { page } from '$app/stores';

	import { Loader2 } from 'lucide-svelte';

	export let form: SuperValidated<LoginSchema>;

	let loading = false;

	const handleResult = async (event: any) => {
		loading = true;
		const result = event.result as FormResult<ActionData>;

		if (result.status === 200) {
			const email = result.data.form.data.email as string;
			const password = result.data.form.data.password as string;

			try {
				await account.createEmailSession(email, password);
				const user = await account.get();
				currentUser.set(user);
				const redirect = $page.url.searchParams.get('redirect') || '/';
				await goto(redirect);
			} catch (error) {
				console.log(error);
			} finally {
				loading = false;
			}
		}
	};
</script>

<Form.Root
	method="POST"
	{form}
	schema={loginSchema}
	let:config
	let:submitting
	let:message
	options={{
		onResult: handleResult
	}}
>
	<Form.Field {config} name="email">
		<Form.Item>
			<Form.Label>Email</Form.Label>
			<Form.Input type="email" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="password">
		<Form.Item>
			<Form.Label>Password</Form.Label>
			<Form.Input type="password" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>
	<div class="flex justify-end">
		<Button href="/auth/forgot-password" variant="link" class="px-0">Forgot password?</Button>
	</div>

	{#if message}
		<div class="mt-3 rounded-sm bg-destructive/20 p-3">
			<p class="text-destructive">{message}</p>
		</div>
	{/if}

	<Form.Button class="mt-2 w-full" size="lg">
		{#if submitting || loading}
			<Loader2 class="animate-spin" />
		{:else}
			Login
		{/if}
	</Form.Button>
</Form.Root>
