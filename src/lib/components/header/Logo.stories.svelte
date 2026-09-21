<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Logo from './Logo.svelte';
	import LogoTagline from './LogoTagline.svelte';

	const { Story } = defineMeta({
		title: 'Components/Logo',
		component: Logo
	});
</script>

<Story name="Logo" args={{ class: 'h-16' }} />

<Story name="Logo + tagline" asChild>
	<LogoTagline />
</Story>
