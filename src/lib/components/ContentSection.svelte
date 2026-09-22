<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import Button from './Button.svelte';

	interface Cta {
		label: string;
		href: string;
		variant?: 'primary' | 'secondary';
	}

	let {
		headline,
		ctas = [],
		visual,
		children,
		scrollReveal = false,
		class: className = ''
	}: {
		headline?: string;
		ctas?: Cta[];
		visual?: Snippet;
		children?: Snippet;
		scrollReveal?: boolean;
		class?: string;
	} = $props();

	let scene: HTMLElement;
	let visualMask: HTMLElement;
	let copy: HTMLElement;
	let ready = $state(false);

	const phase = (progress: number, start: number, end: number) =>
		Math.min(1, Math.max(0, (progress - start) / (end - start)));

	onMount(() => {
		if (!scrollReveal || !scene || !visualMask || !copy) return;

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		const visualOffset = visualMask.getBoundingClientRect().top - scene.getBoundingClientRect().top;
		let frame = 0;

		const update = () => {
			frame = 0;
			if (reducedMotion.matches) {
				ready = false;
				return;
			}

			const bounds = scene.getBoundingClientRect();
			const distance = window.innerHeight * 0.9;
			const revealStart = window.innerHeight - 24 - visualOffset;
			const progress = Math.min(1, Math.max(0, (revealStart - bounds.top) / distance));
			const copyBounds = copy.getBoundingClientRect();
			const copyProgress = Math.min(1, Math.max(0, (window.innerHeight - 24 - copyBounds.top) / (window.innerHeight * 0.18)));
			scene.style.setProperty('--headline-progress', String(phase(progress, 0, 0.72)));
			scene.style.setProperty('--visual-progress', String(phase(progress, 0, 0.36)));
			scene.style.setProperty('--copy-progress', String(copyProgress));
			ready = true;
		};

		const scheduleUpdate = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		const resizeObserver = new ResizeObserver(scheduleUpdate);

		window.addEventListener('scroll', scheduleUpdate, { passive: true });
		window.addEventListener('resize', scheduleUpdate);
		reducedMotion.addEventListener('change', scheduleUpdate);
		resizeObserver.observe(scene);
		update();

		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('scroll', scheduleUpdate);
			window.removeEventListener('resize', scheduleUpdate);
			reducedMotion.removeEventListener('change', scheduleUpdate);
			resizeObserver.disconnect();
		};
	});
</script>

<section
	bind:this={scene}
	class:scroll-reveal={scrollReveal}
	class:ready
	class="content-section my-9 flex flex-col items-center gap-[4.7rem] text-center {className}"
>
	{#if headline}
		<h2 class="headline heading-h2">{headline}</h2>
	{/if}
	{#if visual}
		<div bind:this={visualMask} class="visual-mask">
			<div class="visual">{@render visual()}</div>
		</div>
	{/if}
	<div bind:this={copy} class="copy flex flex-col items-center gap-[4.7rem]">
		{#if children}
			<p class="paragraph-normal text-teal-deep">{@render children()}</p>
		{/if}
		{#if ctas.length}
			<div class="flex items-center gap-8">
				{#each ctas.slice(0, 2) as cta (cta.label)}
					<Button variant={cta.variant ?? 'primary'} href={cta.href}>{cta.label}</Button>
				{/each}
			</div>
		{/if}
	</div>
</section>

<style>
	.scroll-reveal {
		gap: 1.5rem;
		margin-top: clamp(12rem, 24vh, 22rem);
		padding-bottom: clamp(5rem, 14vh, 12rem);
	}

	.scroll-reveal.ready .headline {
		transform: translate3d(0, calc(var(--headline-progress) * -18vh), 0);
	}

	.scroll-reveal.ready .visual-mask {
		clip-path: inset(calc((1 - var(--visual-progress)) * 100%) 0 0);
		transform: translate3d(
			0,
			calc(var(--headline-progress) * -18vh + (1 - var(--visual-progress)) * -100%),
			0
		);
	}

	.scroll-reveal.ready .copy {
		opacity: var(--copy-progress);
		transform: translate3d(0, calc(var(--headline-progress) * -18vh), 0);
	}

	.headline,
	.visual-mask,
	.visual,
	.copy {
		will-change: transform;
	}

	.visual-mask {
		width: 100%;
	}

	.visual {
		display: flex;
		justify-content: center;
	}

	@media (max-width: 767px) {
		.scroll-reveal {
			margin-top: clamp(8rem, 18vh, 12rem);
			padding-bottom: 4rem;
		}

		.scroll-reveal.ready .headline,
		.scroll-reveal.ready .copy {
			transform: translate3d(0, calc(var(--headline-progress) * -8vh), 0);
		}

		.scroll-reveal.ready .visual-mask {
			transform: translate3d(
				0,
				calc(var(--headline-progress) * -8vh + (1 - var(--visual-progress)) * -100%),
				0
			);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.scroll-reveal {
			margin-top: 12rem;
			padding-bottom: 0;
		}
	}
</style>
