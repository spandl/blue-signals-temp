<script lang="ts">
	import Container from './Container.svelte';

	const primaryLinks = [
		{ label: 'Home', href: '/' },
		{ label: 'Lead generation', href: '/lead-generation' },
		{ label: 'Own your leads', href: '/own-your-leads' },
		{ label: 'Pricing', href: '/#pricing' },
		{ label: 'Built for teams', href: '/built-for-teams' },
		{ label: 'Team', href: '/team' }
	];
	const legalLinks = [
		{ label: 'Privacy Policy', href: '#' },
		{ label: 'Terms of Service', href: '#' },
		{ label: 'GDPR/CCPA Requests', href: '#' }
	];
</script>

<footer class="w-full bg-teal-deep text-white">
	<Container class="pt-20 pb-8 md:pt-22">
		<nav class="flex flex-col gap-6 md:flex-row md:items-center md:gap-20" aria-label="Footer navigation">
			{#each primaryLinks as link (link.label)}
				<a class="text-2xl font-medium" href={link.href}>{link.label}</a>
			{/each}
		</nav>
		<div class="mt-14 border-t border-cyan pt-8 md:mt-12 md:flex md:items-center md:justify-between">
			<p class="text-lg font-light">© 2026 blueSignals – All rights reserved.</p>
			<nav class="mt-6 flex flex-col gap-4 md:mt-0 md:flex-row md:items-center md:gap-12" aria-label="Legal navigation">
				{#each legalLinks as link (link.label)}
					<a class="text-base font-light" href={link.href}>{link.label}</a>
				{/each}
			</nav>
		</div>
	</Container>
</footer>
