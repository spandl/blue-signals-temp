<script lang="ts">
	import Button from './Button.svelte';
	import Container from './layout/Container.svelte';

	let {
		href = '#',
		headline = 'Spin up your own lead generation cycle.',
		copy = 'Invest 20 minutes now to learn how blueSignals will help your GTM strategy.'
	}: { href?: string; headline?: string; copy?: string } = $props();
</script>

<section class="bg-cyan text-white">
	<Container class="flex min-h-128.75 flex-col items-start justify-center gap-3 py-20">
		<h2 class="max-w-248 font-sans text-[clamp(2.5rem,4vw,3.5rem)] leading-tight font-semibold">
			{headline}
		</h2>
		<p class="paragraph-normal max-w-232 text-white">{copy}</p>
		<Button variant="inverse" {href} class="mt-16">Book a demo</Button>
	</Container>
</section>
