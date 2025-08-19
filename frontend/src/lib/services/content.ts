import { supabase } from '$lib/supabase';

export interface ContentItem {
	id: string;
	content: string;
}

export interface ContentResponse {
	data: ContentItem[];
}

export interface ApiError {
	message: string;
	code?: string;
}

export class ContentService {
	async getNextDatapoint(): Promise<ContentItem | null> {
		try {
			const { data, error } = await supabase.functions.invoke('get_next_datapoint');

			// Log the raw JSON response from backend
			console.log('Raw backend response:', JSON.stringify(data, null, 2));

			if (error) {
				console.error('Error invoking edge function:', error);
				throw new Error(`Failed to fetch content: ${error.message}`);
			}

			if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
				return null;
			}

			const contentItem = data.data[0] as ContentItem;

			if (!contentItem.id || !contentItem.content) {
				throw new Error('Invalid content format received');
			}

			return contentItem;
		} catch (error) {
			console.error('ContentService.getNextDatapoint error:', error);
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('Unknown error occurred while fetching content');
		}
	}

	async submitLabel(contentId: string, label: string): Promise<boolean> {
		try {
			const { error } = await supabase.functions.invoke('label_data', {
				body: {
					dataset_id: contentId,
					label: label
				}
			});

			if (error) {
				console.error('Error submitting label:', error);
				throw new Error(`Failed to submit label: ${error.message}`);
			}

			return true;
		} catch (error) {
			console.error('ContentService.submitLabel error:', error);
			if (error instanceof Error) {
				throw error;
			}
			throw new Error('Unknown error occurred while submitting label');
		}
	}
}

export const contentService = new ContentService();
