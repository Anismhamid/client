/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { Posts } from '../interfaces/Posts';
import { showError } from '../atoms/toasts/ReactToast';

const api = `${import.meta.env.VITE_API_URL}`;

/**
 * Gets a specific post by name
 * @param postName - The name of the post to fetch
 * @returns The post data if found, or null if there's an error or post not found
 */
export const getPostById = async (post_id: string) => {
    try {
        const post = await axios.get(`${api}/posts/spicific/${post_id}`, {
            headers: { Authorization: localStorage.getItem('token') },
        });
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

        const response = await axios.get(
            `${api}/posts/related-posts/${category}?${params.toString()}`,
        );

        return response.data || [];
    } catch (error) {
        console.error(error);
        return [];
    }
};

// نسخة متقدمة مع فلترة وترتيب
export const getRelatedPostssAdvanced = async (
    category: string,
    currentProductId?: string,
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
            category: category,
            limit: (options?.limit || 4).toString(),
            ...(options?.sortBy && { sortBy: options.sortBy }),
            ...(options?.sortOrder && { sortOrder: options.sortOrder }),
            ...(options?.minPrice && { minPrice: options.minPrice.toString() }),
            ...(options?.maxPrice && { maxPrice: options.maxPrice.toString() }),
            ...(currentProductId && { excludeId: currentProductId }),
        });

        const response = await axios.get(
            `${api}/products/related?${params.toString()}`,
        );

        return response.data?.products || response.data?.data || [];
    } catch (error) {
        console.error('Error in getRelatedProductsAdvanced:', error);
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
        const post = await axios.put(`${api}/Posts/${postId}`, updatedPost, {
            headers: {
                Authorization: localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
        });
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
        const response = await axios.get(`${api}/posts`);
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
        const response = await axios.post(`${api}/posts`, post, {
            headers: {
                Authorization: localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
        });

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
        const response = await axios.get(`${api}/discounts`);
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
        const response = await axios.delete(`${api}/posts/${postId}`, {
            headers: {
                Authorization: localStorage.getItem('token'),
            },
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Delete post error:', {
                status: error.response?.status,
                message: error.response?.data || error.message,
                postId,
            });
            throw new Error(error.response?.data || error.message);
        }
        throw error;
    }
}

/**
 * Get posts by category name
 * @param category - The name of the category to fetch posts for
 * @returns Array of posts if successful, or an empty array if there's an error
 */
export const getpostsByCategory = async (category: string) => {
    try {
        const response = await axios.get(`${api}/posts/${category}`);
        return response.data;
    } catch (error) {
        console.log(error);

        return [];
    }
};

export const getCustomerProfilePostsBySlug = async (
    slug: string,
): Promise<Posts[]> => {
    try {
        const res = await axios.get(`${api}/posts/customer/${slug}`);
        return res.data;
    } catch (err) {
        console.log(err);

        return [];
    }
};

export const toggleLike = async (postId: string) => {
    const token = localStorage.getItem('token');
    try {
        const res = await axios.patch(
            `${api}/posts/${postId}/like`,
            {},
            {
                headers: { Authorization: token },
            },
        );
        return res.data; // { liked: true/false, totalLikes: number }
    } catch (error) {
        console.log(error);

        return [];
    }
};
