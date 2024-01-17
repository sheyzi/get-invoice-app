<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Form from '$lib/components/ui/form';
	import { registerSchema, type RegisterSchema } from './schema';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let form: SuperValidated<RegisterSchema>;

	import { currentUser } from '$lib/stores/user';
	import { account } from '$lib/appwrite';
	import { page } from '$app/stores';

	import { Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	const handleResult = async (event: any) => {
		const result = event.result as any;
		try {
			if (result.status === 200) {
				const email = result.data.form.data.email as string;
				const password = result.data.form.data.password as string;

				await account.createEmailSession(email, password);
				const user = await account.get();
				currentUser.set(user);
				const redirect = $page.url.searchParams.get('redirect') || '/';
				await goto(redirect);
			}
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong. Please try again later.');
		}
	};
</script>

<Form.Root
	method="POST"
	{form}
	schema={registerSchema}
	let:config
	let:message
	let:submitting
	options={{
		onResult: handleResult
	}}
>
	<Form.Field {config} name="fullName">
		<Form.Item>
			<Form.Label>Name</Form.Label>
			<Form.Input type="text" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="email">
		<Form.Item>
			<Form.Label>Email</Form.Label>
			<Form.Input type="email" />
			<Form.Description>We'll never share your email with anyone else.</Form.Description>
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

	<Form.Field {config} name="confirmPassword">
		<Form.Item>
			<Form.Label>Confirm Password</Form.Label>
			<Form.Input type="password" />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	{#if message}
		<div class="mt-3 rounded-sm bg-destructive/20 p-3">
			<p class="text-destructive">{message}</p>
		</div>
	{/if}

	<Form.Button class="mt-2 w-full" size="lg">
		{#if submitting}
			<Loader2 class="animate-spin" />
		{:else}
			Register
		{/if}
	</Form.Button>
</Form.Root>
