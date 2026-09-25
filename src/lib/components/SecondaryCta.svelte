<script lang="ts">
	import Button from './Button.svelte';

	let {
		nextLabel,
		href,
		class: className = ''
	}: {
		nextLabel: string;
		href: string;
		class?: string;
	} = $props();
</script>

<div class="secondary-cta flex flex-col items-center justify-center gap-8 md:flex-row {className}">
	<span class="text-2xl font-medium text-teal-deep">Next:</span>
	<Button variant="primary" {href}>{nextLabel}</Button>
</div>
