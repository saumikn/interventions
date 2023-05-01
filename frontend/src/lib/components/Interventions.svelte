<script lang="ts">
	import { onMount } from 'svelte';
	import { Chess, SQUARES, type Square } from 'chess.js';
	import { Chessground } from 'chessground';
	import type { Api } from 'chessground/api';
	import type { Key } from 'chessground/types';
	import type { Game } from '$lib/utils/types';

	import '$lib/styles/chessground.base.css';
	import '$lib/styles/chessground.brown.css';
	import '$lib/styles/chessground.cburnett.css';
	import { threshs } from '$lib/utils/constants';

	let el: HTMLElement;
	let cg: Api;
	let chess: Chess;
	let status = 'finished';

	let userColor = 'w';
	let thresh = 0.0;
	let movesLeft = 0;

	let message = 'asdf';

	function dests() {
		const dests = new Map<Key, Key[]>();
		SQUARES.forEach((s) => {
			const ms = chess.moves({ square: s, verbose: true });
			if (ms.length) {
				const tos = ms.map((m) => m.to);
				dests.set(s, tos);
			}
		});
		return dests;
	}

	function color() {
		return chess.turn() === 'w' ? 'white' : 'black';
	}

	function getGame() {
		const history = chess.history({ verbose: true }).slice(-8);
		const startFen = history[0].before;
		const moves = history.map((x) => x.lan);
		const game: Game = { start_fen: startFen, moves: moves };
		return game;
	}

	async function getPolicy(type: string) {
		const game = getGame();
		const response = await fetch(`http://localhost:8801/get_${type}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(game)
		});
		return await response.json();
	}

	async function newGame() {
		thresh = threshs[Math.floor(Math.random() * threshs.length)];
		movesLeft = Math.floor(Math.random() * 8) + 3;
		const res = await fetch(`/api/getpuzzle`, { method: 'GET' });
		const game: Game = await res.json();
		chess = new Chess(game.start_fen);
		for (let move of game.moves) {
			chess.move(move);
		}
		userColor = chess.turn();
		const lastLan = chess.history({ verbose: true }).at(-1)?.lan;
		if (lastLan === undefined) {
			console.log('error here');
			return;
		}
		const lastMove = [lastLan.slice(0, 2), lastLan.slice(2, 4)] as Key[];
		cg.set({
			fen: chess.fen(),
			orientation: color(),
			turnColor: color(),
			lastMove: lastMove,
			movable: { free: false }
		});
		playMove();
	}

	function updateMove(orig: Square, dest: Square) {
		// Auto-Queen
		if (chess.get(orig).type == 'p' && (dest[1] == '1' || dest[1] == '8')) {
			chess.move({ from: orig, to: dest, promotion: 'q' });
		} else {
			chess.move({ from: orig, to: dest });
		}
		cg.set({ fen: chess.fen(), lastMove: [orig, dest], movable: { free: false } });
		movesLeft--;
	}

	async function playMove() {
		if (chess.isCheckmate()) {
			message = 'Checkmate! The game is over, thanks for playing! Click the button to play again.';
			return;
		} else if (movesLeft == 0) {
			message = 'Finished all the moves for this exercise. Click the button to play again.';
			return;
		}
		if (chess.turn() == userColor) {
			message = 'Waiting for hint generator';
			const pol = (await getPolicy('pol'))[0];
			const val = (await getPolicy('val'))[0];
			const polMove = Object.keys(pol).reduce((a, b) => (pol[a] > pol[b] ? a : b));
			const valMove = Object.keys(val).reduce((a, b) => (val[a] > val[b] ? a : b));
			console.log(polMove, val[polMove], valMove, val[valMove]);

			if (val[valMove] - val[polMove] >= thresh) {
				message = 'Please make your move. Hint is: ' + valMove;
			} else {
				message = 'Please make your move. No hints for this move';
			}

			cg.set({
				fen: chess.fen(),
				turnColor: color(),
				movable: {
					color: color(),
					free: false,
					dests: dests(),
					events: {
						after: (orig, dest) => {
							if (orig == 'a0' || dest == 'a0') return;
							updateMove(orig, dest);
							playMove();
						}
					}
				}
			});
		} else {
			message = 'Waiting for opponent move';
			const val = (await getPolicy('val'))[0];
			const move = Object.keys(val).reduce((a, b) => (val[a] > val[b] ? a : b));
			const lastMove = [move.slice(0, 2), move.slice(2, 4)] as Key[];
			chess.move(move);
			cg.set({ fen: chess.fen(), lastMove: lastMove, movable: { free: false } });
			playMove();
		}
	}

	onMount(async () => {
		cg = Chessground(el, {});
		status = 'ready';
	});

	$: if (status == 'ready') {
		newGame();
		status = 'starting';
	}
</script>

<p>You are playing as: {userColor == 'w' ? 'White' : 'Black'}</p>
<p>Your threshold is {thresh}</p>
{#if movesLeft > 2}
	<p>You have {movesLeft} moves left to play.</p>
{:else if movesLeft == 1}
	<p>You have {movesLeft} move left to play.</p>
{:else}
	<p>Finished all your moves!</p>
{/if}
<!-- <p>You have {movesLeft} {movesLeft == 1 ? 'move' : 'moves'} left to play.</p> -->
<div class="board" bind:this={el} />

<p>{message}</p>

<style>
	.board {
		width: 640px;
		height: 640px;
		background-color: #bfcfdd;
	}

	/* p, li {
    font-size: 36px;
  } */
</style>
