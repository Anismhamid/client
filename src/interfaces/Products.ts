import {CategoryValue} from "../atoms/productsManage/productLogicMap";

/**
 * Products interface
 */
export interface Products {
	location: string;
	likes?: string[];
	isNew?: boolean;
	_id?: string;
	seller?: {name: string; slug?: string; user: string};
	product_name: string;
	category: CategoryValue;
	subcategory?: string;
	brand?: string;
	year?: string;
	fuel?: string;
	mileage?: number;
	color?: string;
	price: number;
	description: string;
	image: {url: string; publicId: string};
	sale: boolean;
	discount: number;
	rating?: number;
	reviews?: {rating: number}[];
	in_stock: boolean;

	[key: string]: any;
}

export const initialProductValue: Partial<Products> = {
	seller: {name: "", slug: "", user: ""},
	product_name: "",
	category: "House",
	subcategory: "",
	price: 0,
	description: "",
	image: {url: "", publicId: ""},
	sale: false,
	discount: 0,
	rating: 0,
	likes: [],
	in_stock: true,
	reviewCount: 0,
	location: "אום אל פחם",
};
