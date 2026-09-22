<script lang="ts">
	let {
		variant = 'dark',
		children,
		class: className = ''
	}: {
		variant?: 'dark' | 'light';
		children?: import('svelte').Snippet;
		class?: string;
	} = $props();
</script>

<div
	class="flex aspect-square w-full items-center justify-center rounded-full shadow-[4px_4px_4px_rgba(0,0,0,0.05)] {variant ===
	'dark'
		? 'bg-teal-deep'
		: 'bg-cyan'} {className}"
>
	{#if children}
		<span class="bubble-headline heading-circle px-12">{@render children()}</span>
	{/if}
</div>

<style>
	.bubble-headline {
		opacity: var(--bubble-headline-opacity, 1);
	}
</style>
