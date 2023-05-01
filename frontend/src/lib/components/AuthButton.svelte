<script lang="ts">
	import type { Auth } from '$lib/utils/auth';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	export let auth: Auth;

	async function login() {
		await auth.login();
		console.log(auth.me);
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
	<button on:click={login}> Login </button>
{/if}

<style>
</style>
