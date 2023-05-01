<script lang="ts">
	import type { Auth } from '$lib/utils/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
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
		// const res = await fetch(`/api/adduser`, {
		// 	method: 'POST',
		// 	body: JSON.stringify({ id: auth.me?.id, username: auth.me?.username, perfs: auth.me?.perfs }),
		// 	headers: { 'content-type': 'application/json' }
		// });
		rating = auth.me?.perfs.blitz.rating;
		console.log(rating);

		// const accessContext = await auth.oauth.getAccessToken();
		// console.log(accessContext);
		// const headers = { Authorization: `Bearer ${accessContext.token?.value}` };
		// console.log(headers);
		// const res = await fetch('https://lichess.org/api/account', { headers });
		// console.log(res);
		// const json = await res.json();
		// console.log(json);
		// rating = json.perfs.blitz.rating;
	}

	$: if (auth && auth.me) {
		if (rating == null) {
			getPublicInfo();
		}
		code = hashStr(auth.me.username, 10);
		code = auth.me.username + '_' + code + hashStr(code, 10);
	}
</script>

<h2>Consent Page</h2>
<h4>By clicking on the above button, you agree to the following terms and conditions.</h4>
<ul>
	<li>You are above the age of 18</li>
	<li>Something else...</li>
	<li>Something else...</li>
</ul>

<style>
	code {
		font-family: Consolas, 'courier new';
		color: crimson;
		background-color: #f1f1f1;
		padding: 2px;
		font-size: 105%;
	}
</style>
