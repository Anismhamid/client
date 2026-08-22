import {
    useEffect,
    useRef,
    useState,
    useCallback,
} from 'react';

import {
    getAllPosts,
    getpostsByCategory,
} from '../services/postsServices';

import { Posts } from '../interfaces/Posts';

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

const isApiError = (error: unknown): error is ApiError => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
    );
};

export const usePosts = (category?: string) => {
    const [posts, setPosts] = useState<Posts[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const isMounted = useRef(true);

    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = category
                ? await getpostsByCategory(category)
                : await getAllPosts();

            if (isMounted.current) {
                setPosts(data);
            }
        } catch (err: unknown) {
            console.error(err);

            if (isMounted.current) {
                let errorMessage = 'Failed to load posts';

                if (isApiError(err)) {
                    errorMessage =
                        err.response?.data?.message ||
                        errorMessage;
                }

                setError(errorMessage);
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    }, [category]);

    useEffect(() => {
        isMounted.current = true;

        fetchPosts();

        return () => {
            isMounted.current = false;
        };
    }, [fetchPosts]);

    const refetch = useCallback(() => {
        fetchPosts();
    }, [fetchPosts]);

    return {
        posts,
        setPosts,
        error,
        loading,
        refetch,
    };
};