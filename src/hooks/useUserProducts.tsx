// hooks/useUserProducts.ts
import {useEffect, useState} from "react";
import {getCustomerProfileProductsBySlug} from "../services/postsServices";
import {Posts} from "../interfaces/Posts";

export const useUserProducts = (slug: string) => {
	const [userProducts, setUserProducts] = useState<Posts[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!slug) return;

		const fetch = async () => {
			try {
				const products = await getCustomerProfileProductsBySlug(slug);
				setUserProducts(products);
			} catch {
				setError("Failed to load products");
			} finally {
				setLoading(false);
			}
		};

		fetch();
	}, [slug]);

	return {
		userProducts,
		loading,
		error,
	};
};
