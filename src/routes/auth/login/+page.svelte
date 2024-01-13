<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import LoginForm from './login-form.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Login - Get Invoice</title>
</svelte:head>

<div class="flex h-screen w-full items-center justify-center">
	<Card.Root class="w-full max-w-[500px]">
		<Card.Header>
			<Card.Title tag="h2" class="text-2xl">Welcome back</Card.Title>
			<Card.Description>Enter your credentials to access your dashboard.</Card.Description>
		</Card.Header>
		<Card.Content>
			<LoginForm form={data.form} />
		</Card.Content>
		<Card.Footer class="flex justify-center">
			<Button href="/auth/register" variant="link">Don't have an account? Register</Button>
		</Card.Footer>
	</Card.Root>
</div>
