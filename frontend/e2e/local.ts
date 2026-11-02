import { createClient } from '@supabase/supabase-js';

// These tests write data, so they only ever run against `supabase start` on this machine.
export const supabase = {
	url: process.env.E2E_SUPABASE_URL ?? 'http://127.0.0.1:54321',
	anonKey: process.env.E2E_ANON_KEY ?? '',
	serviceKey: process.env.E2E_SERVICE_KEY ?? ''
};

if (!/^http:\/\/(127\.0\.0\.1|localhost):/.test(supabase.url)) {
	throw new Error('End-to-end tests only run against a local Supabase');
}

export const admin = () =>
	createClient(supabase.url, supabase.serviceKey, { auth: { persistSession: false } });

export const people = {
	owner: 'owner@example.test',
	rater: 'rater@example.test',
	outsider: 'outsider@example.test'
};

export const password = 'local-test-password';
