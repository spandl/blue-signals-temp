<script lang="ts">
	import Container from '$lib/components/layout/Container.svelte';
	import WaterCanvas from '$lib/water/WaterCanvas.svelte';
	import WakeCanvas from '$lib/wake/WakeCanvas.svelte';
	import Logo from './Logo.svelte';
	import ScrollInHomeIcon from './ScrollInHomeIcon.svelte';

	let { headline, class: className = '' }: { headline: string; class?: string } = $props();

	let smallLogo = $state<HTMLAnchorElement | null>(null);
</script>

<section class="small-showbox relative h-[28.125rem] max-h-[80vw] w-full overflow-hidden {className}">
	<WaterCanvas
		class="absolute inset-0 h-full w-full"
		dropIntervalMin={2}
		dropIntervalMax={5}
	/>
	<WakeCanvas class="absolute inset-0 h-full w-full" />

	<a
		bind:this={smallLogo}
		href="/"
		class="small-logo absolute left-6 top-6 z-20 md:left-8 md:top-8"
		aria-label="blueSignals home"
	>
		<Logo class="w-36 md:w-44" />
	</a>

	<Container class="absolute inset-x-0 bottom-[12%] z-10">
		<h1 class="heading-h1 max-w-4xl">{headline}</h1>
	</Container>
</section>

<ScrollInHomeIcon target={smallLogo} rootMargin="80px 0px 0px 0px" />
