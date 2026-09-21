<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Header from './Header.svelte';
	import LogoTagline from './LogoTagline.svelte';
	import Container from '../layout/Container.svelte';

	const { Story } = defineMeta({
		title: 'Header/Header',
		component: Header
	});
</script>

<Story name="Empty" />

<Story name="With logo + tagline">
	{#snippet template(args)}
		<Header {...args}>
			<Container>
				<LogoTagline />
			</Container>
		</Header>
	{/snippet}
</Story>
