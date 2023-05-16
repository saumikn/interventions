<script lang="ts">
	import { onMount } from 'svelte';
	import { Chessground } from 'chessground';
	import type { Api } from 'chessground/api';

	import '$lib/styles/chessground.base.css';
	import '$lib/styles/chessground.brown.css';
	import '$lib/styles/chessground.cburnett.css';
	import { Chess, SQUARES } from 'chess.js';
	import type { Key } from 'chessground/types';

	export let watchedDemo;

	let el1: HTMLElement;
	let cg1: Api;

	let status = 0;

	let fen1 = 'r1r3k1/1p2qpp1/p1n1p1bp/P2p4/3P3P/RNP3Q1/1P3PP1/4RBK1 b - - 0 21';
	let fen2 = '4rrk1/2b3pp/2nq4/p1p2p2/2P1p3/2PP1QPP/R2B1P2/1B2R1K1 w - - 0 30';
	let chess = new Chess(fen1);

	function color() {
		return chess.turn() === 'w' ? 'white' : 'black';
	}

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

	function click() {
		if (status === 0) {
			status = 1;
			cg1 = Chessground(el1, {});
			cg1.set({
				fen: fen1,
				orientation: color(),
				turnColor: color(),
				lastMove: ['h2', 'h4'],
				movable: {
					color: color(),
					free: false,
					dests: dests(),
					events: {
						after: (orig, dest) => {
							if (orig == 'a0' || dest == 'a0') return;
							alert('You made a move. Continue to the next example');
							status = 2;
						}
					}
				}
			});
		} else if (status === 2) {
			status = 3;
			chess = new Chess(fen2);
			cg1.set({
				fen: fen2,
				orientation: color(),
				turnColor: color(),
				lastMove: ['e5', 'e4'],
				movable: {
					color: color(),
					free: false,
					dests: dests(),
					events: {
						after: (orig, dest) => {
							if (orig == 'a0' || dest == 'a0') return;
							if (orig == 'd3' && dest == 'e4') {
								alert(
									'You made the recommended move. You could have also made a different move. You may now begin the experiment'
								);
							} else {
								alert(
									'You made a different move to the recommendation of dxe4. You may now begin the experiment'
								);
							}
							status = 4;
						}
					}
				},
				drawable: { shapes: [{ orig: 'd3', dest: 'e4', brush: 'green' }] }
			});
		} else if (status === 4) {
			watchedDemo = true;
		}
	}

	onMount(async () => {});
</script>

<h3>Instructions:</h3>

<h4>Exercise Description</h4>

<ul>
	<li>We will present you with a set of 10 chess exercises for you to solve</li>
	<li>In each exercise, you will play against an AI opponent, starting from a random position.</li>
	<li>
		You will only have to play a few moves in each exercise, rather than an entire game, and we will
		display a progress bar.
	</li>
	<li>
		These are not puzzles where there is an correct solution, your task is to play as well as you
		can for the number of moves you have.
	</li>
	<li>While you play each exercises, we will provide you with an AI assistant</li>
</ul>

<h4>AI Assistant Description</h4>

<ul>
	<li>
		While playing each exercise, we will provide you with an AI assistant to help you make moves
	</li>
	<li>
		(Treatment) This AI assistant is powered by <a href="https://maiachess.com">Maia</a>, a chess
		engine which was designed to mimic human chess styles
	</li>
	<li>
		On some moves, the AI assistant will recommend a specific move for you to play. This move will
		be highlighed in green on the board
	</li>
	<li>
		You are not required to make the reccommended move. You may choose to ignore it and play
		something else instead, if you think the recommendation is not the best move.
	</li>
</ul>

<button hidden={status !== 0} on:click={click}> Show Example 1 </button>

<hr hidden={status === 0} />
<h4 hidden={status !== 1 && status !== 2} style="color:red">
	In this example, the AI is not making a recommendation on which move to play. Please make a move.
	You may play any move you like.
</h4>
<h4 hidden={status !== 3 && status !== 4} style="color:red">
	In this example, the AI is making a reccomendation that you play Qc7. You can choose to ignore it,
	and play a different move if you like.
</h4>
<h4 hidden={status === 0}>Exercise 1 of 10</h4>
<p hidden={status === 0}>You have 5 moves left in this Exercise.</p>
<div hidden={status === 0} class="board" bind:this={el1} />
<p hidden={status !== 1 && status !== 2}>(The AI is not providing a hint for this move.)</p>
<p hidden={status !== 3 && status !== 4}>
	(The AI recommends that you play dxe4 in this position.)
</p>
<button hidden={status !== 2} on:click={click}> Show Example 2 </button>
<button hidden={status !== 4} on:click={click}> Start Experiment </button>

<style>
	.board {
		width: 640px;
		height: 640px;
		/* background-color: #bfcfdd; */
		display: flex;
		justify-content: right;
	}

	/* p, li {
    font-size: 36px;
  } */
</style>
