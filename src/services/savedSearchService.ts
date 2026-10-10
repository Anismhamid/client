
import api from './api';

export interface SavedSearchInput {
    name: string;
    keyword?: string;
    category?: string;
    subCategory?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    notificationsEnabled?: boolean;
}

export interface SavedSearch extends SavedSearchInput {
    _id: string;
    createdAt?: string;
    updatedAt?: string;
}

interface SavedSearchListResponse {
    savedSearches?: SavedSearch[];
    data?: SavedSearch[];
}

const normalizeList = (
    data: SavedSearchListResponse | SavedSearch[],
): SavedSearch[] => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.savedSearches)) return data.savedSearches;
    if (Array.isArray(data.data)) return data.data;
    return [];
};

/**
 * Get the current user's saved searches.
 * Backend endpoint: GET /saved-searches
 */
export const getSavedSearches = async (): Promise<SavedSearch[]> => {
    const response = await api.get<SavedSearchListResponse | SavedSearch[]>(
        '/saved-searches',
    );

    return normalizeList(response.data);
};

/**
 * Save a new product search.
 * Backend endpoint: POST /saved-searches
 */
export const createSavedSearch = async (
    input: SavedSearchInput,
): Promise<SavedSearch> => {
    const response = await api.post<SavedSearch>('/saved-searches', {
        ...input,
        notificationsEnabled: input.notificationsEnabled ?? true,
    });

    return response.data;
};

/**
 * Delete a saved search owned by the current user.
 * Backend endpoint: DELETE /saved-searches/:id
 */
export const deleteSavedSearch = async (
    searchId: string,
): Promise<void> => {
    await api.delete(`/saved-searches/${encodeURIComponent(searchId)}`);
};

/**
 * Enable or disable notifications for a saved search.
 * Backend endpoint: PATCH /saved-searches/:id
 */
export const updateSavedSearch = async (
    searchId: string,
    updates: Partial<
        Pick<SavedSearchInput, 'notificationsEnabled' | 'maxPrice' | 'minPrice'>
    >,
): Promise<SavedSearch> => {
    const response = await api.patch<SavedSearch>(
        `/saved-searches/${encodeURIComponent(searchId)}`,
        updates,
    );

    return response.data;
};
