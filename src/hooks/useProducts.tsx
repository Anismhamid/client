// shared/hooks/useProducts.ts
import {useEffect, useRef, useState, useCallback} from "react";
import {getAllProducts} from "../services/postsServices";
import {Products} from "../interfaces/Posts";

export const useProducts = () => {
	const [products, setProducts] = useState<Products[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	const isMounted = useRef(true);

	const fetchProducts = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const data = await getAllProducts();

			if (isMounted.current) {
				setProducts(data);
			}
		} catch (err: any) {
			console.error(err);

			if (isMounted.current) {
				setError(err?.response?.data?.message || "Failed to load products");
			}
		} finally {
			if (isMounted.current) {
				setLoading(false);
			}
		}
	}, []);

	useEffect(() => {
		isMounted.current = true;

		fetchProducts();

		return () => {
			isMounted.current = false;
		};
	}, [fetchProducts]);

	// 🔥 refetch function
	const refetch = () => {
		fetchProducts();
	};

	return {
		products,
		error,
		loading,
		refetch,
	};
};
