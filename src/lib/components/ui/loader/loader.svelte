<script lang="ts">
	export let backgroundOpacity = 1;
</script>

<div class="fixed z-50 flex h-screen w-screen items-center justify-center bg-background">
	<!-- Overlay -->
	<div
		class="absolute left-0 top-0 h-screen w-screen"
		style={`opacity: ${backgroundOpacity}`}
	></div>

	<div
		class="z-10 h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-foreground"
	></div>
</div>
