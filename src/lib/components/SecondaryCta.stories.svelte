<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import SecondaryCta from './SecondaryCta.svelte';

	const { Story } = defineMeta({
		title: 'Components/SecondaryCta',
		component: SecondaryCta,
		argTypes: {
			nextLabel: { control: 'text' },
			href: { control: 'text' }
		},
		args: {
			nextLabel: 'Discover the lead generation cycle',
			href: '/'
		}
	});
</script>

<Story name="Default" />
