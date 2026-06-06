import { useState, useCallback, useEffect, useRef } from 'react';
import { getAllUsers } from '../../../services/usersServices';
import { getAllPosts } from '../../../services/postsServices';
import { Posts } from '../../../interfaces/Posts';
import { User } from '../../../interfaces/chat/usersMessages';
import {
    Statistics,
    AuthValues,
    PostWithUser,
    calculateStatistics,
    filterPostsByTimeFrame,
} from './statisticsUtils';

const INITIAL_STATISTICS: Statistics = {
    totalProducts: 0, activeProducts: 0, soldPosts: 0,
    newProductsToday: 0, newProductsMonth: 0, onlineUsers: 0,
    totalUsers: 0, newUsersToday: 0, newUsersMonth: 0,
    activeSellers: 0, totalAdmins: 0, totalModerators: 0, totalClients: 0,
    totalLikes: 0, totalViews: 0, averageLikesPerProduct: 0,
    averageViewsPerProduct: 0, totalProductValue: 0, averageProductPrice: 0,
    highestPricedProduct: 0, lowestPricedProduct: 0, totalDiscountValue: 0,
    productsByCategory: [], topCategories: [], mostPopularProducts: [],
    topSellers: [], productsByDate: [],
};

// Auto-refresh every 5 minutes
const AUTO_REFRESH_MS = 5 * 60 * 1000;

export const useAdminDashboard = (role: string) => {
    const [timeFrame, setTimeFrame] = useState<'today' | 'month' | 'all'>('month');
    const [statistics, setStatistics] = useState<Statistics>(INITIAL_STATISTICS);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // Store raw data so timeFrame changes don't need a new API call
    const rawDataRef = useRef<{
        users: AuthValues[];
        posts: PostWithUser[];
    } | null>(null);

    const applyTimeFrame = useCallback(
        (frame: 'today' | 'month' | 'all') => {
            if (!rawDataRef.current) return;
            const { users, posts } = rawDataRef.current;
            const filtered = filterPostsByTimeFrame(posts, frame);
            setStatistics(calculateStatistics(users, filtered));
        },
        [],
    );

    const fetchData = useCallback(async (isRefresh = false): Promise<void> => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        setError(null);

        try {
            const [usersRes, productsRes] = await Promise.all([
                getAllUsers(),
                getAllPosts(),
            ]);

            const users = (usersRes as AuthValues[]) ?? [];
            const rawPosts = (productsRes as Posts[]) ?? [];

            const posts: PostWithUser[] = rawPosts
                .filter((p) => p?.seller)
                .map((post) => ({
                    ...post,
                    userData: users.find(
                        (u) => u._id === post.seller?.user?._id,
                    ) as User,
                }));

            rawDataRef.current = { users, posts };

            const filtered = filterPostsByTimeFrame(posts, timeFrame);
            setStatistics(calculateStatistics(users, filtered));
            setLastUpdated(new Date());
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('فشل تحميل البيانات. يرجى المحاولة مرة أخرى');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [timeFrame]);

    // Initial load
    useEffect(() => {
        if (role !== 'Admin' && role !== 'Moderator') return;
        fetchData();
    }, [role, fetchData]);

    // Re-filter when timeFrame changes (no API call)
    useEffect(() => {
        if (!rawDataRef.current) return;
        applyTimeFrame(timeFrame);
    }, [timeFrame, applyTimeFrame]);

    // Auto-refresh every 5 minutes
    useEffect(() => {
        if (role !== 'Admin' && role !== 'Moderator') return;
        const interval = setInterval(() => fetchData(true), AUTO_REFRESH_MS);
        return () => clearInterval(interval);
    }, [role, fetchData]);

    const handleRefresh = () => fetchData(true);
    const handleTimeFrameChange = (frame: 'today' | 'month' | 'all') =>
        setTimeFrame(frame);

    return {
        timeFrame,
        statistics,
        loading,
        refreshing,
        error,
        lastUpdated,
        handleRefresh,
        handleTimeFrameChange,
    };
};
