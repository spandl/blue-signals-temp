<script lang="ts">
	import Container from '$lib/components/layout/Container.svelte';
	import SmallShowbox from '$lib/components/header/SmallShowbox.svelte';
	import Intro from '$lib/components/Intro.svelte';
	import FeatureRow from '$lib/components/FeatureRow.svelte';
	import SecondaryCta from '$lib/components/SecondaryCta.svelte';
	import BookDemoCta from '$lib/components/BookDemoCta.svelte';
</script>

<SmallShowbox headline="Lead generation cycle" />

<Container class="mt-24">
	<Intro ctas={[{ label: 'Book a demo', href: '#', variant: 'primary' }]}>
		<strong class="brand-name">blueSignals</strong> finds people who engage with your content,
		helps you understand their interest, and turns those signals into marketing leads you own and can
		nurture.
	</Intro>
</Container>

<Container class="mt-32">
	<FeatureRow
		scrollReveal
		bubbleVariant="light"
		headline="1. Get the foundation right"
		ctas={[{ label: 'Learn more about onboarding', href: '#', variant: 'primary' }]}
	>
		Choose the voices and keywords relevant to your industry.
		<strong class="brand-name">blueSignals</strong> uses them to suggest content you may want to
		track. Define the audiences you want to reach, build your qualification funnel, and set up
		workflows for classifying leads, sending connection requests, and running outreach campaigns. This
		may sound complex, so we cover it during onboarding and help you set it up properly.
	</FeatureRow>
</Container>

<Container class="mt-64">
	<FeatureRow
		scrollReveal
		side="left"
		bubbleVariant="dark"
		headline="2. Track relevant content"
	>
		Select the posts you want to track, whether they come from your own team or influential voices in
		your industry. When people engage with this content,
		<strong class="brand-name">blueSignals</strong> adds them to the first stage of your lead funnel.
	</FeatureRow>
</Container>

<Container class="mt-64">
	<FeatureRow
		scrollReveal
		bubbleVariant="light"
		headline="3. Qualify interest"
		ctas={[{ label: 'Learn more about the lightweight CRM', href: '#', variant: 'primary' }]}
	>
		Use workflows and AI tools to understand who is showing meaningful interest and move people
		through your lead funnel. Add context and notes, classify contacts, or move leads manually at any
		time.
	</FeatureRow>
</Container>

<Container class="mt-64">
	<FeatureRow
		scrollReveal
		side="left"
		bubbleVariant="dark"
		headline="4. Start a conversation"
		ctas={[{ label: 'Learn more about the teambox', href: '#', variant: 'primary' }]}
	>
		Use workflows to start conversations with your leads. The teambox keeps replies and follow-ups in
		one place, giving your team more context as you learn about each lead and their interests.
	</FeatureRow>
</Container>

<Container class="mt-64">
	<FeatureRow
		scrollReveal
		bubbleVariant="light"
		headline="5. Make the leads yours"
		ctas={[{ label: 'Learn more about data export', href: '#', variant: 'primary' }]}
	>
		Bring your marketing leads into the tools and processes you already use. Send them to HubSpot,
		Clay, or Slack; download a spreadsheet; or connect your own systems through the API or webhooks.
	</FeatureRow>
</Container>

<Container class="mt-64">
	<FeatureRow
		scrollReveal
		side="left"
		bubbleVariant="dark"
		headline="6. Learn from every cycle"
		ctas={[{ label: 'Review all product features', href: '#', variant: 'primary' }]}
	>
		See which content, topics, and sources generated the strongest interest. Use those insights to
		refine your content strategy, improve your qualification process, and decide what to track next.
		Learn, improve, and start again.
	</FeatureRow>
</Container>

<Container class="mt-48">
	<SecondaryCta
		nextLabel="Next: Get expert support from day one"
		href="/team"
	/>
</Container>

<div class="mt-32">
	<BookDemoCta
		headline="Turn engagement into marketing opportunities"
		copy="Find out how blueSignals can help you generate leads from your professional network."
		href="#"
	/>
</div>
