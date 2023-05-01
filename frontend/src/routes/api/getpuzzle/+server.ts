import { json, type RequestEvent } from '@sveltejs/kit';
import { readFileSync, writeFileSync } from 'fs';
import { Chess } from 'chess.js';
import type { Game } from '$lib/utils/types';
import { root } from '$lib/utils/constants';

export async function GET({}: RequestEvent) {
	const filePath = `${root}/static/data.json`;
	const games: Game[] = JSON.parse(readFileSync(filePath, 'utf-8'));
	const game = games[Math.floor(Math.random() * games.length)];
	return json(game);
}
