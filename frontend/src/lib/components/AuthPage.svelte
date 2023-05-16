<script lang="ts">
	import type { Auth } from '$lib/utils/auth';
	import { onMount } from 'svelte';
	import AuthButton from './AuthButton.svelte';

	let code = '';
	let rating: number | null = null;

	export let auth: Auth;

	function string2num(str: string) {
		var hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = (hash << 5) - hash + str.charCodeAt(i);
			hash = hash & hash;
		}
		return Math.abs(hash);
	}

	function RNG(seed: string) {
		var m = 2 ** 35 - 31;
		var a = 185852;
		var s = string2num(seed) % m;
		return function () {
			return (s = (s * a) % m) / m;
		};
	}

	function hashStr(str: string, len: number) {
		const chars = 'abcdefghijklmnopqrstuvwxyz';
		const seededRandom = RNG(str);
		let code = '';
		for (let i = 0; i < len; i++) {
			let r = Math.floor(seededRandom() * 26);
			code += chars[r];
		}
		return code;
	}

	async function getPublicInfo() {
		console.log('getting public info');
		console.log(JSON.stringify({ username: auth.me?.username }));
		rating = auth.me?.perfs.blitz.rating;
		console.log(rating);
	}

	$: if (auth && auth.me) {
		if (rating == null) {
			getPublicInfo();
		}
		code = hashStr(auth.me.username, 10);
		code = auth.me.username + '_' + code + hashStr(code, 10);
	}
</script>

<h2>Provide your Lichess username and rating</h2>

<p>
	To ensure that all study particpants are chess players, you will be asked to provide your Lichess
	username and rating through the Lichess API. Using your rating, we will be able to target our AI
	assistant to give reccomendations targeted to your skill level. This process is handled entirely
	by Lichess, and we will not be able to view your password or any private information from your
	account.
</p>

<p>Click on the button below to provide your Lichess username</p>

<p>
	If you have any concerns, feel free to reach out to Saumik Narayanan at
	<a href="mailto:saumik@wustl.edu">saumik@wustl.edu</a>.
</p>

<AuthButton {auth} />

<style>
</style>
