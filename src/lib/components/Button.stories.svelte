<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Button from './Button.svelte';

	const { Story } = defineMeta({
		title: 'Components/Button',
		component: Button,
		argTypes: {
			variant: { control: { type: 'select' }, options: ['primary', 'secondary'] },
			href: { control: 'text' }
		},
		args: { variant: 'primary', href: '#' }
	});
</script>

<Story name="Primary">
	{#snippet template(args)}
		<Button {...args}>Book a demo</Button>
	{/snippet}
</Story>

<Story name="Secondary" args={{ variant: 'secondary' } as any}>
	{#snippet template(args)}
		<Button {...args}>Book a demo</Button>
	{/snippet}
</Story>

<Story name="CTA pair">
	{#snippet template()}
		<div class="flex items-center gap-8">
			<Button variant="primary" href="#">Book a demo</Button>
			<Button variant="secondary" href="#">Book a demo</Button>
		</div>
	{/snippet}
</Story>
