<script lang="ts">
	import Container from '$lib/components/layout/Container.svelte';
	import SmallShowbox from '$lib/components/header/SmallShowbox.svelte';
	import Intro from '$lib/components/Intro.svelte';
	import FeatureRow from '$lib/components/FeatureRow.svelte';
	import SecondaryCta from '$lib/components/SecondaryCta.svelte';
	import BookDemoCta from '$lib/components/BookDemoCta.svelte';
</script>

<SmallShowbox headline="A team behind you" />

<Container class="mt-24">
	<Intro ctas={[{ label: 'Book a demo', href: '#', variant: 'primary' }]}>
		<strong class="brand-name">blueSignals</strong> ships with our expertise. We help you define
		your approach, prepare your team, configure your first workspace, and improve the process after
		launch. You get more than a tool. You get experienced people to guide the setup, answer questions,
		and help your team build a process that works.
	</Intro>
</Container>

<Container class="mt-32">
	<FeatureRow scrollReveal bubbleVariant="light" headline="We start by listening">
		Every organization works differently. In our first session, we learn about your team, audiences,
		goals, and existing tools. Together, we turn that context into a clear implementation plan.
	</FeatureRow>
</Container>

<Container class="mt-64">
	<FeatureRow
		scrollReveal
		side="left"
		bubbleVariant="dark"
		headline="Learn the product and the process"
	>
		We show your team how to use <strong class="brand-name">blueSignals</strong> and share the
		practices behind it. You will learn how the lead generation cycle works, how to apply it to your
		setup, and what to prepare for your first workspace.
	</FeatureRow>
</Container>

<Container class="mt-64">
	<FeatureRow scrollReveal bubbleVariant="light" headline="Build your first workspace together">
		We configure your first workspace with you — from target audiences and tracked content to
		qualification workflows and outreach campaigns. By the end of the session, your team has a
		working setup and a clear process it can repeat across further workspaces.
	</FeatureRow>
</Container>

<Container class="mt-64">
	<FeatureRow
		scrollReveal
		side="left"
		bubbleVariant="dark"
		headline="Support beyond the first launch"
	>
		We stay close while your team puts the process into practice. During the first few weeks, we
		monitor progress with you and remain available when questions arise. After four to six weeks, we
		review the results together, refine the setup, and agree on the next steps.
	</FeatureRow>
</Container>

<Container class="mt-48">
	<SecondaryCta nextLabel="Next: Explore pricing" href="#" />
</Container>

<div class="mt-32">
	<BookDemoCta
		headline="Expertise when you need it"
		copy="Tell us about your goals and discover how blueSignals can support your team."
		href="#"
	/>
</div>
