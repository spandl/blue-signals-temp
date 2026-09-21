<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import WaterCanvas from './WaterCanvas.svelte';
	import { DEFAULT_SETTINGS } from './WaterSimulation';

	const { Story } = defineMeta({
		title: 'Header/WaterCanvas',
		component: WaterCanvas,
		argTypes: {
			damping: { control: { type: 'range', min: 0.96, max: 0.999, step: 0.001 } },
			dropStrength: { control: { type: 'range', min: 0.1, max: 3, step: 0.05 } },
			dropRadius: { control: { type: 'range', min: 0.006, max: 0.06, step: 0.001 } },
			dropIntervalMin: { control: { type: 'range', min: 0.5, max: 15, step: 0.1 } },
			dropIntervalMax: { control: { type: 'range', min: 0.5, max: 15, step: 0.1 } },
			pointerStrength: { control: { type: 'range', min: 0.05, max: 1.5, step: 0.05 } },
			baseTint: { control: { type: 'range', min: 0.005, max: 0.12, step: 0.001 } },
			depthTint: { control: { type: 'range', min: 0, max: 0.2, step: 0.001 } },
			waveContrast: { control: { type: 'range', min: 0.1, max: 3, step: 0.05 } },
			highlight: { control: { type: 'range', min: 0, max: 50, step: 1 } }
		},
		args: { ...DEFAULT_SETTINGS }
	});
</script>

<Story name="Default" args={{ class: 'block h-[70vh] w-full' }} />

<Story
	name="Original study"
	args={{
		class: 'block h-[70vh] w-full',
		damping: 0.993,
		dropStrength: 1.25,
		dropRadius: 0.022,
		dropIntervalMin: 2.2,
		dropIntervalMax: 4,
		pointerStrength: 0.55,
		baseTint: 0.028,
		depthTint: 0.025,
		waveContrast: 1,
		highlight: 18
	}}
/>

<Story
	name="Ralph study 02"
	args={{
		class: 'block h-[70vh] w-full',
		damping: 0.99,
		dropStrength: 0.35,
		dropRadius: 0.01,
		dropIntervalMin: 1,
		dropIntervalMax: 7,
		pointerStrength: 0.05,
		baseTint: 0.04,
		depthTint: 0.15,
		waveContrast: 0.75,
		highlight: 30
	}}
/>

<Story
	name="Ralph study 01"
	args={{
		class: 'block h-[70vh] w-full',
		damping: 0.983,
		dropStrength: 0.3,
		dropRadius: 0.009,
		dropIntervalMin: 3,
		dropIntervalMax: 8,
		pointerStrength: 0.05,
		baseTint: 0.035,
		depthTint: 0.12,
		waveContrast: 1,
		highlight: 20
	}}
/>
