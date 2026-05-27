export interface FeaturedAd {
	_id: string;
	listingId: {_id: string; product_name: string, price?: number};
	userId: string;
	type: "homepage" | "top" | "highlight";
	startDate: string;
	endDate: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}
