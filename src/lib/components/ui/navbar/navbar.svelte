<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Loader } from '$lib/components/ui/loader';
	import { User, Building, LogOut, Contact2, ScrollText } from 'lucide-svelte';
	import { currentUser } from '$lib/stores/user';
	import { account } from '$lib/appwrite';
	import { ThemeSwitcher } from '$lib/components/ui/theme-switcher';

	let isLoggingOut = false;

	const handleLogout = async () => {
		isLoggingOut = true;
		try {
			await account.deleteSession('current');
			currentUser.set(null);
		} catch (error) {
			console.error(error);
		} finally {
			isLoggingOut = false;
		}
	};
</script>

{#if isLoggingOut}
	<Loader />
{/if}

<div class="fixed top-0 z-50 w-screen border-b-2 bg-background py-2">
	<div class="container flex items-center justify-between">
		<div>
			<Button href="/" variant="link" size="no-padding" class="text-xl font-semibold"
				>GET-INVOICE</Button
			>
		</div>

		<div class="flex items-center justify-between">
			<ThemeSwitcher />
			<div class="ml-5">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button builders={[builder]} size="icon-no-padding" class="rounded-full">
							<!-- Their initials -->
							<span class="font-semibold">
								{#if $currentUser}
									{#if $currentUser.name}
										{#each $currentUser.name.split(' ') as name}
											{name[0]}
										{/each}
									{:else}
										{#each $currentUser.email.split('@') as name}
											{name[0]}
										{/each}
									{/if}
								{/if}
							</span>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-56">
						<DropdownMenu.Group>
							<DropdownMenu.Item href="/" class="cursor-pointer">
								<ScrollText class="mr-2 h-4 w-4" />
								<span>Invoice</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item href="/organizations" class="cursor-pointer">
								<Building class="mr-2 h-4 w-4" />
								<span>Organizations</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item href="/contacts" class="cursor-pointer">
								<Contact2 class="mr-2 h-4 w-4" />
								<span>Contacts</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item href="/profile" class="cursor-pointer">
								<User class="mr-2 h-4 w-4" />
								<span>Profile</span>
							</DropdownMenu.Item>
						</DropdownMenu.Group>

						<DropdownMenu.Separator />

						<DropdownMenu.Group>
							<DropdownMenu.Item on:click={handleLogout} class="cursor-pointer">
								<LogOut class="mr-2 h-4 w-4" />
								<span>Logout</span>
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	</div>
</div>
