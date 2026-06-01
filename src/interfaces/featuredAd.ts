export interface ListingRef {
    likes: never[];
    createdAt: string;
    seller: null;
    sale: boolean;
    description: string;
    _id: string;
    product_name: string;
    category?: string;
    location?: string;
    price?: number;
    image?: { url: string; alt: string };
}

export type AdType = 'homepage' | 'top' | 'highlight';

export interface FeaturedAd {
    _id: string;
    listingId: ListingRef | null;
    userId: string;
    type: AdType;
    startDate: string;
    endDate: string;
    isActive: boolean;
    paid: boolean;
    image: { url: string; alt: string };
    stripeSessionId?: string;
    createdAt?: string;
    updatedAt?: string;
}
