<script lang="ts">
	import Container from '$lib/components/layout/Container.svelte';
	import SmallShowbox from '$lib/components/header/SmallShowbox.svelte';
	import Intro from '$lib/components/Intro.svelte';
	import FeatureRow from '$lib/components/FeatureRow.svelte';
	import SecondaryCta from '$lib/components/SecondaryCta.svelte';
	import BookDemoCta from '$lib/components/BookDemoCta.svelte';
</script>

<SmallShowbox headline="Own your marketing leads" />

<Container class="mt-24">
	<Intro ctas={[{ label: 'Book a demo', href: '#', variant: 'primary' }]}>
		With <strong class="brand-name">blueSignals</strong>, the leads you generate are yours to keep.
		Export them, feed them into your marketing mix, and nurture them in the tools you already use.
	</Intro>
</Container>

<Container class="mt-32">
	<FeatureRow scrollReveal bubbleVariant="light" headline="Leads you can put to work">
		Put qualified marketing leads to work across your marketing mix. Add them to nurture campaigns,
		enrich their profiles, build audiences, personalize content, or move them into another process
		when the time is right.
	</FeatureRow>
</Container>

<Container class="mt-64">
	<FeatureRow
		scrollReveal
		side="left"
		bubbleVariant="dark"
		headline="Your leads, not rented access"
	>
		Connections and followers remain inside professional networks, where access depends on the
		platform. The leads you qualify with <strong class="brand-name">blueSignals</strong> are yours.
		Export them, organize them in your own systems, and continue building the relationship beyond
		the original interaction.
	</FeatureRow>
</Container>

<Container class="mt-64">
	<FeatureRow scrollReveal bubbleVariant="light" headline="Lead data that stays current">
		People and companies change. <strong class="brand-name">blueSignals</strong> keeps lead
		information up to date and lets you re-sync it with your CRM. Refresh existing records instead
		of creating disconnected copies, so your team can keep working with relevant data as every lead
		develops.
	</FeatureRow>
</Container>

<Container class="mt-48">
	<SecondaryCta
		nextLabel="Next: Learn how blueSignals supports teams at scale"
		href="/built-for-teams"
	/>
</Container>

<div class="mt-32">
	<BookDemoCta
		headline="See the benefits"
		copy="See how blueSignals turns engagement into marketing leads you own."
		href="#"
	/>
</div>
