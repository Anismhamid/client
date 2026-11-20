import api from './api';
import { FeaturedAd } from '../interfaces/featuredAd';

const BASE_URL = '/featured-ads';

// جلب إعلانات الصفحة الرئيسية
export const getHomepageAds = async (): Promise<FeaturedAd[]> => {
    const { data } = await api.get<FeaturedAd[]>(
        `${BASE_URL}/homepage`,
    );
    return data;
};

// جلب الإعلانات المميزة
export const getHighlightAds = async (): Promise<FeaturedAd[]> => {
    const { data } = await api.get<FeaturedAd[]>(
        `${BASE_URL}/highlight`,
    );
    return data;
};

// جلب إعلانات أعلى البحث حسب الفئة
export const getTopAds = async (
    category: string,
): Promise<FeaturedAd[]> => {
    const { data } = await api.get<FeaturedAd[]>(
        `${BASE_URL}/top`,
        {
            params: { category },
        },
    );

    return data;
};

// جلب جميع الإعلانات الترويجية
export const getAllFeaturedAds = async (): Promise<FeaturedAd[]> => {
    const { data } = await api.get<FeaturedAd[]>(
        `${BASE_URL}/all`,
    );
    return data;
};