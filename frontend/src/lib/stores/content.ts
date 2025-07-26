import { writable } from 'svelte/store';
import { contentService, type ContentItem } from '$lib/services/content';

interface ContentState {
	currentContent: ContentItem | null;
	loading: boolean;
	error: string | null;
	submittingLabel: boolean;
}

const initialState: ContentState = {
	currentContent: null,
	loading: false,
	error: null,
	submittingLabel: false
};

function createContentStore() {
	const { subscribe, set, update } = writable<ContentState>(initialState);

	return {
		subscribe,

		async fetchNextContent() {
			update((state) => ({ ...state, loading: true, error: null }));

			try {
				const content = await contentService.getNextDatapoint();
				update((state) => ({
					...state,
					currentContent: content,
					loading: false,
					error: null
				}));
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Failed to fetch content';
				update((state) => ({
					...state,
					loading: false,
					error: errorMessage,
					currentContent: null
				}));
			}
		},

		async submitLabel(label: string) {
			update((state) => ({ ...state, submittingLabel: true, error: null }));

			try {
				const currentState = get(contentStore);
				if (!currentState.currentContent) {
					throw new Error('No content available to label');
				}

				await contentService.submitLabel(currentState.currentContent.id, label);

				// After successful submission, fetch the next content
				update((state) => ({ ...state, submittingLabel: false }));
				await this.fetchNextContent();
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Failed to submit label';
				update((state) => ({
					...state,
					submittingLabel: false,
					error: errorMessage
				}));
			}
		},

		clearError() {
			update((state) => ({ ...state, error: null }));
		},

		reset() {
			set(initialState);
		}
	};
}

// Helper function to get current state (for use in actions)
function get<T>(store: { subscribe: (fn: (value: T) => void) => () => void }): T {
	let value: T;
	const unsubscribe = store.subscribe((v) => {
		value = v;
	});
	unsubscribe();
	return value!;
}

export const contentStore = createContentStore();
