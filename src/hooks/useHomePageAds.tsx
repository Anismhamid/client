// hooks/useHomePageAds.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FeaturedAd } from '../interfaces/featuredAd';  // ← غيّر الـ import

const api = `${import.meta.env.VITE_API_URL}/featured-ads`;

export const useHomePageAds = () => {
    const [homePageAds, setHomePageAds] = useState<FeaturedAd[]>([]);  // ← FeaturedAd[]
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