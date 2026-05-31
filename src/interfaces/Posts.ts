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
    _id: string;
    name: {
        first: string;
        last: string;
    };
    image?: {
        url: string;
    };
};

type Seller = {
    name?: string;
    slug?: string;
    user: SellerUser;
};

// export interface Posts {
//     location: string;
//     likes?: string[];
//     isNew?: boolean;
//     _id?: string;

//     seller: Seller;

//     product_name: string;
//     category: CategoryValue;
//     subcategory?: string;
//     brand?: string;
//     year?: string;
//     fuel?: string;
//     mileage?: number;
//     color?: string;

//     price: number;
//     description: string;

//     image: {
//         url: string;
//         publicId: string;
//     };

//     sale: boolean;
//     discount: number;

//     reviews?: Review[];

//     in_stock: boolean;
//     userData?: User;

//     [key: string]:
//         | string
//         | number
//         | boolean
//         | string[]
//         | User
//         | undefined
//         | {
//               name?: string;
//               slug?: string;
//               user: {
//                   _id?: string;
//                   name: { first: string; last: string };
//                   image: { url: string };
//               };
//           }
//         | {
//               url: string;
//               publicId: string;
//           }
//         | {
//               createdAt: Date | string;
//               user: User | string | object;
//               rating: number;
//               comment: string;
//           }[];
// }

export interface Posts {
    _id?: string;
    createdAt: Date | string;
    location: string;
    likes?: string[];
    isNew?: boolean;
    type?: string;
    seller: Seller;

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

    seller: {
        name: '',
        slug: '',
        user: {
            _id: '',
            name: {
                first: '',
                last: '',
            },
            image: { url: '' },
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
