<script lang="ts">
	import logoSignet from '$lib/assets/logo-signet.svg';

	let {
		target,
		rootMargin = '80px 0px 0px 0px'
	}: {
		target?: HTMLElement | null;
		rootMargin?: string;
	} = $props();

	let visible = $state(false);

	$effect(() => {
		if (!target || typeof IntersectionObserver === 'undefined') return;

		const observer = new IntersectionObserver(
			([entry]) => {
				visible = !entry.isIntersecting;
			},
			{ threshold: 0, rootMargin }
		);

		observer.observe(target);
		return () => observer.disconnect();
	});
</script>

<a
	href="/"
	class="home-icon fixed left-6 top-6 z-50 md:left-8 md:top-8"
	class:visible
	aria-label="blueSignals home"
>
	<img src={logoSignet} alt="blueSignals" class="block h-10 w-auto" />
</a>

<style>
	.home-icon {
		transform: translate3d(0, -400%, 0);
		transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
		pointer-events: none;
	}

	.home-icon.visible {
		transform: translate3d(0, 0, 0);
		pointer-events: auto;
	}
</style>
