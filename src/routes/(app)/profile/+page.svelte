<script lang="ts">
	import type { PageData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import ProfileForm from './profile-form.svelte';
	import { currentUser } from '$lib/stores/user';

	export let data: PageData;
</script>

<svelte:head>
	<title>Profile - Get Invoice</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center">
	<div class="w-full max-w-[650px]">
		<Card.Root class="w-full">
			<Card.Header>
				<Card.Title tag="h2" class="text-2xl">Edit Profile</Card.Title>
				<Card.Description>Edit your profile information</Card.Description>
			</Card.Header>
			<Card.Content>
				<ProfileForm form={data.form} />
			</Card.Content>
		</Card.Root>
	</div>
</div>
