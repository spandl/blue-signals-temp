<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Header from '$lib/components/header/Header.svelte';
	import LogoTagline from '$lib/components/header/LogoTagline.svelte';
	import Container from '$lib/components/layout/Container.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Intro from '$lib/components/Intro.svelte';
	import ContentSection from '$lib/components/ContentSection.svelte';
	import FeatureRow from '$lib/components/FeatureRow.svelte';
	import metaball from '$lib/assets/metaball-ring.svg';

	const { Story } = defineMeta({
		title: 'Pages/Home'
	});
</script>

<Story name="Home">
	{#snippet template()}
		<Header>
			<Container>
				<LogoTagline blurCircles />
			</Container>
		</Header>
		<main>
			<Container class="mt-48">
				<Intro
					ctas={[
						{ label: 'Book a demo', href: '#', variant: 'primary' },
						{ label: 'Pricing', href: '#', variant: 'secondary' }
					]}
				>
					Professional networks are an ocean of people. Finding qualified leads in that ocean
					can seem impossible.<br /><br /><strong class="brand-name">blue signals</strong> is
					a tool, helping you find to people who engage with your content, qualify them, and
					deliver leads you can act on.
				</Intro>
			</Container>
			<Container>
				<ContentSection
					scrollReveal
					headline="Generate leads in five steps"
					ctas={[{ label: 'Lead generation cycle', href: '#', variant: 'primary' }]}
				>
					{#snippet visual()}
						<img
							src={metaball}
							alt="Lead generation cycle"
							class="w-full max-w-[800px]"
						/>
					{/snippet}
					Our lead generation cycle puts quality over quantity.
					<strong class="brand-name">blue signals</strong> delivers qualified leads to sales
					while constantly improving the process and adapting it to your customers.
				</ContentSection>
			</Container>
			<Container class="mt-32">
				<FeatureRow
					scrollReveal
					headline="Built for agencies"
					ctas={[{ label: 'Discover agency tools', href: '#', variant: 'primary' }]}
				>
					<strong class="brand-name">blue signals</strong> was built for agencies, with
					white-label capabilities, multiple workspaces, quality control tools, everything
					managed in one place.
				</FeatureRow>
			</Container>
			<Container class="mt-64">
				<FeatureRow
					scrollReveal
					side="left"
					bubbleVariant="light"
					headline="Only pay for results"
					ctas={[{ label: 'See pricing', href: '#', variant: 'primary' }]}
				>
					We want you to succeed. That’s why our pricing is tied to your results: you pay
					for leads, not for seats.
				</FeatureRow>
			</Container>
			<Container class="mt-64">
				<FeatureRow
					scrollReveal
					headline="A team behind you."
					ctas={[{ label: 'Meet the team', href: '#', variant: 'primary' }]}
				>
					We help you set up your first workspace and configure workflows and outreach
					campaigns.<br /><br />Get a head start with a proven process and a team there to
					support you.
				</FeatureRow>
			</Container>
			<div class="h-[60vh]" aria-hidden="true"></div>
		</main>
		<Footer />
	{/snippet}
</Story>
