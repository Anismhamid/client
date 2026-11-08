/* eslint-disable react-refresh/only-export-components */
import { FunctionComponent, ReactNode } from 'react';
import { Box, Chip, Stack, Typography, alpha } from '@mui/material';
import { Star } from '@mui/icons-material';
import { Posts } from '../../../interfaces/Posts';
import { User } from '../../../interfaces/chat/usersMessages';
import { productsPathes } from '../../../routes/routes';

/* ───────────── Tokens ───────────── */

export const BRAND_GOLD = '#B8860B';
export const BRAND_BROWN = '#8B4513';
export const BRAND_GRADIENT = `linear-gradient(135deg, ${BRAND_GOLD} 0%, ${BRAND_BROWN} 100%)`;
// نسخة أغمق للأزرار: تعطي تباين أفضل مع النص الأبيض
export const BRAND_GRADIENT_DEEP =
    'linear-gradient(135deg, #9A6F08 0%, #7A3B10 100%)';
export const INK = '#12161C';
export const SUCCESS = '#1f9d55';
export const SALE = '#c62828';
export const DISPLAY_FONT =
    "'IBM Plex Sans Arabic', 'Cairo', 'Segoe UI', Tahoma, sans-serif";

export const COVER_BACKGROUND = [
    'repeating-linear-gradient(45deg, rgba(255,255,255,.09) 0 1px, transparent 1px 16px)',
    'repeating-linear-gradient(-45deg, rgba(255,255,255,.09) 0 1px, transparent 1px 16px)',
    BRAND_GRADIENT,
].join(', ');

export const brandButtonSx = {
    fontWeight: 800,
    borderRadius: 2.5,
    py: 1.1,
    gap: 1,
    textTransform: 'none',
    color: '#fff',
    background: BRAND_GRADIENT_DEEP,
    boxShadow: `0 6px 16px ${alpha(BRAND_GOLD, 0.25)}`,
    '&:hover': {
        background: BRAND_GRADIENT_DEEP,
        boxShadow: `0 8px 22px ${alpha(BRAND_GOLD, 0.35)}`,
    },
} as const;

/* ───────────── Tabs ───────────── */

export type TabKey = 'products' | 'jobs' | 'ratings' | 'about';

/* ───────────── Helpers ───────────── */

/** 05x… → 9725x… (wa.me و tel: بدهم رقم دولي بدون 0 بالأول) */
export const toInternationalPhone = (raw?: string) => {
    const digits = (raw ?? '').replace(/\D/g, '');
    if (!digits) return '';
    if (digits.startsWith('972')) return digits;
    if (digits.startsWith('0')) return `972${digits.slice(1)}`;
    return digits;
};

// نفس صيغة الرابط المستخدمة سابقاً. إذا حوّلت لـ getPostUrl بدّل هون بس.
export const buildProductUrl = (p: Posts) =>
    `${productsPathes.postsDetails}/${p.category}/${p.brand}/${p._id}`;

export interface ReviewSummary {
    count: number;
    average: number;
    /** نسبة التقييمات 4 نجوم وأكثر */
    positiveRate: number;
    /** index 0 = 1 star … index 4 = 5 stars */
    distribution: number[];
}

export const getReviewSummary = (posts: Posts[]): ReviewSummary => {
    const distribution = [0, 0, 0, 0, 0];
    let sum = 0;
    let count = 0;
    let positive = 0;

    posts.forEach((p) =>
        p.reviews?.forEach((r) => {
            const v = Number(r.rating);
            if (Number.isFinite(v) && v >= 1 && v <= 5) {
                distribution[Math.round(v) - 1] += 1;
                sum += v;
                count += 1;
                if (v >= 4) positive += 1;
            }
        }),
    );

    return {
        count,
        average: count ? Number((sum / count).toFixed(1)) : 0,
        positiveRate: count ? Math.round((positive / count) * 100) : 0,
        distribution,
    };
};

/* ───────────── Seller level (نفس عتبات صفحة البروفايل الخاص) ───────────── */

