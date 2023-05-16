export type MaiaPol = [Map<string, number>, number];

export type Game = {
	start_fen: string;
	moves: string[];
};

export type Result = {
	fen: string;
	threshold: number;
	moves: Move[];
	username: string;
	perfs: any;
	assistantRating: number;
	opponentRating: number;
};

export type PolVal = [string, number, number][];

export type Move = {
	fen: string;
	polMove: string;
	valMove: string;
	polvals: PolVal;
	playedMove: string;
	intervened: boolean;
};
