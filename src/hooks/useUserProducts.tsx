// hooks/useUserProducts.ts
import {useEffect, useState} from "react";
import {getCustomerProfileProductsBySlug} from "../services/postsServices";
import {Products} from "../interfaces/Posts";

export const useUserProducts = (slug: string) => {
	const [userProducts, setUserProducts] = useState<Products[]>([]);
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
