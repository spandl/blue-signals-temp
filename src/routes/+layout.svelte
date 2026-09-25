<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Menu from '$lib/components/header/Menu.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { afterNavigate } from '$app/navigation';

	let { children } = $props();

	afterNavigate(() => {
		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'instant' });
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-screen flex-col">
	<Menu />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
