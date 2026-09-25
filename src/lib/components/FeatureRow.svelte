<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import Button from './Button.svelte';
	import HeadlineBubble from './HeadlineBubble.svelte';

	interface Cta {
		label: string;
		href: string;
		variant?: 'primary' | 'secondary';
	}

	let {
		side = 'right',
		bubbleVariant = 'dark',
		headline,
		ctas = [],
		children,
		scrollReveal = false,
		id,
		class: className = ''
	}: {
		/** side the bubble sits on once revealed */
		side?: 'left' | 'right';
		bubbleVariant?: 'dark' | 'light';
		headline?: string;
		ctas?: Cta[];
		children?: Snippet;
		scrollReveal?: boolean;
		id?: string;
		class?: string;
	} = $props();

	let scene: HTMLElement;
	let bubble: HTMLElement;
	let copy: HTMLElement;
	let ready = $state(false);

	const phase = (progress: number, start: number, end: number) =>
		Math.min(1, Math.max(0, (progress - start) / (end - start)));
	const easeInOut = (progress: number) =>
		progress * progress * progress * (progress * (progress * 6 - 15) + 10);

	onMount(() => {
		if (!scrollReveal || !scene || !bubble || !copy) return;

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		const sceneBounds = scene.getBoundingClientRect();
		const bubbleBounds = bubble.getBoundingClientRect();
		const bubbleCenterOffset = bubbleBounds.top - sceneBounds.top + bubbleBounds.height / 2;
		let frame = 0;

		const update = () => {
			frame = 0;
			if (reducedMotion.matches) {
				ready = false;
				return;
			}

			const bounds = scene.getBoundingClientRect();
			const revealStart = window.innerHeight - 32 - bubbleCenterOffset;
			const progress = Math.min(1, Math.max(0, (revealStart - bounds.top) / (window.innerHeight * 0.82)));
			const finalCenter = bubble.offsetLeft - scene.offsetLeft + bubble.offsetWidth / 2;
			const oppositeSideShift = scene.clientWidth - 2 * finalCenter;
			const slideProgress = phase(progress, 0.24, 0.55);
			const bubbleSlide = easeInOut(slideProgress);
			const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
			scene.style.setProperty('--bubble-grow', String(phase(progress, 0, 0.22)));
			scene.style.setProperty('--bubble-start-scale', String(32 / bubble.offsetWidth));
			scene.style.setProperty('--headline-fade', String(phase(progress, 0.18, 0.24)));
			scene.style.setProperty('--bubble-slide', String(bubbleSlide));
			scene.style.setProperty('--bubble-center-shift', `${oppositeSideShift}px`);

			if (isDesktop) {
				const bubbleCenterX = finalCenter + oppositeSideShift * (1 - bubbleSlide);
				const copyLeft = copy.offsetLeft - scene.offsetLeft;
				const copyRight = copyLeft + copy.offsetWidth;
				const copyReveal =
					side === 'right'
						? Math.min(1, Math.max(0, (bubbleCenterX - copyLeft) / copy.offsetWidth))
						: Math.min(1, Math.max(0, (copyRight - bubbleCenterX) / copy.offsetWidth));
				scene.style.setProperty('--copy-reveal', String(copyReveal));
				scene.style.setProperty('--copy-opacity', String(phase(bubbleSlide, 0, 0.15)));
			} else {
				scene.style.setProperty('--copy-reveal', String(phase(progress, 0.30, 0.55)));
			}
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
	{id}
	bind:this={scene}
	class:scroll-reveal={scrollReveal}
	class:ready
	class="feature-row flex items-center gap-24 {side === 'left' ? 'flex-row-reverse' : ''} {className}"
>
	<!-- copy column: revealed when the bubble slides aside -->
	<div bind:this={copy} class="copy flex max-w-141.75 flex-1 flex-col gap-11">
		{#if children}
			<p class="paragraph-normal">{@render children()}</p>
		{/if}
		{#if ctas.length}
			<div class="feature-cta flex items-center gap-8">
				{#each ctas.slice(0, 2) as cta (cta.label)}
					<Button variant={cta.variant ?? 'primary'} href={cta.href}>{cta.label}</Button>
				{/each}
			</div>
		{/if}
	</div>
	<!-- bubble wrapper: transform target for the scroll-in animation -->
	<div bind:this={bubble} class="bubble w-119.5 shrink-0">
		<HeadlineBubble variant={bubbleVariant}>{headline}</HeadlineBubble>
	</div>
</section>

<style>
	.scroll-reveal.ready {
		--bubble-scale: calc(
			var(--bubble-start-scale) + var(--bubble-grow) * (1 - var(--bubble-start-scale))
		);
	}

	.scroll-reveal.ready .bubble {
		--bubble-headline-opacity: var(--headline-fade);
		transform: translate3d(calc(var(--bubble-center-shift) * (1 - var(--bubble-slide))), 0, 0)
			scale(var(--bubble-scale));
	}

	.scroll-reveal.ready .copy {
		opacity: var(--copy-reveal);
		transform: translate3d(0, calc((1 - var(--copy-reveal)) * 3rem), 0);
	}

	@media (min-width: 1024px) {
		.scroll-reveal.ready .bubble {
			position: relative;
			z-index: 2;
		}

		.scroll-reveal.ready .copy {
			position: relative;
			z-index: 1;
			opacity: var(--copy-opacity);
			background-color: #ffffff;
			clip-path: inset(0 calc(100% * (1 - var(--copy-reveal))) 0 0);
		}

		.scroll-reveal.ready.flex-row-reverse .copy {
			clip-path: inset(0 0 0 calc(100% * (1 - var(--copy-reveal))));
		}
	}

	.bubble,
	.copy {
		will-change: transform, clip-path;
	}

	@media (max-width: 1023px) {
		.feature-row {
			flex-direction: column-reverse;
			gap: 3rem;
		}

		.bubble {
			width: min(100%, 29.875rem);
		}

		.copy {
			max-width: 35.4375rem;
			align-items: flex-start;
			text-align: left;
		}

		.feature-cta {
			align-self: center;
		}

		.scroll-reveal.ready .bubble {
			transform: scale(var(--bubble-scale));
		}

		.scroll-reveal.ready .copy {
			transform: translate3d(0, calc((1 - var(--copy-reveal)) * 3rem), 0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.scroll-reveal .bubble,
		.scroll-reveal .copy {
			transform: none;
		}
	}
</style>
