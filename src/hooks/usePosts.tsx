// shared/hooks/usePosts.ts
import { useEffect, useRef, useState, useCallback } from "react";
import { getAllPosts } from "../services/postsServices";
import { Posts } from "../interfaces/Posts";

export const usePosts = () => {
	const [posts, setPosts] = useState<Posts[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const isMounted = useRef(true);

	const fetchPosts = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const data = await getAllPosts();

			if (isMounted.current) {
				setPosts(data);
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			console.error(err);

			if (isMounted.current) {
				setError(err?.response?.data?.message || "Failed to load posts");
			}
		} finally {
			if (isMounted.current) {
				setLoading(false);
			}
		}
	}, []);

	useEffect(() => {
		isMounted.current = true;

		fetchPosts();

		return () => {
			isMounted.current = false;
		};
	}, [fetchPosts]);

	// 🔥 refetch function
	const refetch = () => {
		fetchPosts();
	};

	return {
		posts,
		error,
		loading,
		refetch,
	};
};
