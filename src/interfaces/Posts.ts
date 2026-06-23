import { CategoryValue } from './postLogicMap';

/**
 * Products interface
 */

type Review = {
    createdAt: Date | string;
    user: {
        _id: string;
        name: {
            first: string;
            last: string;
        };
        image: string;
    };
    rating: number;
    comment: string;
};

type SellerUser = {
    _id?: string;
    slug?: string;

    name?: {
        first: string;
        last: string;
    };

    image?: {
        url: string;
        alt: string;
    };
};

export interface Posts {
    featured: boolean;
    _id?: string;
    createdAt: Date | string;
    updatedAt?: Date | string;
    location: string;
    likes?: string[];
    isNew?: boolean;
    type?: string;
    seller?: SellerUser;

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

    image: {
        url: string;
        publicId: string;
    };

    sale: boolean;
    discount: number;

    reviews?: Review[];

    in_stock: boolean;
}

export const initialProductValue: Partial<Posts> = {
    location: 'אום אל פחם',
    featured: false,
    seller: {
        _id: '',
        slug: '',
        name: {
            first: '',
            last: '',
        },
        image: {
            url: '',
            alt: '',
        },
    },

    product_name: '',
    category: 'House',
    subcategory: '',

    price: 0,
    description: '',

    image: {
        url: '',
        publicId: '',
    },

    sale: false,
    discount: 0,

    likes: [],
    in_stock: true,
};
