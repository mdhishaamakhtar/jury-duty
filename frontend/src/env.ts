import { defineEnvVars } from '@sveltejs/kit/env';

const required = (name: string) => (value: string | undefined) => {
	if (!value) throw new Error(`${name} is required`);
	return value;
};

export const variables = defineEnvVars({
	PUBLIC_SUPABASE_URL: {
		public: true,
		static: true,
		schema: required('PUBLIC_SUPABASE_URL'),
		description: 'Supabase project URL'
	},
	PUBLIC_SUPABASE_ANON_KEY: {
		public: true,
		static: true,
		schema: required('PUBLIC_SUPABASE_ANON_KEY'),
		description: 'Supabase public anon key'
	},
	SUPABASE_SERVICE_ROLE_KEY: {
		schema: required('SUPABASE_SERVICE_ROLE_KEY'),
		description: 'Server-only key used to call database functions'
	}
});
