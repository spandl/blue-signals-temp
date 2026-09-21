<script lang="ts">
	import { onMount } from 'svelte';
	import { WaterSimulation, DEFAULT_SETTINGS, type WaterSettings } from './WaterSimulation';

	let {
		damping = DEFAULT_SETTINGS.damping,
		dropStrength = DEFAULT_SETTINGS.dropStrength,
		dropRadius = DEFAULT_SETTINGS.dropRadius,
		dropIntervalMin = DEFAULT_SETTINGS.dropIntervalMin,
		dropIntervalMax = DEFAULT_SETTINGS.dropIntervalMax,
		pointerMode = DEFAULT_SETTINGS.pointerMode,
		pointerStrength = DEFAULT_SETTINGS.pointerStrength,
		baseTint = DEFAULT_SETTINGS.baseTint,
		depthTint = DEFAULT_SETTINGS.depthTint,
		waveContrast = DEFAULT_SETTINGS.waveContrast,
		highlight = DEFAULT_SETTINGS.highlight,
		class: className = ''
	}: Partial<WaterSettings> & { class?: string } = $props();

	let canvas: HTMLCanvasElement;
	let sim: WaterSimulation | undefined;

	const current = (): Partial<WaterSettings> => ({
		damping,
		dropStrength,
		dropRadius,
		dropIntervalMin,
		dropIntervalMax,
		pointerMode,
		pointerStrength,
		baseTint,
		depthTint,
		waveContrast,
		highlight
	});

	onMount(() => {
		sim = new WaterSimulation(canvas, current());
		return () => sim?.destroy();
	});

	$effect(() => {
		sim?.updateSettings(current());
	});
</script>

<canvas bind:this={canvas} class={className} aria-hidden="true"></canvas>
