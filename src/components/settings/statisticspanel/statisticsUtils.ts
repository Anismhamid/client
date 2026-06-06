import { Posts } from '../../../interfaces/Posts';
import { User } from '../../../interfaces/chat/usersMessages';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PostWithUser extends Posts {
    userData?: User;
}

export interface CategoryStats {
    category: string;
    count: number;
    percentage: number;
    totalValue: number;
}

export interface TopCategory {
    category: string;
    count: number;
    likes: number;
}

export interface MostPopularProduct {
    id: string;
    name: string;
    image?: string;
    likes: number;
    views: number;
    price: number;
    status: string;
    seller: { name: string; slug: string; user: string; link: string };
    category: string;
    createdAt: string;
}

export interface TopSeller {
    _id: string;
    name: string;
    avatar?: string;
    productsCount: number;
    totalLikes: number;
    totalViews: number;
    totalValue: number;
    role: string;
}

export interface ProductByDate {
    date: string;
    count: number;
}

export interface Statistics {
    totalProducts: number;
    activeProducts: number;
    soldPosts: number;
    newProductsToday: number;
    newProductsMonth: number;
    onlineUsers: number;
    totalUsers: number;
    newUsersToday: number;
    newUsersMonth: number;
    activeSellers: number;
    totalAdmins: number;
    totalModerators: number;
    totalClients: number;
    totalLikes: number;
    totalViews: number;
    averageLikesPerProduct: number;
    averageViewsPerProduct: number;
    totalProductValue: number;
    averageProductPrice: number;
    highestPricedProduct: number;
    lowestPricedProduct: number;
    totalDiscountValue: number;
    productsByCategory: CategoryStats[];
    topCategories: TopCategory[];
    mostPopularProducts: MostPopularProduct[];
    topSellers: TopSeller[];
    productsByDate: ProductByDate[];
}

export interface AuthValues {
    role: string;
    name?: { first: string; last: string };
    status?: boolean;
    createdAt?: string;
    _id?: string;
    image?: { url?: string };
}

interface SellerData {
    productsCount: number;
    totalLikes: number;
    totalViews: number;
    totalValue: number;
    user: User;
}

interface CategoryData {
    count: number;
    likes: number;
    totalValue: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const getViewsAsNumber = (views: unknown): number => {
    if (typeof views === 'number') return views;
    if (typeof views === 'string') return parseInt(views, 10) || 0;
    if (Array.isArray(views)) return views.length;
    return 0;
};

export const getCreatedAtAsString = (createdAt: unknown): string => {
    if (typeof createdAt === 'string') return createdAt;
    if (createdAt instanceof Date) return createdAt.toISOString();
    return new Date().toISOString();
};

export const CATEGORY_NAMES: Record<string, string> = {
    House: 'بيت',
    Garden: 'حديقة',
    Cars: 'سيارات',
    Bikes: 'دراجات',
    Trucks: 'شاحنات',
    ElectricVehicles: 'مركبات كهربائية',
    MenClothes: 'ملابس رجالية',
    WomenClothes: 'ملابس نسائية',
    Baby: 'أطفال',
    Kids: 'ألعاب',
    Health: 'صحة',
    Beauty: 'جمال',
    Watches: 'ساعات',
    Cleaning: 'تنظيف',
};

export const getCategoryName = (category: string): string =>
    CATEGORY_NAMES[category] ?? category;

export const CHART_COLORS = [
    '#6366F1',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#EC4899',
    '#06B6D4',
    '#84CC16',
];

// ─── Filter posts by timeframe ────────────────────────────────────────────────

export const filterPostsByTimeFrame = (
    posts: PostWithUser[],
    timeFrame: 'today' | 'month' | 'all',
): PostWithUser[] => {
    if (timeFrame === 'all') return posts;

    const now = new Date();
    const cutoff =
        timeFrame === 'today'
            ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
            : new Date(now.getFullYear(), now.getMonth(), 1);

    return posts.filter((post) => {
        if (!post.createdAt) return false;
        return new Date(getCreatedAtAsString(post.createdAt)) >= cutoff;
    });
};

// ─── Main calculation (pure function, outside component) ──────────────────────

export const calculateStatistics = (
    users: AuthValues[],
    posts: PostWithUser[],
): Statistics => {
    const now = new Date();
    const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
    );
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Users
    const newUsersToday = users.filter((u) =>
        u.createdAt ? new Date(u.createdAt) >= todayStart : false,
    ).length;

    const newUsersMonth = users.filter((u) =>
        u.createdAt ? new Date(u.createdAt) >= monthStart : false,
    ).length;

    const totalAdmins = users.filter((u) => u.role === 'Admin').length;
    const totalModerators = users.filter((u) => u.role === 'Moderator').length;
    const totalClients = users.filter((u) => u.role === 'Client').length;
    const onlineUsers = users.filter((u) => u.status === true).length;

    // Posts timing
    const newPostsToday = posts.filter((p) =>
        p.createdAt
            ? new Date(getCreatedAtAsString(p.createdAt)) >= todayStart
            : false,
    ).length;

    const newPostsMonth = posts.filter((p) =>
        p.createdAt
            ? new Date(getCreatedAtAsString(p.createdAt)) >= monthStart
            : false,
    ).length;

    const activePosts = posts.filter((p) => p.in_stock === true).length;
    const soldPosts = posts.filter((p) => p.in_stock === false).length;

