import { writable } from 'svelte/store';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '$lib/supabase';
import { goto } from '$app/navigation';

export const user = writable<User | null>(null);
export const session = writable<Session | null>(null);
export const loading = writable(true);

export const authStore = {
	async signInWithGoogle() {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: `${window.location.origin}/dashboard`
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

	async initialize() {
		loading.set(true);
		
		// Get initial session
		const { data: { session: initialSession } } = await supabase.auth.getSession();
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