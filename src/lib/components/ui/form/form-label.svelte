<script lang="ts">
	import type { Label as LabelPrimitive } from 'bits-ui';
	import { getFormField } from 'formsnap';
	import { cn } from '$lib/utils';
	import { Label } from '$lib/components/ui/label';

	type $$Props = LabelPrimitive.Props & {
		required?: boolean;
	};

	export let required: $$Props['required'] = false;

	let className: $$Props['class'] = undefined;
	export { className as class };

	const { errors, ids } = getFormField();
</script>

<Label for={$ids.input} class={cn($errors && 'text-destructive', className)} {...$$restProps}>
	<slot />
	{#if required}<span class="text-destructive">*</span>{/if}
</Label>
