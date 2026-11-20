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
        getHomepageAds()
            .then(setHomePageAds)
            .catch((err) => {
                console.error('Error fetching homepage ads:', err);
            })
            .finally(() => setLoading(false));
    }, []);

    return { homePageAds, loading };
};

// Highlight
export const useHighlightAds = () => {
    const [ads, setAds] = useState<FeaturedAd[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getHighlightAds()
            .then(setAds)
            .catch((err) => {
                console.error('Error fetching highlight ads:', err);
                setError('حدث خطأ في تحميل الإعلانات المميزة');
            })
            .finally(() => setLoading(false));
    }, []);

    return { ads, loading, error };
};

// Top
export const useTopAds = (category?: string) => {
    const [ads, setAds] = useState<FeaturedAd[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!category?.trim()) {
            setAds([]);
            setLoading(false);
            setError(null);
            return;
        }

        let cancelled = false;

        setLoading(true);
        setError(null);

        getTopAds(category)
            .then((data) => {
                if (!cancelled) {
                    setAds(data);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    console.error('Error fetching top ads:', err);
                    setError('حدث خطأ في تحميل إعلانات أعلى البحث');
                    setAds([]);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [category]);

    return { ads, loading, error };
};

// All Featured Ads
export const useAllFeaturedAds = () => {
    const [ads, setAds] = useState<FeaturedAd[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getAllFeaturedAds()
            .then(setAds)
            .catch((err) => {
                console.error('Error fetching featured ads:', err);
                setError('حدث خطأ في تحميل الإعلانات');
                setAds([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return { ads, loading, error };
};