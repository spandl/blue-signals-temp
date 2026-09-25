<script lang="ts">
	import type { Snippet } from 'svelte';
	import WaterCanvas from '$lib/water/WaterCanvas.svelte';
	import WakeCanvas from '$lib/wake/WakeCanvas.svelte';
	import ScrollInHomeIcon from './ScrollInHomeIcon.svelte';

	let {
		children,
		class: className = '',
		rootMargin = '150px 0px 0px 0px'
	}: {
		children?: Snippet;
		class?: string;
		rootMargin?: string;
	} = $props();

	let target = $state<HTMLDivElement | null>(null);
</script>

<header class="relative h-[70vh] max-h-240 min-h-105 w-full overflow-hidden {className}">
	<WaterCanvas class="absolute inset-0 h-full w-full" />
	<WakeCanvas class="absolute inset-0 h-full w-full" />

	{#if children}
		<div
			bind:this={target}
			class="pointer-events-none absolute inset-x-0 bottom-[12%]"
		>
			{@render children()}
		</div>
	{/if}
</header>

{#if target}
	<ScrollInHomeIcon {target} {rootMargin} />
{/if}
