export function maxKey(map: Map<any, number>) {
	return [...map.entries()].reduce((acc, cur) => (acc[1] > cur[1] ? acc : cur))[0];
}
