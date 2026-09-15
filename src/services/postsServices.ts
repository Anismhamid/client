/* eslint-disable @typescript-eslint/no-explicit-any */
import { Posts } from '../interfaces/Posts';
import { showError } from '../atoms/toasts/ReactToast';
import api from './api';

/**
 * Gets a specific post by name
 * @param postName - The name of the post to fetch
 * @returns The post data if found, or null if there's an error or post not found
 */
export const getPostById = async (post_id: string) => {
    try {
        const post = await api.get(`/posts/spicific/${post_id}`);
        return post.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getRelatedPosts = async (
    category: string,
    currentPostId?: string,
    limit: number = 4,
): Promise<Posts[]> => {
    try {
        const params = new URLSearchParams({
            ...(currentPostId && { excludeId: currentPostId }),
            limit: limit.toString(),
        });

        const response = await api.get(
            `/posts/related-posts/${category}?${params.toString()}`,
        );

        return response.data || [];
    } catch (error) {
        console.error(error);
        return [];
    }
};

// // نسخة متقدمة مع فلترة وترتيب
export const getRelatedPostsAdvanced = async (
    category: string,
    currentPostId?: string,
    options?: {
        limit?: number;
        sortBy?: 'price' | 'rating' | 'createdAt';
        sortOrder?: 'asc' | 'desc';
        minPrice?: number;
        maxPrice?: number;
    },
): Promise<Posts[]> => {
    try {
        const params = new URLSearchParams({
            category,
            limit: (options?.limit ?? 4).toString(),

            ...(options?.sortBy && {
                sortBy: options.sortBy,
            }),

            ...(options?.sortOrder && {
                sortOrder: options.sortOrder,
            }),

            ...(options?.minPrice !== undefined && {
                minPrice: options.minPrice.toString(),
            }),

            ...(options?.maxPrice !== undefined && {
                maxPrice: options.maxPrice.toString(),
            }),

            ...(currentPostId && {
                excludeId: currentPostId,
            }),
        });

        const response = await api.get(`/posts/related?${params.toString()}`);

        return response.data?.posts || response.data?.data || [];
    } catch (error) {
        console.error('Error in getRelatedPostsAdvanced:', error);
        return [];
    }
};

/**
 * Update post by id
 * @param postId - The id of the post to update
 * @param updatedPost - The updated post data
 * @returns The updated post if successful, or null if there's an error
 */
export const updatePost = async (postId: string, updatedPost: Posts) => {
    try {
        const post = await api.put(`/posts/${postId}`, updatedPost);
        return post.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

/**
 * Get all Posts from all categories
 * @returns An array of Posts, or an empty array if there's an error
 */
export const getAllPosts = async () => {
    try {
        const response = await api.get(`/posts`);
        if (Array.isArray(response.data)) return response.data;
        return [];
    } catch (error: any) {
        console.error(error);
        return [];
    }
};

/**
 * Create a new post
 * @param Posts - post data to be created
 * @returns The created post if successful, or null if there's an error
 */
export const createNewPost = async (post: Posts) => {
    try {
        const response = await api.post(`/posts`, post);

        return response.data;
    } catch (error: any) {
        const message =
            error?.response?.data?.message ||
            error?.message ||
            'Something went wrong';

        showError(message);

        throw error;
    }
};

/**
 * Get posts in discount limit (6 items)
 * @returns An array of posts on discount, or an empty array if there's an error
 */
export async function getPostsInDiscount() {
    try {
        const response = await api.get(`/discounts`);
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

/**
 * Delete post by name
 * @param productName - The name of the post to delete
 * @returns The deleted post if successful, or null if there's an error
 */
export async function deletePost(postId: string) {
    try {
        const response = await api.delete(`/posts/${postId}`);

        return response.data;
    } catch (error) {
        console.log(error);
        return;
    }
}

/**
 * Get posts by category name
 * @param category - The name of the category
 * @param subCategory - Optional subcategory
 * @returns Array of posts
 */
export const getpostsByCategory = async (
    category: string,
    subCategory?: string,
): Promise<Posts[]> => {
    try {
        const response = await api.get(`/posts/${category}`, {
            params: subCategory ? { subCategory } : undefined,
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch posts by category:', error);
        return [];
    }
};

export const getCustomerProfilePostsBySlug = async (
    slug: string,
): Promise<Posts[]> => {
    try {
        const res = await api.get(`/users/customer/${slug}/posts`);

        if (Array.isArray(res.data?.posts)) {
            return res.data.posts;
        }

        return [];
    } catch (error) {
        console.error('Failed to get customer posts:', error);
        return [];
    }
};

export const toggleLike = async (postId: string) => {
    try {
        const res = await api.patch(`/posts/${postId}/like`, {});

        return res.data;
    } catch (error: any) {
        console.error(
            '❌ Like API Error:',
            error.response?.data || error.message,
        );
        throw error;
    }
};

// Review submission
export const submitReview = async (
    postId: string,
    review: { userId: string; rating: number; comment: string },
) => {
    try {
        const res = await api.patch(`/posts/${postId}/reviews`, review);

        console.log('Review submitted:', res.data);
        return res.data;
    } catch {
        return [];
    }
};

export const incrementViewCount = async (postId: string) => {
    try {
        const result = await api.patch(`/posts/${postId}/increment-views`);

        return result.data;
    } catch (error) {
        console.error('Failed to increment view count:', error);
    }
};

export const getPendingPosts = async () => {
    try {
        const response = await api('/posts/pending');
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const approvePost = async (postId: string) => {
    try {
        const response = await api.patch(`/posts/${postId}/approve`);

        return response.data;
    } catch (error: any) {
        console.error(
            'Failed to approve post:',
            error.response?.data || error.message,
        );

        throw error;
    }
};

export const rejectPost = async (postId: string) => {
    try {
        const response = await api.patch(`/posts/${postId}/reject`);

        return response.data;
    } catch (error: any) {
        console.error(
            'Failed to reject post:',
            error.response?.data || error.message,
        );

        throw error;
    }
};
