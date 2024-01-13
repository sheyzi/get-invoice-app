<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';

	import RegisterForm from './register-form.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Register - Get Invoice</title>
</svelte:head>

<div class="flex h-screen w-full flex-col items-center justify-center">
	<div class="max-w-[500px]">
		<Card.Root class="w-full  ">
			<Card.Header>
				<Card.Title tag="h2" class="text-2xl">Create account</Card.Title>
				<Card.Description>Signup to create your account</Card.Description>
			</Card.Header>
			<Card.Content>
				<RegisterForm form={data.form} />
			</Card.Content>
			<Card.Footer class="flex justify-center">
				<Button href="/auth/login" variant="link">Already have an account? Login</Button>
			</Card.Footer>
		</Card.Root>
		<p class="mt-2 px-5 text-center text-sm">
			By clicking create account, you agree to our
			<Button size="no-padding" variant="link">Terms of Service</Button> and
			<Button size="no-padding" variant="link">Privacy Policy</Button>.
		</p>
	</div>
</div>
