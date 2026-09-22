<script lang="ts">
	import type { Snippet } from 'svelte';
	import Button from './Button.svelte';

	interface Cta {
		label: string;
		href: string;
		variant?: 'primary' | 'secondary';
	}

	let {
		ctas = [],
		children,
		class: className = ''
	}: {
		ctas?: Cta[];
		children?: Snippet;
		class?: string;
	} = $props();
</script>

<div class="flex flex-col gap-11 {className}">
	{#if children}
		<p class="paragraph-lead">{@render children()}</p>
	{/if}
	{#if ctas.length}
		<div class="flex items-center gap-8">
			{#each ctas.slice(0, 2) as cta}
				<Button variant={cta.variant ?? 'primary'} href={cta.href}>{cta.label}</Button>
			{/each}
		</div>
	{/if}
</div>
