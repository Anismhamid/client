/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file postsServices.ts
 * @description API service functions for posts management, including CRUD operations,
 * pagination, category queries, reviews, likes, view counting, and moderation.
 */

import { Posts } from '../interfaces/Posts';
import { showError } from '../atoms/toasts/ReactToast';
import api from './api';

/**
 * Gets a specific post by its ID.
 *
 * @param post_id - The unique identifier of the post to fetch
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

/**
 * Fetches related posts within a category, optionally excluding the current post.
 *
 * @param category - Category name to retrieve related posts for
 * @param currentPostId - Optional post ID to exclude from the results
 * @param limit - Maximum number of related posts to return (default: 4)
 * @returns An array of related Posts, or an empty array if an error occurs
 */
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

/**
 * Fetches related posts with advanced filtering, price range, and sorting options.
 *
 * @param category - Category name to filter by
 * @param currentPostId - Optional post ID to exclude from results
 * @param options - Additional query parameters for pagination, sorting, and price range
 * @returns An array of related Posts matching the criteria
 */
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
 * Updates an existing post by its ID.
 *
 * @param postId - The unique identifier of the post to update
 * @param updatedPost - The updated post data payload
 * @returns The updated post data if successful, or null if an error occurs
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
 * Gets a paginated list of all posts across all categories.
 *
 * @param page - Page number to fetch (1-indexed, default: 1)
 * @param limit - Number of posts per page (default: 20)
 * @returns An array of Posts for the requested page
 * @throws Error if the request fails
 */
export const getAllPosts = async (
    page = 1,
    limit = 20,
): Promise<Posts[]> => {
    try {
        const response = await api.get('/posts', {
            params: { page, limit },
        });

        if (Array.isArray(response.data)) {
            return response.data;
        }

        return [];
    } catch (error) {
        console.error('getAllPosts error:', error);
        throw error;
    }
};

/**
 * Creates a new post and notifies the user with a toast error if creation fails.
 *
 * @param post - The post data to be created
 * @returns The created post data returned from the server
 * @throws Error if creation fails
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
 * Gets posts currently marked on discount (limited to 6 items).
 *
 * @returns An array of posts on discount, or an empty array if an error occurs
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
 * Deletes a post by its ID.
 *
 * @param postId - The unique identifier of the post to delete
 * @returns The deleted post data if successful, or undefined on error
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
 * Gets posts by category name and optional subcategory.
 *
 * @param category - The name or slug of the category
 * @param subCategory - Optional subcategory filter
 * @returns Array of posts belonging to the specified category
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

/**
 * Retrieves all posts created by a customer identified by their profile slug.
 *
 * @param slug - Customer profile slug
 * @returns Array of posts belonging to the customer
 */
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

/**
 * Toggles like status on a post for the authenticated user.
 *
 * @param postId - ID of the post to like or unlike
 * @returns Server response data after toggling like
 * @throws Error if the request fails
 */
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

/**
 * Submits a rating and comment review for a post.
 *
 * @param postId - ID of the post being reviewed
 * @param review - Review payload containing userId, rating (1-5), and comment text
 * @returns Server response data, or empty array on error
 */
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

/**
 * Increments the view count of a post.
 *
 * @param postId - ID of the post whose view count is being incremented
 * @returns Server response data with updated view metrics
 */
export const incrementViewCount = async (postId: string) => {
    try {
        const result = await api.patch(`/posts/${postId}/increment-views`);

        return result.data;
    } catch (error) {
        console.error('Failed to increment view count:', error);
    }
};

/**
 * Retrieves all posts currently awaiting admin review and approval.
 *
 * @returns Server response data containing pending posts
 */
export const getPendingPosts = async () => {
    try {
        const response = await api('/posts/pending');
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

/**
 * Approves a pending post, publishing it to the platform (admin only).
 *
 * @param postId - ID of the post to approve
 * @returns Server response data confirming approval
 * @throws Error if approval fails
 */
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

/**
 * Rejects a pending post (admin only).
 *
 * @param postId - ID of the post to reject
 * @returns Server response data confirming rejection
 * @throws Error if rejection fails
 */
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
