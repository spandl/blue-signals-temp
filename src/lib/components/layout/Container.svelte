<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, class: className = '' }: { children?: Snippet; class?: string } = $props();
</script>

<div class="mx-auto w-full max-w-content px-6 md:px-8 {className}">
	{@render children?.()}
</div>
