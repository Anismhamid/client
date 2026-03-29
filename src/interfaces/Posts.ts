import {CategoryValue} from "../atoms/productsManage/postLogicMap";
import {User} from "./usersMessages";

/**
 * Products interface
 */
export interface Posts {
	location: string;
	likes?: string[];
	isNew?: boolean;
	_id?: string;
	seller?: {name?: string; slug?: string; user: string; imageUrl: string};
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
	userData?: User;

	[key: string]: string | number | boolean | string[] | {name?: string; slug?: string; user: string; imageUrl: string} | {url: string; publicId: string} | {rating: number}[] | User | undefined;
}

export const initialProductValue: Partial<Posts> = {
	seller: {
		name: "",
		slug: "",
		user: "",
		imageUrl:
			"https://res.cloudinary.com/drxqielit/image/upload/v1771561611/475507246_1070716745087366_3353853525796400233_n_ef97vj.jpg",
	},
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
