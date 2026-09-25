<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Header from '$lib/components/header/Header.svelte';
	import LogoTagline from '$lib/components/header/LogoTagline.svelte';
	import Container from '$lib/components/layout/Container.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import Intro from '$lib/components/Intro.svelte';
	import ContentSection from '$lib/components/ContentSection.svelte';
	import FeatureRow from '$lib/components/FeatureRow.svelte';
	import BookDemoCta from '$lib/components/BookDemoCta.svelte';
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
					Professional networks are an ocean of people. Finding the right people in that
					ocean can seem impossible.<br /><br /><strong class="brand-name">blueSignals</strong>
					identifies the people who engage with your content, qualifies them, and delivers
					top-of-funnel leads you own and can act on.
				</Intro>
			</Container>
			<Container>
				<ContentSection
					scrollReveal
					id="lead-generation"
					headline="From blue signals to warm leads"
					ctas={[{ label: 'Lead generation cycle', href: '#', variant: 'primary' }]}
				>
					{#snippet visual()}
						<img
							src={metaball}
							alt="Lead generation cycle"
							class="w-full max-w-200"
						/>
					{/snippet}
					Our lead generation cycle focuses on quality over quantity. With
					<strong class="brand-name">blueSignals</strong>, you can automate a sophisticated
					qualification process. Find the prospects ready to engage with your brand and keep
					improving with every cycle.
				</ContentSection>
			</Container>
			<Container class="mt-32">
				<FeatureRow
					scrollReveal
					bubbleVariant="light"
					id="marketing-leads"
					headline="Own your marketing leads"
					ctas={[{ label: 'See the benefits', href: '#', variant: 'primary' }]}
				>
					With <strong class="brand-name">blueSignals</strong>, the leads you generate are yours
					to keep. Export them, feed them into your marketing mix, and nurture them in the tools
					you already use.
				</FeatureRow>
			</Container>
			<Container class="mt-64">
				<FeatureRow
					scrollReveal
					side="left"
					bubbleVariant="dark"
					id="agency-tools"
					headline="Built for teams at scale"
					ctas={[{ label: 'Explore team features', href: '#', variant: 'primary' }]}
				>
					<strong class="brand-name">blueSignals</strong> gives agencies and enterprise teams
					white-label capabilities, multiple workspaces, quality control tools, and
					granular access — everything managed in one place.
				</FeatureRow>
			</Container>
			<Container class="mt-64">
				<FeatureRow
					scrollReveal
					bubbleVariant="light"
					id="pricing"
					headline="Only pay for results"
					ctas={[{ label: 'See pricing', href: '#', variant: 'primary' }]}
				>
					We want you to succeed. That's why our pricing is tied to your results: you pay
					for leads, not for seats.
				</FeatureRow>
			</Container>
			<Container class="mt-64">
				<FeatureRow
					scrollReveal
					side="left"
					bubbleVariant="dark"
					id="onboarding"
					headline="A team behind you."
					ctas={[{ label: 'Meet the team', href: '#', variant: 'primary' }]}
				>
					We help you set up your first workspace and configure workflows and outreach
					campaigns.<br /><br />Get a head start with a proven process and a team there to
					support you.
				</FeatureRow>
			</Container>
			<div class="mt-32">
				<BookDemoCta href="#" />
			</div>
		</main>
		<Footer />
	{/snippet}
</Story>
