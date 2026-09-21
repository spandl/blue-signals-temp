<script lang="ts">
	import signet from '$lib/assets/logo-signet.svg?raw';

	let { class: className = '' }: { class?: string } = $props();
</script>

<span class="inline-block {className} [&_svg]:block [&_svg]:h-auto [&_svg]:w-full" aria-hidden="true"
	>{@html signet}</span
>
