export type Verdict = 'TRUE' | 'FALSE';

export interface Post {
	id: string;
	content: string;
	labeled_count: number;
	remaining_count: number;
}
