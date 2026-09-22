<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import BookDemoCta from './BookDemoCta.svelte';

	const { Story } = defineMeta({
		title: 'Content/BookDemoCta',
		component: BookDemoCta,
		argTypes: {
			href: { control: 'text' },
			headline: { control: 'text' },
			copy: { control: 'text' }
		},
		args: { href: '#' }
	});
</script>

<Story name="Default" />
