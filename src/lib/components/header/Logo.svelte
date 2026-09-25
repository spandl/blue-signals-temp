<script lang="ts">
	import logo from '$lib/assets/logo.svg?raw';

	let { class: className = '' }: { class?: string } = $props();
</script>

<!-- Figma "blue signals logo" (313:13): 246×53 -->
<span class="relative inline-block aspect-246/53 {className}">
	<span class="absolute inset-0 [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
		>{@html logo}</span
	>
</span>
