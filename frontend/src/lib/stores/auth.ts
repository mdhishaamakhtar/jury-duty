import { writable } from 'svelte/store';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '$lib/supabase';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

export const user = writable<User | null>(null);
export const session = writable<Session | null>(null);
export const loading = writable(true);

// Store server data for reliable hostname detection
let serverData: { hostname?: string; protocol?: string } = {};

export const authStore = {
	async signInWithGoogle() {
		try {
			// Only proceed if we're in the browser
			if (!browser) return;

			// Build redirect URL using server-provided hostname (most reliable)
			let redirectUrl: string;

			if (serverData.hostname && serverData.protocol) {
				// Use server-provided data (most reliable for production)
				const isLocalhost =
					serverData.hostname === 'localhost' || serverData.hostname === '127.0.0.1';
				if (isLocalhost) {
					redirectUrl = `${serverData.protocol}//${serverData.hostname}:5173/dashboard`;
				} else {
					redirectUrl = `https://${serverData.hostname}/dashboard`;
				}
			} else {
				// Final fallback to client-side detection
				const isLocalhost =
					window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
				if (isLocalhost) {
					redirectUrl = `${window.location.origin}/dashboard`;
				} else {
					redirectUrl = `https://${window.location.hostname}/dashboard`;
				}
			}

			console.log('Environment check:');
			console.log('- Server hostname:', serverData.hostname);
			console.log('- Server protocol:', serverData.protocol);
			console.log('- Client origin:', window.location.origin);
			console.log('- Final redirect URL:', redirectUrl);

			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: redirectUrl
				}
			});
			if (error) throw error;
		} catch (error) {
			console.error('Error signing in with Google:', error);
		}
	},

	async signOut() {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
			goto('/');
		} catch (error) {
			console.error('Error signing out:', error);
		}
	},

	async initialize(data?: { hostname?: string; protocol?: string }) {
		loading.set(true);

		// Store server data for use in OAuth redirects
		if (data) {
			serverData = data;
		}

		// Get initial session
		const {
			data: { session: initialSession }
		} = await supabase.auth.getSession();
		session.set(initialSession);
		user.set(initialSession?.user ?? null);

		// Listen for auth changes
		supabase.auth.onAuthStateChange((event, currentSession) => {
			session.set(currentSession);
			user.set(currentSession?.user ?? null);

			if (event === 'SIGNED_IN' && currentSession) {
				goto('/dashboard');
			} else if (event === 'SIGNED_OUT') {
				goto('/');
			}
		});

		loading.set(false);
	}
};
