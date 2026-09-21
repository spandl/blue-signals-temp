<script lang="ts">
	import wordmark from '$lib/assets/logo-wordmark.svg?raw';
	import LogoSignet from './LogoSignet.svelte';

	let { class: className = '' }: { class?: string } = $props();
</script>

<!-- Figma "blue signals logo" (313:13): 246×45, signet at x199–246 / y10–39 -->
<span class="relative inline-block aspect-[246/45] {className}">
	<span class="absolute inset-0 [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
		>{@html wordmark}</span
	>
	<LogoSignet class="absolute top-[22.2%] left-[80.9%] w-[19.1%]" />
</span>
