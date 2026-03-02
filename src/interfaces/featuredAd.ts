export interface FeaturedAd {
	_id: string;
	listingId: {_id: string; title: string}; // populate
	userId: string;
	type: "homepage" | "top" | "highlight";
	startDate: string;
	endDate: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}
