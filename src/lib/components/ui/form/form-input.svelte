<script lang="ts">
	import { getFormField } from 'formsnap';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { Input, type InputEvents } from '$lib/components/ui/input';
	import { onMount } from 'svelte';

	type $$Props = HTMLInputAttributes & {
		initialValue?: any;
	};
	type $$Events = InputEvents;

	export let initialValue: any = null;

	const { attrStore, value, setValue } = getFormField();

	onMount(() => {
		if (initialValue) {
			setValue(initialValue);
		}
	});
</script>

<Input
	{...$attrStore}
	bind:value={$value}
	{...$$restProps}
	on:blur
	on:change
	on:click
	on:focus
	on:keydown
	on:keypress
	on:keyup
	on:mouseover
	on:mouseenter
	on:mouseleave
	on:paste
	on:input
/>
