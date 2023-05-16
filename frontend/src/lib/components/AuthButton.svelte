<script lang="ts">
	import type { Auth } from '$lib/utils/auth';
	import { onMount } from 'svelte';
	export let auth: Auth;

	async function login() {
		await auth.login();
	}

	async function logout() {
		await auth.logout();
		auth = auth;
	}

	onMount(async () => {});
</script>

{#if auth && auth.me}
	<button on:click={logout}> Log out {auth.me.username} </button>
{:else}
	<button on:click={login}> Provide your Lichess username </button>
{/if}

<style>
</style>
