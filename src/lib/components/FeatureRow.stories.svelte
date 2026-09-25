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
			ctas: { control: 'object' },
			scrollReveal: { control: 'boolean' }
		},
		args: {
			side: 'right',
			bubbleVariant: 'dark',
			headline: 'Own your marketing leads',
			ctas: [{ label: 'See the benefits', href: '#', variant: 'primary' }]
		}
	});
</script>

<Story name="Bubble right (dark)">
	{#snippet template(args)}
		<Container>
			<FeatureRow {...args}>
				With <strong class="brand-name">blueSignals</strong>, the leads you generate are yours to
				keep. Export them, feed them into your marketing mix, and nurture them in the tools you
				already use.
			</FeatureRow>
		</Container>
	{/snippet}
</Story>

<Story
	name="Bubble left (light)"
	args={{ side: 'left', bubbleVariant: 'light', headline: 'Built for teams at scale', ctas: [{ label: 'Explore team features', href: '#', variant: 'primary' }] } as any}
>
	{#snippet template(args)}
		<Container>
			<FeatureRow {...args}>
				<strong class="brand-name">blueSignals</strong> gives agencies and enterprise teams
				white-label capabilities, multiple workspaces, quality control tools, and granular
				access — everything managed in one place.
			</FeatureRow>
		</Container>
	{/snippet}
</Story>
