<script lang="ts">
	import type { Snippet } from 'svelte';
	import WaterCanvas from '$lib/water/WaterCanvas.svelte';
	import WakeCanvas from '$lib/wake/WakeCanvas.svelte';

	let { children }: { children?: Snippet } = $props();
	let menuOpen = $state(false);

	const links = [
		{ label: 'Home', href: '/' },
		{ label: 'Lead generation', href: '/#lead-generation' },
		{ label: 'Agency tools', href: '/#agency-tools' },
		{ label: 'Pricing', href: '/#pricing' },
		{ label: 'Onboarding', href: '/#onboarding' }
	];
</script>

<svelte:window onkeydown={(event) => event.key === 'Escape' && (menuOpen = false)} />

<div class:open={menuOpen} class="menu-panel fixed inset-x-0 top-0 z-40">
		<nav aria-label="Primary navigation">
			{#each links as link, index (link.label)}
				<a
					href={link.href}
					style:--link-index={index}
					onclick={() => (menuOpen = false)}
				>{link.label}</a
				>
			{/each}
		</nav>
	</div>

	<button
		type="button"
		class:open={menuOpen}
		class="menu-toggle pointer-events-auto fixed top-6 right-6 z-50 h-10 w-10 md:top-8 md:right-8"
		aria-label={menuOpen ? 'Close menu' : 'Open menu'}
		aria-expanded={menuOpen}
		onclick={() => (menuOpen = !menuOpen)}
	>
		<span></span>
		<span></span>
		<span></span>
</button>

<header class="relative h-[70vh] max-h-[960px] min-h-[420px] w-full overflow-hidden">
	<WaterCanvas class="absolute inset-0 h-full w-full" />
	<WakeCanvas class="absolute inset-0 h-full w-full" />

	{#if children}
		<div class="pointer-events-none absolute inset-x-0 bottom-[12%]">
			{@render children()}
		</div>
	{/if}
</header>

<style>
	.menu-panel {
		height: 13.0625rem;
		padding: 6.5rem max(2rem, calc((100vw - 64rem) / 2)) 2rem;
		background: rgb(249 249 249 / 75%);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		opacity: 0;
		transform: translate3d(0, -100%, 0);
		transition:
			transform 700ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 450ms ease;
		pointer-events: none;
	}

	.menu-panel.open {
		opacity: 1;
		transform: translate3d(0, 0, 0);
		pointer-events: auto;
	}

	.menu-panel nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
	}

	.menu-panel a {
		font-family: var(--font-sans);
		font-size: 1.5rem;
		font-weight: 500;
		color: var(--color-teal-deep);
		opacity: 0;
		transform: translate3d(0, -0.75rem, 0);
		transition:
			opacity 350ms ease calc(180ms + var(--link-index) * 55ms),
			transform 500ms cubic-bezier(0.22, 1, 0.36, 1) calc(180ms + var(--link-index) * 55ms);
	}

	.menu-panel.open a {
		opacity: 1;
		transform: translate3d(0, 0, 0);
	}

	.menu-toggle span {
		position: absolute;
		left: 0;
		width: 100%;
		height: 0.375rem;
		background: var(--color-cyan);
		transform-origin: center;
		transition:
			top 500ms cubic-bezier(0.22, 1, 0.36, 1),
			transform 500ms cubic-bezier(0.22, 1, 0.36, 1),
			opacity 250ms ease;
	}

	.menu-toggle span:nth-child(1) {
		top: 0.375rem;
	}

	.menu-toggle span:nth-child(2) {
		top: 1.0625rem;
	}

	.menu-toggle span:nth-child(3) {
		top: 1.75rem;
	}

	.menu-toggle.open span:nth-child(1),
	.menu-toggle.open span:nth-child(3) {
		top: 1.0625rem;
	}

	.menu-toggle.open span:nth-child(1) {
		transform: rotate(45deg);
	}

	.menu-toggle.open span:nth-child(2) {
		opacity: 0;
	}

	.menu-toggle.open span:nth-child(3) {
		transform: rotate(-45deg);
	}

	@media (max-width: 767px) {
		.menu-panel {
			height: 100svh;
			padding: 8rem 1.5rem 3rem;
		}

		.menu-panel nav {
			align-items: flex-start;
			flex-direction: column;
			justify-content: flex-start;
			gap: 2rem;
		}

		.menu-panel a {
			font-size: 2rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.menu-panel,
		.menu-panel a,
		.menu-toggle span {
			transition-duration: 0.01ms;
		}
	}
</style>
