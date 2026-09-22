<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import FeatureRow from './FeatureRow.svelte';
	import Container from './layout/Container.svelte';

	const { Story } = defineMeta({
		title: 'Content/FeatureRow',
		component: FeatureRow,
		argTypes: {
			side: { control: { type: 'select' }, options: ['left', 'right'] },
			bubbleVariant: { control: { type: 'select' }, options: ['dark', 'light'] },
			headline: { control: 'text' },
			ctas: { control: 'object' }
		},
		args: {
			side: 'right',
			bubbleVariant: 'dark',
			headline: 'Built for agencies',
			ctas: [{ label: 'Discover agency tools', href: '#', variant: 'primary' }]
		}
	});
</script>

<Story name="Bubble right (dark)">
	{#snippet template(args)}
		<Container>
			<FeatureRow {...args}>
				<strong class="brand-name">blue signals</strong> was built for agencies, with
				white-label capabilities, multiple workspaces, quality control tools, everything
				managed in one place.
			</FeatureRow>
		</Container>
	{/snippet}
</Story>

<Story
	name="Bubble left (light)"
	args={{ side: 'left', bubbleVariant: 'light', headline: 'Only pay for results', ctas: [{ label: 'See pricing', href: '#', variant: 'primary' }] } as any}
>
	{#snippet template(args)}
		<Container>
			<FeatureRow {...args}>
				We want you to succeed. That’s why our pricing is tied to your results: you pay for
				leads, not for seats.
			</FeatureRow>
		</Container>
	{/snippet}
</Story>
