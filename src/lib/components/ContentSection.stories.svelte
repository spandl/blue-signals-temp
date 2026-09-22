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
			headline: 'Generate leads in five steps',
			ctas: [{ label: 'Lead generation cycle', href: '#', variant: 'primary' }]
		}
	});
</script>

<Story name="Lead cycle">
	{#snippet template(args)}
		<Container>
			<ContentSection {...args}>
				{#snippet visual()}
					<img src={metaball} alt="Lead generation cycle" class="w-full max-w-[800px]" />
				{/snippet}
				Our lead generation cycle puts quality over quantity.
				<strong class="brand-name">blue signals</strong> delivers qualified leads to sales
				while constantly improving the process and adapting it to your customers.
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
						class="flex aspect-[16/9] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-cyan/20 to-teal/30 text-teal"
					>
						Media slot — image, video, or canvas
					</div>
				{/snippet}
				Section copy goes here — <strong class="brand-name">blue signals</strong> style.
			</ContentSection>
		</Container>
	{/snippet}
</Story>
