import { supabase } from '$lib/supabase';

export interface ContentItem {
	id: string;
	content: string;
	labeled_count: number;
	remaining_count: number;
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
		const { data, error } = await supabase.functions.invoke('get_next_datapoint');

		if (error) {
			throw new Error(`Failed to fetch content: ${error.message}`);
		}

		if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
			return null;
		}

		const contentItem = data.data[0] as ContentItem;

		if (
			!contentItem.id ||
			!contentItem.content ||
			contentItem.labeled_count === undefined ||
			contentItem.remaining_count === undefined
		) {
			throw new Error('Invalid content format received');
		}

		return contentItem;
	}

	async submitLabel(contentId: string, label: string): Promise<boolean> {
		const { error } = await supabase.functions.invoke('label_data', {
			body: {
				dataset_id: contentId,
				label: label
			}
		});

		if (error) {
			throw new Error(`Failed to submit label: ${error.message}`);
		}

		return true;
	}
}

export const contentService = new ContentService();
