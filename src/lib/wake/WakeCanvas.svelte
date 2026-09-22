<script lang="ts">
	import { onMount } from 'svelte';
	import { WakeSimulation, DEFAULT_WAKE_SETTINGS, type WakeSettings } from './WakeSimulation';

	let {
		autoInput = DEFAULT_WAKE_SETTINGS.autoInput,
		depth = DEFAULT_WAKE_SETTINGS.depth,
		gravity = DEFAULT_WAKE_SETTINGS.gravity,
		sourceSpeed = DEFAULT_WAKE_SETTINGS.sourceSpeed,
		inputStrength = DEFAULT_WAKE_SETTINGS.inputStrength,
		timeStep = DEFAULT_WAKE_SETTINGS.timeStep,
		halfLife = DEFAULT_WAKE_SETTINGS.halfLife,
		resolution = DEFAULT_WAKE_SETTINGS.resolution,
		mouseCutoff = DEFAULT_WAKE_SETTINGS.mouseCutoff,
		sourceMargin = DEFAULT_WAKE_SETTINGS.sourceMargin,
		color = DEFAULT_WAKE_SETTINGS.color,
		opacity = DEFAULT_WAKE_SETTINGS.opacity,
		class: className = ''
	}: Partial<WakeSettings> & { class?: string } = $props();

	let canvas: HTMLCanvasElement;
	let sim: WakeSimulation | undefined;
	let ready = $state(false);

	const filterId = `cyan-wake-${Math.random().toString(36).slice(2, 8)}`;

	const current = (): Partial<WakeSettings> => ({
		autoInput,
		depth,
		gravity,
		sourceSpeed,
		inputStrength,
		timeStep,
		halfLife,
		resolution,
		mouseCutoff,
		sourceMargin,
		color,
		opacity
	});

	// feColorMatrix: RGB → constant wake color, alpha → 1 − luma
	const matrixValues = $derived.by(() => {
		const c = color.replace('#', '');
		const r = parseInt(c.slice(0, 2), 16) / 255;
		const g = parseInt(c.slice(2, 4), 16) / 255;
		const b = parseInt(c.slice(4, 6), 16) / 255;
		return `0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} -.2126 -.7152 -.0722 0 1`;
	});

	onMount(() => {
		sim = new WakeSimulation(canvas, current());
		sim.start();
		let revealFrame = 0;
		const paintFrame = requestAnimationFrame(() => {
			revealFrame = requestAnimationFrame(() => {
				ready = true;
			});
		});
		return () => {
			cancelAnimationFrame(paintFrame);
			cancelAnimationFrame(revealFrame);
			sim?.destroy();
		};
	});

	$effect(() => {
		sim?.updateSettings(current());
	});
</script>

<svg class="absolute h-0 w-0" aria-hidden="true">
	<filter id={filterId} color-interpolation-filters="sRGB">
		<feColorMatrix type="matrix" values={matrixValues} />
	</filter>
</svg>
<canvas
	bind:this={canvas}
	class="pointer-events-none {className}"
	style:filter="url(#{filterId})"
	style:opacity={ready ? opacity : 0}
	aria-hidden="true"
></canvas>
