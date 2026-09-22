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
				{ label: 'Book a demo', href: '#', variant: 'secondary' }
			]
		}
	});
</script>

<Story name="With two CTAs">
	{#snippet template(args)}
		<Container>
			<Intro {...args}>
				Professional networks are an ocean of people. Finding qualified leads in that ocean
				can seem impossible.<br /><br /><strong class="brand-name">blue signals</strong> is a
				tool, helping you find to people who engage with your content, qualify them, and
				deliver leads you can act on.
			</Intro>
		</Container>
	{/snippet}
</Story>

<Story name="Single CTA" args={{ ctas: [{ label: 'Book a demo', href: '#', variant: 'primary' }] } as any}>
	{#snippet template(args)}
		<Container>
			<Intro {...args}>
				Our lead generation cycle puts quality over quantity.
				<strong class="brand-name">blue signals</strong> delivers qualified leads to sales
				while constantly improving the process and adapting it to your customers.
			</Intro>
		</Container>
	{/snippet}
</Story>

<Story name="Copy only" args={{ ctas: [] } as any}>
	{#snippet template(args)}
		<Container>
			<Intro {...args}>
				We want you to succeed. That’s why our pricing is tied to your results: you pay for
				leads, not for seats.
			</Intro>
		</Container>
	{/snippet}
</Story>
