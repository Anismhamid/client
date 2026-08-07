// hooks/useFeaturedAds.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FeaturedAd } from '../../interfaces/featuredAd';

const api = `${import.meta.env.VITE_API_URL}/featured-ads`;

export const useHomePageAds = () => {
    const [homePageAds, setHomePageAds] = useState<FeaturedAd[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('🚀 جلب الإعلانات المميزة من:', `${api}/homepage`);

        axios
            .get(`${api}/homepage`)
            .then(({ data }) => {
                console.log('✅ بيانات الإعلانات المستلمة:', data);
                console.log('📊 عدد الإعلانات:', data.length ?? 0);
                console.log('📋 تفاصيل الإعلانات:', data);

                // تأكد من أن البيانات صحيحة
                if (data && data.length > 0) {
                    console.log('✅ تم العثور على إعلانات مميزة!');
                } else {
                    console.warn('⚠️ لا توجد إعلانات مميزة في قاعدة البيانات');
                }

                setHomePageAds(data);
            })
            .catch((err) => {
                console.error('❌ خطأ في جلب الإعلانات:', err);
                console.error(
                    '❌ تفاصيل الخطأ:',
                    err.response?.data || err.message,
                );
            })
            .finally(() => setLoading(false));
    }, []);

    return { homePageAds, loading };
};

export const useHighlightAds = () => {
    const [ads, setAds] = useState<FeaturedAd[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('🚀 جلب الإعلانات المضيئة من:', `${api}/highlight`);

        axios
            .get(`${api}/highlight`)
            .then(({ data }) => {
                console.log('✅ بيانات الإعلانات المضيئة:', data);
                setAds(data);
                setError(null);
            })
            .catch((err) => {
                console.error('❌ خطأ في تحميل الإعلانات المضيئة:', err);
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
        console.log('🚀 جلب أفضل الإعلانات من:', `${api}/top`);

        axios
            .get(`${api}/top`)
            .then(({ data }) => {
                console.log('✅ بيانات أفضل الإعلانات:', data);
                setAds(data);
                setError(null);
            })
            .catch((err) => {
                console.error('❌ خطأ في تحميل أفضل الإعلانات:', err);
                setError('حدث خطأ في تحميل أفضل الإعلانات');
            })
            .finally(() => setLoading(false));
    }, []);

    return { ads, loading, error };
};
