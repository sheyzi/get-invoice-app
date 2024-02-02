<script lang="ts">
	import { z } from 'zod';
	import { forgotPasswordSchema } from './schema';
	import { toast } from 'svelte-sonner';
	import { forgotPassword } from '$lib/appwrite';
	import { page } from '$app/stores';
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Loader2 } from 'lucide-svelte';
	import { AppwriteException } from 'appwrite';

	let loading = false;
	let errors: any = {};

	const form = {
		email: ''
	};

	const handleSubmit = async () => {
		loading = true;
		errors = {};

		try {
			let data = forgotPasswordSchema.parse(form);

			await forgotPassword(data.email, `${$page.url.origin}/auth/reset-password`);

			toast.success('Password reset link has been sent to your email.');
		} catch (error) {
			if (error instanceof z.ZodError) {
				errors = error.flatten().fieldErrors;
			} else if (error instanceof AppwriteException) {
				if (error.code === 404) {
					toast.error('No user found with this email.');
				} else {
					console.error(error);
					toast.error('Something went wrong. Please try again later.');
				}
			} else {
				console.error(error);
				toast.error('Something went wrong. Please try again later.');
			}
		} finally {
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>Forgot Password - Get Invoice</title>
</svelte:head>

<div class="flex h-screen w-full items-center justify-center">
	<Card.Root class="w-full max-w-[500px]">
		<Card.Header>
			<Card.Title tag="h2" class="text-2xl">Forgot Password</Card.Title>
			<Card.Description>Enter your email to receive a password reset link.</Card.Description>
		</Card.Header>
		<Card.Content>
			<form on:submit|preventDefault={handleSubmit}>
				<div class="space-y-4">
					<div class="space-y-2">
						<Label for="email">Email</Label>
						<Input type="email" id="email" bind:value={form.email} />
						{#if errors.email}
							<p class="text-sm text-red-500">{errors.email}</p>
						{/if}
					</div>
					<div>
						<Button type="submit" disabled={loading}>
							{#if loading}
								<Loader2 class="h-5 w-5 animate-spin" />
							{:else}
								Send Reset Link
							{/if}
						</Button>
					</div>
				</div>
			</form>
		</Card.Content>
		<Card.Footer class="flex justify-center">
			<Button href="/auth/login" variant="link">Return to login</Button>
		</Card.Footer>
	</Card.Root>
</div>
