<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';
	import HeadlineBubble from './HeadlineBubble.svelte';

	interface Cta {
		label: string;
		href: string;
		variant?: 'primary' | 'secondary';
	}

	let {
		side = 'right',
		bubbleVariant = 'dark',
		headline,
		ctas = [],
		children,
		class: className = ''
	}: {
		/** side the bubble sits on once revealed */
		side?: 'left' | 'right';
		bubbleVariant?: 'dark' | 'light';
		headline?: string;
		ctas?: Cta[];
		children?: Snippet;
		class?: string;
	} = $props();
</script>

<section
	class="flex items-center gap-24 {side === 'left' ? 'flex-row-reverse' : ''} {className}"
>
	<!-- copy column: revealed when the bubble slides aside -->
	<div class="flex max-w-[567px] flex-1 flex-col gap-11">
		{#if children}
			<p class="paragraph-normal">{@render children()}</p>
		{/if}
		{#if ctas.length}
			<div class="flex items-center gap-8">
				{#each ctas.slice(0, 2) as cta}
					<Button variant={cta.variant ?? 'primary'} href={cta.href}>{cta.label}</Button>
				{/each}
			</div>
		{/if}
	</div>
	<!-- bubble wrapper: transform target for the scroll-in animation -->
	<div class="bubble w-[478px] shrink-0">
		<HeadlineBubble variant={bubbleVariant}>{headline}</HeadlineBubble>
	</div>
</section>
