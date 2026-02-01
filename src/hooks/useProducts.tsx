import {useEffect, useState} from "react";
import {getAllProducts} from "../services/productsServices";
import {Products} from "../interfaces/Products";

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
