export type Stats = {
    totalProducts: number;
    totalLikes: number;
    totalViews: number;
    rating: number;
    reviewsCount: number;
};

export const initStats: Stats = {
    totalProducts: 0,
    totalLikes: 0,
    totalViews: 0,
    rating: 0,
    reviewsCount: 0,
};