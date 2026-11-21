/**
 * @file usePosts.tsx
 * @description Custom React hook for fetching and managing posts with pagination,
 * category/sub-category filtering, de-duplication, and race-condition safety.
 */

import { useEffect, useRef, useState, useCallback } from 'react';

import {
    getAllPosts,
    getpostsByCategory,
} from '../services/postsServices';

import { Posts } from '../interfaces/Posts';

/**
 * Shape of an API error response for extracting descriptive error messages.
 */
interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

/**
 * Number of posts requested per paginated page.
 */
const PAGE_SIZE = 20;

/**
 * Type guard to check if an unknown error object matches the ApiError structure.
 *
 * @param error - The error object to check
 * @returns True if error has an Axios-like response object
 */
const isApiError = (error: unknown): error is ApiError => {
    return typeof error === 'object' && error !== null && 'response' in error;
};

/**
 * Custom hook to fetch and manage posts with pagination support.
 *
 * Features:
 * - Initial fetch on mount or when category/subCategory changes
 * - Sequential pagination via `loadMore` when browsing all posts
 * - Automatic post de-duplication by `_id`
 * - Race-condition prevention using monotonic request IDs
 * - Safe unmount handling via `isMounted` ref
 *
 * @param category - Optional category filter slug/name
 * @param subCategory - Optional subcategory filter slug/name
 * @returns State and actions for posts data and pagination
 *
 * @example
 * ```tsx
 * const { posts, loading, loadingMore, hasMore, loadMore, refetch } = usePosts();
 * ```
 */
export const usePosts = (category?: string, subCategory?: string) => {
    const [posts, setPosts] = useState<Posts[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const pageRef = useRef(1);
    const isMounted = useRef(false);
    const isFetchingRef = useRef(false);
    const requestIdRef = useRef(0);

    /**
     * Extracts a human-readable error message from an unknown error.
     *
     * @param err - Unknown error caught in try/catch
     * @returns A string error message
     */
    const getErrorMessage = (err: unknown): string => {
        if (isApiError(err)) {
            return err.response?.data?.message || 'Failed to load posts';
        }

        return 'Failed to load posts';
    };

    // ==========================================
    // Fetch first page
    // ==========================================

    /**
     * Fetches the first page of posts or posts for a specific category.
     * Resets page tracking and ensures only the latest request updates state.
     */
    const fetchPosts = useCallback(async () => {
        const requestId = ++requestIdRef.current;

        pageRef.current = 1;
        isFetchingRef.current = true;

        try {
            let data: Posts[];

            if (category) {
                data = await getpostsByCategory(category, subCategory);
            } else {
                data = await getAllPosts(1, PAGE_SIZE);
            }

            if (!isMounted.current || requestId !== requestIdRef.current) {
                return;
            }

            setPosts(data);
            setError(null);
            setHasMore(category ? false : data.length >= PAGE_SIZE);
        } catch (err: unknown) {
            console.error('Fetch posts error:', err);

            if (isMounted.current && requestId === requestIdRef.current) {
                setError(getErrorMessage(err));
            }
        } finally {
            if (requestId === requestIdRef.current) {
                isFetchingRef.current = false;

                if (isMounted.current) {
                    setLoading(false);
                    setLoadingMore(false);
                }
            }
        }
    }, [category, subCategory]);

    // ==========================================
    // Load more
    // ==========================================

    /**
     * Fetches the next page of posts and appends non-duplicate items to the existing list.
     * Only operational when not filtering by category and when more items are available.
     */
    const loadMore = useCallback(async () => {
        if (
            isFetchingRef.current ||
            loading ||
            loadingMore ||
            !hasMore ||
            category
        ) {
            return;
        }

        const nextPage = pageRef.current + 1;
        const requestId = requestIdRef.current;

        isFetchingRef.current = true;
        setLoadingMore(true);
        setError(null);

        try {
            const data = await getAllPosts(nextPage, PAGE_SIZE);

            if (!isMounted.current || requestId !== requestIdRef.current) {
                return;
            }

            setPosts((previousPosts) => {
                const existingIds = new Set(
                    previousPosts.map((post) => String(post._id)),
                );

                const uniquePosts = data.filter(
                    (post) => !existingIds.has(String(post._id)),
                );

                return [...previousPosts, ...uniquePosts];
            });

            pageRef.current = nextPage;
            setHasMore(data.length >= PAGE_SIZE);
        } catch (err: unknown) {
            console.error('Load more posts error:', err);

            if (isMounted.current && requestId === requestIdRef.current) {
                setError(getErrorMessage(err));
            }
        } finally {
            if (requestId === requestIdRef.current) {
                isFetchingRef.current = false;

                if (isMounted.current) {
                    setLoadingMore(false);
                }
            }
        }
    }, [loading, loadingMore, hasMore, category]);

    // ==========================================
    // Initial fetch / category change
    // ==========================================

    useEffect(() => {
        isMounted.current = true;

        // تشغيل جلب البيانات بعد انتهاء تنفيذ Effect الحالي
        // Run data fetching after completion of the current effect cycle
        Promise.resolve().then(() => {
            if (isMounted.current) {
                void fetchPosts();
            }
        });

        return () => {
            isMounted.current = false;

            requestIdRef.current += 1;
            isFetchingRef.current = false;
        };
    }, [fetchPosts]);

    // ==========================================
    // Refetch
    // ==========================================

    /**
     * Manually triggers a reload of the first page of posts.
     */
    const refetch = useCallback(() => {
        setLoading(true);
        void fetchPosts();
    }, [fetchPosts]);

    return {
        posts,
        setPosts,
        error,
        loading,
        loadingMore,
        hasMore,
        loadMore,
        refetch,
    };
};
