<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { ChevronRight } from 'lucide-svelte';

	type BreadCrumb = {
		label: string;
		href: string;
	};

	let breadcrumbs: BreadCrumb[] = [];

	$: {
		if (browser) {
			const path = $page.url.pathname.split('/').filter((p) => p);

			breadcrumbs = path.map((p, i) => {
				const href = '/' + path.slice(0, i + 1).join('/');
				return {
					// Capitalize first letter
					label: p === 'admin' ? 'Dashboard' : p.charAt(0).toUpperCase() + p.slice(1),
					href
				};
			});
		}
	}
</script>

<nav class="flex items-center gap-2">
	{#each breadcrumbs as breadcrumb, index}
		<a
			href={breadcrumb.href === '/invoice' ? '/' : breadcrumb.href}
			class="hover:text-black hover:underline"
		>
			{breadcrumb.label}
		</a>
		{#if index !== breadcrumbs.length - 1}
			<ChevronRight class="h-5 w-5" />
			<!-- <iconify-icon icon="iconamoon:arrow-right-2-thin" width="25" /> -->
		{/if}
	{/each}
</nav>
