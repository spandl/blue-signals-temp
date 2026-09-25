<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Intro from './Intro.svelte';
	import Container from './layout/Container.svelte';

	const { Story } = defineMeta({
		title: 'Content/Intro',
		component: Intro,
		argTypes: {
			ctas: { control: 'object' }
		},
		args: {
			ctas: [
				{ label: 'Book a demo', href: '#', variant: 'primary' },
				{ label: 'Pricing', href: '#', variant: 'secondary' }
			]
		}
	});
</script>

<Story name="With two CTAs">
	{#snippet template(args)}
		<Container>
			<Intro {...args}>
				Professional networks are an ocean of people. Finding the right people in that ocean
				can seem impossible.<br /><br /><strong class="brand-name">blueSignals</strong>
				identifies the people who engage with your content, qualifies them, and delivers
				top-of-funnel leads you own and can act on.
			</Intro>
		</Container>
	{/snippet}
</Story>

<Story name="Single CTA" args={{ ctas: [{ label: 'Book a demo', href: '#', variant: 'primary' }] } as any}>
	{#snippet template(args)}
		<Container>
			<Intro {...args}>
				Professional networks are an ocean of people. Finding the right people in that ocean
				can seem impossible.<br /><br /><strong class="brand-name">blueSignals</strong>
				identifies the people who engage with your content, qualifies them, and delivers
				top-of-funnel leads you own and can act on.
			</Intro>
		</Container>
	{/snippet}
</Story>

<Story name="Copy only" args={{ ctas: [] } as any}>
	{#snippet template(args)}
		<Container>
			<Intro {...args}>
				We want you to succeed. That's why our pricing is tied to your results: you pay for
				leads, not for seats.
			</Intro>
		</Container>
	{/snippet}
</Story>
