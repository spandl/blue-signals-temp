<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import LogoTagline from '$lib/components/header/LogoTagline.svelte';
	import Container from '$lib/components/layout/Container.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-screen flex-col">
	<Header>
		<Container>
			<LogoTagline blurCircles />
		</Container>
	</Header>
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
