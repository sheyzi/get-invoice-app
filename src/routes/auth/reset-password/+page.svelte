<script lang="ts">
	import { page } from '$app/stores';
	import { z } from 'zod';
	import { resetPasswordSchema } from './schema';
	import { toast } from 'svelte-sonner';
	import { resetPassword } from '$lib/appwrite';

	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';

	import { Loader2 } from 'lucide-svelte';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { AppwriteException } from 'appwrite';

	const userId = $page.url.searchParams.get('userId') as string;
	const token = $page.url.searchParams.get('secret') as string;

	let loading = false;
	let errors: any = {};

	const form = {
		password: '',
		confirmPassword: ''
	};

	const handleSubmit = async () => {
		loading = true;
		errors = {};

		try {
			let data = resetPasswordSchema.parse(form);

			// const isExpired = expireDate < new Date();

			// if (isExpired) {
			// 	toast.error('Password reset link has expired.');
			// } else {
			await resetPassword(userId, token, data.password, data.confirmPassword);
			toast.success('Password has been reset.');
			// }
		} catch (error) {
			if (error instanceof z.ZodError) {
				errors = error.flatten().fieldErrors;
			} else if (error instanceof AppwriteException) {
				console.log(error.code);
				if (error.code === 401) {
					toast.error('Invalid or expired reset password link. Please request a new one.');
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
	<title>Reset Password - Get Invoice</title>
</svelte:head>

<div class="flex h-screen w-full items-center justify-center">
	<Card.Root class="w-full max-w-[500px]">
		<Card.Header>
			<Card.Title tag="h2" class="text-2xl">Password reset link has expired.</Card.Title>

			<Card.Description>Enter your new password.</Card.Description>
		</Card.Header>

		<Card.Content>
			<form on:submit|preventDefault={handleSubmit}>
				<div class="space-y-4">
					<div class="space-y-2">
						<Label for="password">Password</Label>
						<Input type="password" id="password" bind:value={form.password} />
						{#if errors.password}
							<p class="text-sm text-red-500">{errors.password}</p>
						{/if}
					</div>
					<div class="space-y-2">
						<Label for="confirmPassword">Confirm Password</Label>
						<Input type="password" id="confirmPassword" bind:value={form.confirmPassword} />
						{#if errors.confirmPassword}
							<p class="text-sm text-red-500">{errors.confirmPassword}</p>
						{/if}
					</div>
					<div>
						<Button type="submit" disabled={loading}>
							{#if loading}
								<Loader2 class="h-5 w-5 animate-spin" />
							{:else}
								Reset Password
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
