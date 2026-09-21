<script lang="ts">
	import type { Snippet } from 'svelte';
	import WaterCanvas from '$lib/water/WaterCanvas.svelte';
	import WakeCanvas from '$lib/wake/WakeCanvas.svelte';
	import menuIcon from '$lib/assets/menu.svg?raw';

	let { children }: { children?: Snippet } = $props();
</script>

<header class="relative h-[70vh] max-h-[960px] min-h-[420px] w-full overflow-hidden">
	<WaterCanvas class="absolute inset-0 h-full w-full" />
	<WakeCanvas class="absolute inset-0 h-full w-full" />

	<button
		type="button"
		class="pointer-events-auto absolute top-8 right-8 text-teal"
		aria-label="Open menu"
	>
		<span class="block w-10">{@html menuIcon}</span>
	</button>

	{#if children}
		<div class="pointer-events-none absolute inset-x-0 bottom-[12%]">
			{@render children()}
		</div>
	{/if}
</header>
