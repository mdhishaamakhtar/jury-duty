// Loads posts from a CSV with a `content` column: npm run import -- posts.csv
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { parseCsv } from '../src/lib/csv.ts';

const BATCH_SIZE = 500;
const [path, ...flags] = process.argv.slice(2);

if (!path) {
	throw new Error('Pass a CSV file: npm run import -- posts.csv');
}

process.loadEnvFile('.env');
const url = process.env.PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Set PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');

const [header, ...rows] = parseCsv(readFileSync(path, 'utf8'));
const column = header?.findIndex((name) => name.trim().toLowerCase() === 'content') ?? -1;
if (column < 0) throw new Error('The CSV needs a column named content');

const posts = rows.map((row) => row[column]?.trim()).filter(Boolean);
const database = createClient(url, key, { auth: { persistSession: false } });

const { count, error: countError } = await database
	.from('dataset')
	.select('*', { count: 'exact', head: true });
if (countError) throw countError;
if (count && !flags.includes('--append')) {
	throw new Error(`The project already has ${count} posts. Pass --append to add more.`);
}

for (let start = 0; start < posts.length; start += BATCH_SIZE) {
	const batch = posts.slice(start, start + BATCH_SIZE).map((content) => ({
		id: crypto.randomUUID(),
		content
	}));
	const { error } = await database.from('dataset').insert(batch);
	if (error) throw error;
}

process.stdout.write(`Imported ${posts.length} posts.\n`);
