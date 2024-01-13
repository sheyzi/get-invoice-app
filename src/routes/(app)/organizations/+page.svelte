<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Organizations - Get Invoice</title>
</svelte:head>

You can see that the `login-form.svelte` component is imported and used in the
`auth/login/+page.svelte` page. The `login-form.svelte` component is also used in the
`auth/register/+page.svelte` page. This is because the login form is used in both the login and
register pages.
