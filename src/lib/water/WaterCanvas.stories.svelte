<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import WaterCanvas from './WaterCanvas.svelte';
	import WakeCanvas from '../wake/WakeCanvas.svelte';
	import { DEFAULT_SETTINGS } from './WaterSimulation';
	import { DEFAULT_WAKE_SETTINGS } from '../wake/WakeSimulation';

	const { Story } = defineMeta({
		title: 'Header/WaterCanvas',
		component: WaterCanvas,
		argTypes: {
			damping: { control: { type: 'range', min: 0.96, max: 0.999, step: 0.001 } },
			dropStrength: { control: { type: 'range', min: 0.1, max: 3, step: 0.05 } },
			dropRadius: { control: { type: 'range', min: 0.006, max: 0.06, step: 0.001 } },
			dropIntervalMin: { control: { type: 'range', min: 0.5, max: 15, step: 0.1 } },
			dropIntervalMax: { control: { type: 'range', min: 0.5, max: 15, step: 0.1 } },
			pointerMode: { control: { type: 'select' }, options: ['drops', 'movement'] },
			pointerStrength: { control: { type: 'range', min: 0.05, max: 1.5, step: 0.05 } },
			baseTint: { control: { type: 'range', min: 0.005, max: 0.12, step: 0.001 } },
			depthTint: { control: { type: 'range', min: 0, max: 0.2, step: 0.001 } },
			waveContrast: { control: { type: 'range', min: 0.1, max: 3, step: 0.05 } },
			highlight: { control: { type: 'range', min: 0, max: 50, step: 1 } },
			autoInput: { control: 'boolean' },
			sourceMargin: { control: { type: 'range', min: 0, max: 1, step: 0.05 } }
		} as any,
		args: {
			...DEFAULT_SETTINGS,
			autoInput: DEFAULT_WAKE_SETTINGS.autoInput,
			sourceMargin: DEFAULT_WAKE_SETTINGS.sourceMargin
		} as any
	});
</script>

<Story name="Automatic wake" args={{ autoInput: true } as any}>
	{#snippet template(args)}
		<div class="relative h-[70vh] w-full overflow-hidden">
			<WaterCanvas {...args} class="absolute inset-0 h-full w-full" />
			<WakeCanvas
				autoInput={(args as any).autoInput}
				sourceMargin={(args as any).sourceMargin}
				class="absolute inset-0 h-full w-full"
			/>
		</div>
	{/snippet}
</Story>

<Story name="Pointer trails only" args={{ autoInput: false } as any}>
	{#snippet template(args)}
		<div class="relative h-[70vh] w-full overflow-hidden">
			<WaterCanvas {...args} class="absolute inset-0 h-full w-full" />
			<WakeCanvas
				autoInput={(args as any).autoInput}
				sourceMargin={(args as any).sourceMargin}
				class="absolute inset-0 h-full w-full"
			/>
		</div>
	{/snippet}
</Story>
