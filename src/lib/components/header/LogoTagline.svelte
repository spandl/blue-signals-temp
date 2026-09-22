<script lang="ts">
	import Logo from './Logo.svelte';

	let {
		tagline = 'Generate leads from your professional network.',
		blurCircles = false,
		class: className = ''
	}: { tagline?: string; blurCircles?: boolean; class?: string } = $props();
</script>

<div class="logo-tagline relative flex w-full max-w-[666px] flex-col items-start gap-6 {className}">
	{#if blurCircles}
		<div class="blur-circles" aria-hidden="true">
			<div class="blur-circle blur-circle-large"></div>
			<div class="blur-circle blur-circle-small"></div>
		</div>
	{/if}
	<Logo class="relative z-10 w-full max-w-[601px]" />
	<p class="heading-byline relative z-10">{tagline}</p>
</div>

<style>
	.blur-circles {
		position: absolute;
		top: 50%;
		left: 50%;
		width: min(96.5625rem, 250vw);
		aspect-ratio: 1545 / 953;
		transform: translate(-30.8%, -50%);
		pointer-events: none;
	}

	.blur-circle {
		position: absolute;
		aspect-ratio: 1;
		border-radius: 50%;
		background: rgb(255 255 255 / 25%);
		backdrop-filter: blur(3px);
		-webkit-backdrop-filter: blur(3px);
	}

	.blur-circle-large {
		top: 0;
		left: 0;
		width: 61.7%;
	}

	.blur-circle-small {
		top: 27.6%;
		right: 0;
		width: 27.7%;
	}
</style>
