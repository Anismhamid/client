// hooks/useFeaturedAds.ts (new file)
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FeaturedAd } from '../../interfaces/featuredAd';

const api = `${import.meta.env.VITE_API_URL}/featured-ads`;

export const useHomePageAds = () => {
    const [homePageAds, setHomePageAds] = useState<FeaturedAd[]>([]); // ← FeaturedAd[]
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${api}/homepage`)
            .then(({ data }) => {
                setHomePageAds(data.ads ?? []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return { homePageAds, loading };
};

export const useHighlightAds = () => {
    const [ads, setAds] = useState<FeaturedAd[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios
            .get(`${api}/highlight`)
            .then(({ data }) => {
                setAds(data.ads ?? []);
                setError(null);
            })
            .catch((err) => {
                console.error(err);
                setError('حدث خطأ في تحميل الإعلانات المميزة جداً');
            })
            .finally(() => setLoading(false));
    }, []);

    return { ads, loading, error };
};

// Hook for top ads
export const useTopAds = () => {
    const [ads, setAds] = useState<FeaturedAd[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios
            .get(`${api}/top`)
            .then(({ data }) => {
                setAds(data.ads ?? []);
                setError(null);
            })
            .catch((err) => {
                console.error(err);
                setError('حدث خطأ في تحميل أفضل الإعلانات');
            })
            .finally(() => setLoading(false));
    }, []);

    return { ads, loading, error };
};
