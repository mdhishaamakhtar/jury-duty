import { writable } from 'svelte/store';
import { contentService, type ContentItem } from '$lib/services/content';

interface ContentState {
	currentContent: ContentItem | null;
	loading: boolean;
	error: string | null;
	submittingLabel: boolean;
	lastDecision: string | null;
	showingBallotLoader: boolean;
	backgroundContent: ContentItem | null;
}

const initialState: ContentState = {
	currentContent: null,
	loading: false,
	error: null,
	submittingLabel: false,
	lastDecision: null,
	showingBallotLoader: false,
	backgroundContent: null
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

		async fetchNextContentInBackground() {
			try {
				const content = await contentService.getNextDatapoint();

				update((state) => {
					if (state.showingBallotLoader) {
						// Still showing ballot animation, store in background
						return {
							...state,
							backgroundContent: content,
							error: null
						};
					} else {
						// Ballot animation finished or not running, show content immediately
						return {
							...state,
							currentContent: content,
							backgroundContent: null,
							loading: false,
							error: null
						};
					}
				});
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Failed to fetch content';
				update((state) => ({
					...state,
					loading: false,
					error: errorMessage,
					backgroundContent: null,
					showingBallotLoader: false
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

				// Submit label first
				await contentService.submitLabel(currentState.currentContent.id, label);

				// Show ballot loader with the decision
				update((state) => ({
					...state,
					submittingLabel: false,
					lastDecision: label,
					showingBallotLoader: true,
					currentContent: null
				}));

				// Start fetching next content in background
				const fetchPromise = this.fetchNextContentInBackground();

				// After ballot animation (1.5s for stages 1+2), check if data is ready
				setTimeout(async () => {
					const currentState = get(contentStore);
					if (currentState.backgroundContent) {
						// Data is ready, show final loading stage briefly then content
						setTimeout(() => {
							update((state) => ({
								...state,
								showingBallotLoader: false,
								currentContent: state.backgroundContent,
								backgroundContent: null,
								loading: false
							}));
						}, 500); // Brief "fetching next" stage
					} else {
						// Data not ready, switch to loading and wait for it
						update((state) => ({
							...state,
							showingBallotLoader: false,
							loading: true
						}));
						// Wait for the fetch to complete
						await fetchPromise;
					}
				}, 1500); // End of ballot drop stage
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Failed to submit label';
				update((state) => ({
					...state,
					submittingLabel: false,
					error: errorMessage,
					showingBallotLoader: false
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
