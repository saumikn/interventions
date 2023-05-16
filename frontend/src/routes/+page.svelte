<script lang="ts">
	import { onMount } from 'svelte';
	import Interventions from '$lib/components/Interventions.svelte';
	import { Auth } from '$lib/utils/auth';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import AuthPage from '$lib/components/AuthPage.svelte';
	import Consent from '$lib/components/Consent.svelte';
	import Demo from '$lib/components/Demo.svelte';
	import Survey from '$lib/components/Survey.svelte';

	let consent = false;
	let watchedDemo = true;
	let finished = false;

	let auth: Auth;
	onMount(async () => {
		initAuth();
	});

	async function initAuth() {
		auth = new Auth();
		await auth.init();
		auth = auth;
		const URLSearchParams = $page.url.searchParams;
		if (URLSearchParams.has('code')) {
			URLSearchParams.delete('code');
		}
		if (URLSearchParams.has('state')) {
			URLSearchParams.delete('state');
		}
		console.log(auth.me?.perfs);
		goto(`?${$page.url.searchParams.toString()}`);
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	{#if auth && auth.me}
		{#if finished}
			<Survey />
		{:else if watchedDemo}
			<Interventions bind:finished {auth} />
		{:else}
			<Demo bind:watchedDemo />
		{/if}
	{:else if consent}
		<AuthPage {auth} />
	{:else}
		<Consent bind:consent />
	{/if}
</section>

<!-- <Survey /> -->

<style>
	/* section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
  }

  h1 {
    width: 100%;
  }

  .welcome {
    display: block;
    position: relative;
    width: 100%;
    height: 0;
    padding: 0 0 calc(100% * 495 / 2048) 0;
  }

  .welcome img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    display: block;
  } */

	:global(body) {
		margin: 5% auto;
		background: #f2f2f2;
		color: #444444;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
		font-size: 16px;
		line-height: 1.8;
		text-shadow: 0 1px 0 #ffffff;
		max-width: 70%;
	}
	:global(a) {
		border-bottom: 1px solid #444444;
		color: #444444;
		text-decoration: none;
	}
	/* :global(a:hover) {
		border-bottom: 0;
	} */
</style>
