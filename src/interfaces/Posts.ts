import { CategoryValue } from './postLogicMap';

/**
 * Products interface
 */

export type Review = {
    _id?: string;

    createdAt: Date | string;

    updatedAt?: Date | string;

    user?: SellerUser | null;

    rating?: number;

    comment: string;
};

type SellerUser = {
    _id?: string;
    id?: string;
    googleId?: string;

    name?: {
        first?: string;
        last?: string;
    };

    slug?: string;

    phone?: {
        phone_1?: string;
        phone_2?: string;
    };

    address?: {
        city?: string;
        street?: string;
        houseNumber?: string;
    };

    email?: string;

    gender?: 'male' | 'female';

    image?: {
        url?: string;
        alt?: string;
    };

    role?: 'Admin' | 'Moderator' | 'Client';

    activity?: unknown[];

    registrAt?: string;

    createdAt?: string | Date;
    updatedAt?: string | Date;

    status?: boolean;
    messageStatus?: string;

    terms?: string;

    pushTokens?: string[];
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
