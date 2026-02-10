import {useEffect, useState} from "react";
import {getAllProducts} from "../services/postsServices";
import {Products} from "../interfaces/Posts";

const useProducts = () => {
	const [products, setProducts] = useState<Products[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		const fetchProducts = async () => {
			try {
				const data = await getAllProducts();
				if (isMounted) setProducts(data);
			} catch (err) {
				console.error(err);
				if (isMounted) setError("Failed to load products");
			}
		};

		fetchProducts();

		return () => {
			isMounted = false;
		};
	}, []);

	return {products, error};
};

export default useProducts;
