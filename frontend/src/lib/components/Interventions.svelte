<script lang="ts">
	import { onMount } from 'svelte';
	import { Chess, SQUARES, type Square } from 'chess.js';
	import { Chessground } from 'chessground';
	import type { Api } from 'chessground/api';
	import type { Key } from 'chessground/types';
	import type { Game, MaiaPol, PolVal, Result } from '$lib/utils/types';

	import '$lib/styles/chessground.base.css';
	import '$lib/styles/chessground.brown.css';
	import '$lib/styles/chessground.cburnett.css';
	import { threshs } from '$lib/utils/constants';
	import { maxKey } from '$lib/utils/utils';
	import type { Auth } from '$lib/utils/auth';

	export let finished;
	export let auth: Auth;

	let el: HTMLElement;
	let cg: Api;
	let chess: Chess;

	let userColor = 'w';
	let thresh = 0.0;
	let movesLeft = 0;
	let exerciseCur = -1;
	let exerciseTotal = 3;
	let message = '';
	let results: Result[] = [];

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

	async function getPolicy(type: string): Promise<MaiaPol> {
		const game = getGame();
		const response = await fetch(`http://localhost:8801/get_${type}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(game)
		});
		let json = await response.json();
		return [new Map(Object.entries(json[0])), json[1]];
	}

	async function newGame() {
		exerciseCur = exerciseCur + 1;

		thresh = threshs[Math.floor(Math.random() * threshs.length)];
		movesLeft = Math.floor(Math.random() * 2) + 3;
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

		results.push({
			fen: chess.fen(),
			threshold: thresh,
			moves: [],
			username: auth.me!.username,
			perfs: auth.me?.perfs,
			assistantRating: 1800,
			opponentRating: 1800
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

	async function postResults() {
		console.log(JSON.stringify(results.at(-1)));
		const res = await fetch(`/api/addresult`, {
			method: 'POST',
			body: JSON.stringify(results.at(-1)),
			headers: {
				'content-type': 'application/json'
			}
		});
		console.log(res);
	}

	async function playMove() {
		if (chess.isCheckmate() || movesLeft === 0) {
			console.log(results);
			postResults();
			if (exerciseCur + 1 === exerciseTotal) {
				message =
					"You've finished all the exercises!  We are recording your results. This shouldn't take more than a few seconds. Please do not close this window during this time.";
				message =
					"You've finished all the exercises!  Click the button to continue with the experiment.";
				console.log(results);
			} else if (chess.isCheckmate()) {
				message =
					'Checkmate! The game is over, thanks for playing! Click the button to play again.';
			} else {
				message = 'Finished all the moves for this exercise. Click the button to play again.';
			}
		} else if (chess.turn() === userColor) {
			message = 'Waiting for hint generator';
			const [pol, val] = [(await getPolicy('pol'))[0], (await getPolicy('val'))[0]];
			const [polMove, valMove] = [maxKey(pol), maxKey(val)];
			// console.log(polMove, val.get(polMove), valMove, val.get(valMove));
			const polvals: PolVal = [...pol.keys()].map((k, _) => [k, pol.get(k)!, val.get(k)!]);

			const shouldIntervene = val.get(valMove)! - val.get(polMove)! >= thresh;
			if (shouldIntervene) {
				message = 'Please make your move. Hint is: ' + valMove;
			} else {
				message = 'Please make your move. No hints for this move.';
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
							results[exerciseCur].moves.push({
								fen: chess.fen(),
								polvals: polvals,
								polMove: polMove,
								valMove: valMove,
								playedMove: orig + dest,
								intervened: shouldIntervene
							});
							updateMove(orig, dest);
							playMove();
						}
					}
				}
			});
		} else {
			message = 'Waiting for opponent move';
			const val = (await getPolicy('val'))[0];
			const move = maxKey(val);
			const lastMove = [move.slice(0, 2), move.slice(2, 4)] as Key[];
			chess.move(move);
			cg.set({ fen: chess.fen(), lastMove: lastMove, movable: { free: false } });
			playMove();
		}
	}

	onMount(async () => {
		cg = Chessground(el, {});
		newGame();
	});
</script>

<!-- <p>You are playing as: {userColor == 'w' ? 'White' : 'Black'}</p> -->

<h3>You are on Exercise {exerciseCur + 1} of {exerciseTotal}</h3>

<div class="board" bind:this={el} />

{#if movesLeft > 2}
	<p>You have {movesLeft} moves left to play.</p>
{:else if movesLeft == 1}
	<p>You have {movesLeft} move left to play.</p>
{/if}
<!-- <p>You have {movesLeft} {movesLeft == 1 ? 'move' : 'moves'} left to play.</p> -->

<p>{message}</p>

{#if movesLeft == 0 || (chess && chess.isCheckmate())}
	{#if exerciseCur + 1 === exerciseTotal}
		<button on:click={() => (finished = true)}> Continue with Experiment </button>
	{:else}
		<button on:click={newGame}> Next Exercise </button>
	{/if}
{/if}

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
