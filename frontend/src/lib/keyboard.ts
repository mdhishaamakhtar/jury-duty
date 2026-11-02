import type { Verdict } from './types';

interface KeyPress {
	key: string;
	metaKey: boolean;
	ctrlKey: boolean;
	altKey: boolean;
	repeat: boolean;
}

const keys: Record<string, Verdict> = {
	'1': 'TRUE',
	t: 'TRUE',
	arrowleft: 'TRUE',
	'2': 'FALSE',
	f: 'FALSE',
	arrowright: 'FALSE'
};

// Browser shortcuts like Cmd+F must never cast a verdict, and neither must a held key.
export const verdictForKey = (event: KeyPress): Verdict | null => {
	if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return null;
	return keys[event.key.toLowerCase()] ?? null;
};
