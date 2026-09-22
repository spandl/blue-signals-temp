<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'primary',
		href,
		children,
		class: className = ''
	}: {
		variant?: 'primary' | 'secondary' | 'inverse';
		href?: string;
		children?: Snippet;
		class?: string;
	} = $props();

	const palette = $derived(
		variant === 'primary'
			? 'bg-cyan text-offwhite'
			: variant === 'secondary'
				? 'bg-secondary text-teal-deep'
				: 'bg-offwhite text-teal-deep'
	);
</script>

{#snippet arrow()}
	<svg class="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<path
			d="M11.2287 6.86506C11.6547 6.4391 12.3453 6.43905 12.7713 6.86506L17.1349 11.2287C17.1871 11.2808 17.2337 11.3384 17.2745 11.4002C17.3015 11.4411 17.325 11.4836 17.3459 11.527C17.415 11.6702 17.4545 11.8304 17.4545 12C17.4545 12.0615 17.4473 12.1214 17.4375 12.18C17.4297 12.2267 17.4205 12.2731 17.4066 12.3185C17.3904 12.3716 17.3696 12.4226 17.3459 12.4719C17.3385 12.4874 17.3306 12.5026 17.3224 12.5178C17.292 12.574 17.2565 12.6267 17.217 12.6765C17.1912 12.7089 17.1649 12.7413 17.1349 12.7713L12.7713 17.1349C12.3453 17.561 11.6547 17.561 11.2287 17.1349C10.8027 16.7089 10.8027 16.0184 11.2287 15.5923L13.7301 13.0909H7.63636C7.03387 13.0909 6.54545 12.6025 6.54545 12C6.54545 11.3975 7.03387 10.9091 7.63636 10.9091H13.7301L11.2287 8.40767C10.8027 7.98164 10.8027 7.29108 11.2287 6.86506Z"
			fill="currentColor"
		/>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0ZM12 2.18182C6.57757 2.18182 2.18182 6.57757 2.18182 12C2.18182 17.4224 6.57757 21.8182 12 21.8182C17.4224 21.8182 21.8182 17.4224 21.8182 12C21.8182 6.57757 17.4224 2.18182 12 2.18182Z"
			fill="currentColor"
		/>
	</svg>
{/snippet}

{#if href}
	<a
		{href}
		class="text-cta inline-flex h-14 items-center gap-4 rounded-xl px-6 {palette} transition-[translate,box-shadow] duration-[400ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] {className}"
	>
		{@render arrow()}
		{#if children}{@render children()}{/if}
	</a>
{:else}
	<button
		class="text-cta inline-flex h-14 cursor-pointer items-center gap-4 rounded-xl px-6 {palette} transition-[translate,box-shadow] duration-[400ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] {className}"
	>
		{@render arrow()}
		{#if children}{@render children()}{/if}
	</button>
{/if}
