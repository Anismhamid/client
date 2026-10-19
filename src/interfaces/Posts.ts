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

export type SellerUser = {
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

// export interface Posts {
//     featured: boolean;

//     _id?: string;

//     createdAt?: Date | string;

//     updatedAt?: Date | string;

//     location: string;

//     likes?: string[];

//     isNew?: boolean;

//     type?: string;

//     seller?: SellerUser;

//     product_name: string;

//     category: CategoryValue;

//     subcategory?: string;

//     brand?: string;

//     year?: number;

//     fuel?: string;

//     mileage?: number;

//     color?: string;

//     price: number;

//     description: string;

//     views?: number;

//     image: {
//         url: string;
//         publicId: string;
//     };

//     sale: boolean;
//     discount: number;

//     reviews?: Review[];

//     in_stock: boolean;

//     status?: 'pending' | 'accepted' | 'rejected' | 'sold';
// }

export interface Posts {
    featured: boolean;
    _id?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    location: string;
    likes?: string[];
    isNew?: boolean;
    type?: string;
    seller?: SellerUser;
    product_name: string;
    category: CategoryValue;
    subcategory?: string;

    // الحقول الأساسية
    brand?: string;
    year?: number;
    fuel?: string;
    mileage?: number;
    color?: string;
    price: number;
    description: string;
    views?: number;
    image: {
        url: string;
        publicId: string;
    };
    sale: boolean;
    discount: number;
    reviews?: Review[];
    in_stock: boolean;
    status?: 'pending' | 'accepted' | 'rejected' | 'sold';

    // ✅ حقول الخدمات (Services)
    serviceTitle?: string;
    providerName?: string;
    experienceYears?: number;
    priceFrom?: number;
    priceTo?: number;
    pricingType?: 'hourly' | 'fixed' | 'daily' | 'monthly' | 'negotiable';
    availableDays?: string[];
    availableHours?: string;
    serviceArea?: string;
    emergencyService?: boolean;

    // ✅ حقول الكاميرات (Cameras)
    cameraType?: string;
    sensorType?: string;
    megapixels?: number;
    resolution?: string;
    videoResolution?: string;
    lensMount?: string;
    focalLength?: string;
    warranty?: string;
    includedAccessories?: string[];

    // ✅ حقول الكتب (Books)
    title?: string;
    author?: string;
    publisher?: string;
    edition?: string;
    publicationYear?: number;
    language?: string;
    isbn?: string;

    // ✅ حقول الآلات الموسيقية (MusicalInstruments)
    // (يمكن استخدام brand, model, material, color, size, electric, condition, accessories)

    // ✅ حقول المعدات (ConstructionEquipment, IndustrialEquipment, ...)
    model?: string;
    operatingHours?: number;
    enginePower?: number;
    fuelType?: string;
    weight?: number;
    power?: number;
    voltage?: number;
    capacity?: number;
    amperage?: number;
    weldingType?: string;
    connectivity?: string;
    printTechnology?: string;
    colorPrinting?: boolean;
}

export const initialProductValue: Partial<Posts> = {
    // location: '',
    featured: false,
    views: 0,
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
