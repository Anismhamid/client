export interface ListingRef {
    _id: string;
    title: string;
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
    stripeSessionId: string;
    createdAt: string;
    updatedAt: string;
}
