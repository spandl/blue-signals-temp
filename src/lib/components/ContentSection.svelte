<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';

	interface Cta {
		label: string;
		href: string;
		variant?: 'primary' | 'secondary';
	}

	let {
		headline,
		ctas = [],
		visual,
		children,
		class: className = ''
	}: {
		headline?: string;
		ctas?: Cta[];
		visual?: Snippet;
		children?: Snippet;
		class?: string;
	} = $props();
</script>

<section class="my-9 flex flex-col items-center gap-[4.7rem] text-center {className}">
	{#if headline}
		<h2 class="heading-h2">{headline}</h2>
	{/if}
	{#if visual}
		{@render visual()}
	{/if}
	{#if children}
		<p class="paragraph-normal text-teal-deep">{@render children()}</p>
	{/if}
	{#if ctas.length}
		<div class="flex items-center gap-8">
			{#each ctas.slice(0, 2) as cta}
				<Button variant={cta.variant ?? 'primary'} href={cta.href}>{cta.label}</Button>
			{/each}
		</div>
	{/if}
</section>