    // Sellers map
    const sellersMap = new Map<string, SellerData>();
    posts.forEach((post) => {
        const sellerId = post.seller?.user?._id;
        if (!sellerId || !post.userData) return;

        const existing = sellersMap.get(sellerId);
        sellersMap.set(sellerId, {
            productsCount: (existing?.productsCount ?? 0) + 1,
            totalLikes: (existing?.totalLikes ?? 0) + (post.likes?.length ?? 0),
            totalViews:
                (existing?.totalViews ?? 0) + (post.reviews?.length ?? 0),
            totalValue: (existing?.totalValue ?? 0) + (post.price ?? 0),
            user: post.userData,
        });
    });

    // Engagement
    const totalLikes = posts.reduce((s, p) => s + (p.likes?.length ?? 0), 0);
    const totalViews = posts.reduce(
        (s, p) => s + getViewsAsNumber(p.reviews),
        0,
    );
    const averageLikesPerProduct =
        posts.length > 0
            ? Math.round((totalLikes / posts.length) * 10) / 10
            : 0;
    const averageViewsPerProduct =
        posts.length > 0
            ? Math.round((totalViews / posts.length) * 10) / 10
            : 0;

    // Pricing
    const prices = posts.map((p) => p.price ?? 0);
    const totalProductValue = prices.reduce((s, p) => s + p, 0);
    const averageProductPrice =
        posts.length > 0 ? Math.round(totalProductValue / posts.length) : 0;
    const highestPricedProduct = prices.length > 0 ? Math.max(...prices) : 0;
    const lowestPricedProduct =
        prices.length > 0 ? Math.min(...prices.filter((p) => p > 0)) : 0;

    const totalDiscountValue = posts.reduce((s, p) => {
        if (p.sale && p.discount && p.price)
            return s + (p.price * p.discount) / 100;
        return s;
    }, 0);

    // Categories
    const categoryMap = new Map<string, CategoryData>();
    posts.forEach((post) => {
        if (!post.category) return;
        const existing = categoryMap.get(post.category);
        categoryMap.set(post.category, {
            count: (existing?.count ?? 0) + 1,
            likes: (existing?.likes ?? 0) + (post.likes?.length ?? 0),
            totalValue: (existing?.totalValue ?? 0) + (post.price ?? 0),
        });
    });

    const total = posts.length || 1;
    const productsByCategory: CategoryStats[] = Array.from(
        categoryMap.entries(),
    )
        .map(([category, data]) => ({
            category,
            count: data.count,
            percentage: (data.count / total) * 100,
            totalValue: data.totalValue,
        }))
        .sort((a, b) => b.count - a.count);

    const topCategories: TopCategory[] = Array.from(categoryMap.entries())
        .map(([category, data]) => ({
            category,
            count: data.count,
            likes: data.likes,
        }))
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5);

    // Popular products
    const mostPopularProducts: MostPopularProduct[] = [...posts]
        .map((post) => ({
            id: post._id ?? '',
            name: post.product_name ?? 'منتج بدون اسم',
            image: post.image?.url,
            likes: post.likes?.length ?? 0,
            views: post.reviews?.length ?? 0,
            price: post.price ?? 0,
            status: post.in_stock ? 'active' : 'sold',
            seller: {
                name:
                    post.seller?.name ||
                    `${post.userData?.name?.first ?? ''} ${post.userData?.name?.last ?? ''}`.trim() ||
                    'بائع غير معروف',
                link: `/customer-profile/${post.seller?.user?.slug ?? ''}`,
                slug: post.seller?.user?.slug ?? '',
                user: post.seller?.user?.user ?? '',
            },
            category: post.category ?? 'غير مصنف',
            createdAt: getCreatedAtAsString(post.createdAt),
        }))
        .sort((a, b) => b.likes * 2 + b.views - (a.likes * 2 + a.views))
        .slice(0, 10);

    // Top sellers
    const topSellers: TopSeller[] = Array.from(sellersMap.entries())
        .map(([userId, data]) => ({
            _id: userId,
            name: `${data.user.name?.first ?? 'مستخدم'} ${data.user.name?.last ?? ''}`.trim(),
            avatar: data.user.image?.url,
            productsCount: data.productsCount,
            totalLikes: data.totalLikes,
            totalViews: data.totalViews,
            totalValue: data.totalValue,
            role: data.user.role ?? 'Client',
        }))
        .sort((a, b) =>
            b.productsCount !== a.productsCount
                ? b.productsCount - a.productsCount
                : b.totalLikes + b.totalViews - (a.totalLikes + a.totalViews),
        )
        .slice(0, 10);

    // Products by date (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const productsByDate: ProductByDate[] = last7Days.map((date) => ({
        date,
        count: posts.filter((post) => {
            if (!post.createdAt) return false;
            return (
                new Date(getCreatedAtAsString(post.createdAt))
                    .toISOString()
                    .split('T')[0] === date
            );
        }).length,
    }));

    return {
        totalProducts: posts.length,
        activeProducts: activePosts,
        soldPosts,
        newProductsToday: newPostsToday,
        newProductsMonth: newPostsMonth,
        onlineUsers,
        totalUsers: users.length,
        newUsersToday,
        newUsersMonth,
        activeSellers: sellersMap.size,
        totalAdmins,
        totalModerators,
        totalClients,
        totalLikes,
        totalViews,
        averageLikesPerProduct,
        averageViewsPerProduct,
        totalProductValue,
        averageProductPrice,
        highestPricedProduct,
        lowestPricedProduct,
        totalDiscountValue,
        productsByCategory,
        topCategories,
        mostPopularProducts,
        topSellers,
        productsByDate,
    };
};
