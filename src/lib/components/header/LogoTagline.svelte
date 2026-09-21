<script lang="ts">
	import Logo from './Logo.svelte';

	let {
		tagline = 'Generate leads from your professional network.',
		class: className = ''
	}: { tagline?: string; class?: string } = $props();
</script>

<div class="flex flex-col items-start gap-6 {className}">
	<Logo class="h-[clamp(3.5rem,8vw,6.875rem)]" />
	<p class="heading-byline">{tagline}</p>
</div>
