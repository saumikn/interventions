import { json, type RequestEvent } from '@sveltejs/kit';
import { readFileSync, writeFileSync } from 'fs';
import type { Game, Result } from '$lib/utils/types';
import { root } from '$lib/utils/constants';

export async function POST({ request }: RequestEvent) {
	let newResult: Result = await request.json();
	console.log(newResult);

	const filePath = `${root}/static/results.json`;
	let results: Result[] = JSON.parse(readFileSync(filePath, 'utf-8'));
	results.push(newResult);
	writeFileSync(filePath, JSON.stringify(results));

	return json({});
}

// import { json, type RequestEvent } from '@sveltejs/kit';
// import { readFileSync, writeFileSync } from 'fs';
// import type { Node, Nodes } from '$lib/types';
// import { getUserId, root } from '../util';
// import { addResults } from './addResult';

// export async function POST({ request, url }: RequestEvent) {
// 	const userId = await getUserId(request);
// 	let positions = await request.json();
// 	const course = url.searchParams.get('course');

// 	const filePath = `${root}/static/database/${userId}/${course}.json`;
// 	let nodes: Nodes = JSON.parse(readFileSync(filePath, 'utf-8'));
// 	nodes = await addResults(nodes, positions);
// 	writeFileSync(filePath, JSON.stringify(nodes));

// 	return json({ Response: 'Good' });
// }