export type LevelId = 'newcomer' | 'active' | 'trusted' | 'elite';

export interface SellerLevel {
    id: LevelId;
    fallback: string;
    color: string;
}

const calcCompletion = (u: User) => {
    const fields = [
        u.name?.first,
        u.name?.last,
        u.phone?.phone_1,
        u.address?.city,
        u.address?.street,
        u.address?.houseNumber,
        u.image?.url,
        u.gender?.toString(),
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
};

export const getSellerLevel = (
    user: User,
    postsCount: number,
    summary: ReviewSummary,
): SellerLevel => {
    const completion = calcCompletion(user);
    const { count: reviews, average: rating } = summary;

    if (postsCount >= 10 && reviews >= 10 && rating >= 4.5)
        return { id: 'elite', fallback: 'بائع مميز', color: '#B8860B' };
    if (postsCount >= 5 && reviews >= 3 && rating >= 4)
        return { id: 'trusted', fallback: 'بائع موثوق', color: SUCCESS };
    if (postsCount >= 1 && completion >= 80)
        return { id: 'active', fallback: 'بائع نشط', color: BRAND_BROWN };
    return { id: 'newcomer', fallback: 'عضو جديد', color: '#64748b' };
};

/* ───────────── UI atoms ───────────── */

/** نجوم بتعبئة جزئية — بتشتغل صح بالـ RTL */
export const StarRow: FunctionComponent<{
    value: number;
    size?: number;
    color?: string;
    emptyColor?: string;
}> = ({
    value,
    size = 16,
    color = BRAND_GOLD,
    emptyColor = 'rgba(148,163,184,.4)',
}) => (
    <Box
        role='img'
        aria-label={`${value} / 5`}
        sx={{ display: 'inline-flex', gap: '2px', verticalAlign: 'middle' }}
    >
        {[0, 1, 2, 3, 4].map((i) => {
            const fill = Math.max(0, Math.min(1, value - i));
            return (
                <Box
                    key={i}
                    sx={{
                        position: 'relative',
                        width: size,
                        height: size,
                        flexShrink: 0,
                    }}
                >
                    <Star
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            fontSize: size,
                            color: emptyColor,
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            insetBlock: 0,
                            insetInlineStart: 0,
                            width: `${fill * 100}%`,
                            overflow: 'hidden',
                        }}
                    >
                        <Star sx={{ fontSize: size, color, display: 'block' }} />
                    </Box>
                </Box>
            );
        })}
    </Box>
);

/** شريط تقدّم يتبع اتجاه الصفحة تلقائياً */
export const Meter: FunctionComponent<{
    value: number;
    color?: string;
    height?: number;
}> = ({ value, color = BRAND_GOLD, height = 10 }) => (
    <Box
        aria-hidden='true'
        sx={{
            height,
            borderRadius: 999,
            overflow: 'hidden',
            bgcolor: alpha(color, 0.14),
        }}
    >
        <Box
            sx={{
                width: `${Math.max(0, Math.min(100, value))}%`,
                height: '100%',
                borderRadius: 999,
                background: BRAND_GRADIENT,
                transition: 'width .6s ease',
            }}
        />
    </Box>
);

/** عنوان موحّد لكل تاب: عنوان + عدّاد + عنصر اختياري */
export const TabHeader: FunctionComponent<{
    title: string;
    count?: string;
    children?: ReactNode;
}> = ({ title, count, children }) => (
    <Stack
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        flexWrap='wrap'
        useFlexGap
        gap={1.5}
        sx={{ mb: 2.5 }}
    >
        <Stack direction='row' alignItems='center' gap={1.5}>
            <Typography
                variant='h6'
                component='h2'
                sx={{ fontFamily: DISPLAY_FONT, fontWeight: 800 }}
            >
                {title}
            </Typography>
            {count && (
                <Chip
                    size='small'
                    label={count}
                    sx={{
                        fontWeight: 700,
                        color: BRAND_BROWN,
                        bgcolor: alpha(BRAND_GOLD, 0.12),
                    }}
                />
            )}
        </Stack>
        {children}
    </Stack>
);