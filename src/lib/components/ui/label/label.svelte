<script lang="ts">
	import { Label as LabelPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	type $$Props = LabelPrimitive.Props & {
		required?: boolean;
	};
	type $$Events = LabelPrimitive.Events;

	export let required: $$Props['required'] = false;
	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<LabelPrimitive.Root
	class={cn(
		'flex space-x-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
		className
	)}
	{...$$restProps}
	on:mousedown
>
	<div>
		<slot />
	</div>
	{#if required}
		<span class="text-destructive">*</span>
	{/if}
</LabelPrimitive.Root>
