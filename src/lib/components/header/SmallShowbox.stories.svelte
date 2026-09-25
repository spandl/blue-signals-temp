<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import SmallShowbox from './SmallShowbox.svelte';

	const { Story } = defineMeta({
		title: 'Header/SmallShowbox',
		component: SmallShowbox,
		argTypes: {
			headline: { control: 'text' }
		},
		args: {
			headline: 'Built for teams at scale'
		}
	});
</script>

<Story name="Default" />
