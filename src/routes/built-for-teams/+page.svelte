<script lang="ts">
	import Container from '$lib/components/layout/Container.svelte';
	import SmallShowbox from '$lib/components/header/SmallShowbox.svelte';
	import Intro from '$lib/components/Intro.svelte';
	import FeatureRow from '$lib/components/FeatureRow.svelte';
	import SecondaryCta from '$lib/components/SecondaryCta.svelte';
	import BookDemoCta from '$lib/components/BookDemoCta.svelte';
</script>

<SmallShowbox headline="Built for teams at scale" />

<Container class="mt-24">
	<Intro ctas={[{ label: 'Book a demo', href: '#', variant: 'primary' }]}>
		Manage complex lead generation from one place. Run clients, brands, markets, or business units
		in separate workspaces while managing the entire operation from one account. Apply your
		branding, control access, and see where your team needs to act.
	</Intro>
</Container>

<Container class="mt-32">
	<FeatureRow scrollReveal bubbleVariant="light" headline="One place for every team">
		Give each client, brand, market, or business unit its own workspace while managing them all
		with one login. A comprehensive overview shows you which workspaces need attention.
	</FeatureRow>
</Container>

<Container class="mt-64">
	<FeatureRow
		scrollReveal
		side="left"
		bubbleVariant="dark"
		headline="Your brand, front and center"
	>
		Make <strong class="brand-name">blueSignals</strong> part of the experience you deliver. Add
		your logo and domain so clients and partners see your brand, not ours.
	</FeatureRow>
</Container>

<Container class="mt-64">
	<FeatureRow scrollReveal bubbleVariant="light" headline="The right access for every role">
		Decide who can manage each workspace, qualify leads, and respond to messages. Give colleagues,
		clients, and partners access to exactly what they need — and nothing they don't.
	</FeatureRow>
</Container>

<Container class="mt-64">
	<FeatureRow
		scrollReveal
		side="left"
		bubbleVariant="dark"
		headline="Quality and process control at scale"
	>
		Set targets for tracked content, leads, and key process steps. See when a workspace falls
		behind, maintain consistent quality, and help your team focus where it can make the greatest
		difference.
	</FeatureRow>
</Container>

<Container class="mt-48">
	<SecondaryCta nextLabel="Next: See how the lead generation cycle works" href="/lead-generation" />
</Container>

<div class="mt-32">
	<BookDemoCta
		headline="Scale your network strategy"
		copy="Bring your workspaces, teams, and processes together without giving up control. See how blueSignals can support your setup."
		href="#"
	/>
</div>
