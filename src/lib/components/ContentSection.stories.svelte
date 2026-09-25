<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ContentSection from './ContentSection.svelte';
	import Container from './layout/Container.svelte';
	import metaball from '$lib/assets/metaball-ring.svg';

	const { Story } = defineMeta({
		title: 'Content/ContentSection',
		component: ContentSection,
		argTypes: {
			headline: { control: 'text' },
			ctas: { control: 'object' },
			scrollReveal: { control: 'boolean' }
		},
		args: {
			headline: 'From blue signals to warm leads',
			ctas: [{ label: 'Lead generation cycle', href: '#', variant: 'primary' }]
		}
	});
</script>

<Story name="Lead cycle">
	{#snippet template(args)}
		<Container>
			<ContentSection {...args}>
				{#snippet visual()}
					<img src={metaball} alt="Lead generation cycle" class="w-full max-w-200" />
				{/snippet}
				Our lead generation cycle focuses on quality over quantity. With
				<strong class="brand-name">blueSignals</strong>, you can automate a sophisticated
				qualification process. Find the prospects ready to engage with your brand and keep
				improving with every cycle.
			</ContentSection>
		</Container>
	{/snippet}
</Story>

<Story name="Two CTAs" args={{ ctas: [{ label: 'Book a demo', href: '#', variant: 'primary' }, { label: 'Learn more', href: '#', variant: 'secondary' }] } as any}>
	{#snippet template(args)}
		<Container>
			<ContentSection {...args}>
				{#snippet visual()}
					<div
						class="flex aspect-video w-full items-center justify-center rounded-2xl bg-linear-to-br from-cyan/20 to-teal/30 text-teal"
					>
						Media slot — image, video, or canvas
					</div>
				{/snippet}
				Section copy goes here — <strong class="brand-name">blueSignals</strong> style.
			</ContentSection>
		</Container>
	{/snippet}
</Story>
