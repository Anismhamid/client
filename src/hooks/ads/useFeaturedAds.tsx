import { useEffect, useState } from 'react';
import { FeaturedAd } from '../../interfaces/featuredAd';

import {
    getHomepageAds,
    getHighlightAds,
    getTopAds,
    getAllFeaturedAds,
} from '../../services/featuredAdsServices';

// Homepage
export const useHomePageAds = () => {
    const [homePageAds, setHomePageAds] = useState<FeaturedAd[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        getHomepageAds()
            .then((data) => {
                if (!cancelled) setHomePageAds(data);
            })
            .catch((err) => {
                if (!cancelled) {
                    console.error('Error fetching homepage ads:', err);
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return { homePageAds, loading };
};

// Highlight
export const useHighlightAds = () => {
    const [ads, setAds] = useState<FeaturedAd[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        getHighlightAds()
            .then((data) => {
                if (!cancelled) setAds(data);
            })
            .catch((err) => {
                if (!cancelled) {
                    console.error('Error fetching highlight ads:', err);
                    setError('حدث خطأ في تحميل الإعلانات المميزة');
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return { ads, loading, error };
};

// Top
export const useTopAds = (category?: string) => {
    const [result, setResult] = useState<{
        category: string;
        ads: FeaturedAd[];
        error: string | null;
    }>({
        category: '',
        ads: [],
        error: null,
    });

    const normalizedCategory = category?.trim() || '';

    useEffect(() => {
        if (!normalizedCategory) return;

        let cancelled = false;

        Promise.resolve()
            .then(() => getTopAds(normalizedCategory))
            .then((data) => {
                if (!cancelled) {
                    setResult({
                        category: normalizedCategory,
                        ads: data,
                        error: null,
                    });
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    console.error('Error fetching top ads:', err);

                    setResult({
                        category: normalizedCategory,
                        ads: [],
                        error: 'حدث خطأ في تحميل إعلانات أعلى البحث',
                    });
                }
            });

        return () => {
            cancelled = true;
        };
    }, [normalizedCategory]);

    const isCurrentCategory =
        result.category === normalizedCategory;

    return {
        ads: isCurrentCategory && normalizedCategory
            ? result.ads
            : [],

        loading: Boolean(normalizedCategory) && !isCurrentCategory,

        error: isCurrentCategory && normalizedCategory
            ? result.error
            : null,
    };
};

// All Featured Ads
export const useAllFeaturedAds = () => {
    const [ads, setAds] = useState<FeaturedAd[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        getAllFeaturedAds()
            .then((data) => {
                if (!cancelled) setAds(data);
            })
            .catch((err) => {
                if (!cancelled) {
                    console.error('Error fetching featured ads:', err);
                    setError('حدث خطأ في تحميل الإعلانات');
                    setAds([]);
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return { ads, loading, error };
};