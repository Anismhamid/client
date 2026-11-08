/* eslint-disable react-refresh/only-export-components */
import { FunctionComponent, ReactNode } from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { Star } from '@mui/icons-material';
import { Posts } from '../../../interfaces/Posts';

/* ───────────── Tokens ───────────── */

export const INK = '#12161C';
export const INK_RAISED = '#1A212B';
export const AMBER = '#f59f0b';
export const AMBER_DEEP = '#9a6700';
export const SUCCESS = '#22c55e';
export const DANGER = '#ef4444';
export const BRAND_GRADIENT =
    'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)';
// أضف الخط في index.html (IBM Plex Sans Arabic) — إذا مش محمّل بيرجع للـ fallback تلقائياً
export const DISPLAY_FONT =
    "'IBM Plex Sans Arabic', 'Cairo', 'Segoe UI', Tahoma, sans-serif";

/* ───────────── User ───────────── */

export type ProfileUser = {
    name: { first: string; last: string };
    phone: { phone_1: string; phone_2: string };
    address: { city: string; street: string; houseNumber: number };
    email: string;
    image: { url: string; alt: string };
    role: string;
    status: boolean;
    activity: string[];
    createdAt: string;
    slug: string;
    gender?: string;
};

export const EMPTY_USER: ProfileUser = {
    name: { first: '', last: '' },
    phone: { phone_1: '', phone_2: '' },
    address: { city: '', street: '', houseNumber: 0 },
    email: '',
    image: { url: '', alt: '' },
    role: '',
    status: false,
    activity: [],
    gender: 'male',
    createdAt: '',
    slug: '',
};

/* ───────────── Completion ───────────── */

export const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return SUCCESS;
    if (percentage >= 50) return AMBER;
    return DANGER;
};

export const calculateProfileCompletion = (u: ProfileUser) => {
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
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
};

export type MissingField = 'photo' | 'name' | 'phone' | 'address' | 'gender';

export const ALL_FIELDS: MissingField[] = [
    'photo',
    'name',
    'phone',
    'address',
    'gender',
];

export const getMissingFields = (u: ProfileUser): MissingField[] => {
    const missing: MissingField[] = [];
    if (!u.image?.url) missing.push('photo');
    if (!u.name?.first || !u.name?.last) missing.push('name');
    if (!u.phone?.phone_1) missing.push('phone');
    if (!u.address?.city || !u.address?.street || !u.address?.houseNumber)
        missing.push('address');
    if (!u.gender) missing.push('gender');
    return missing;
};

/* ───────────── Reviews / likes ───────────── */

export interface ReviewStats {
    count: number;
    average: number;
    /** index 0 = 1 star … index 4 = 5 stars */
    distribution: number[];
}

export const getReviewStats = (posts: Posts[]): ReviewStats => {
    const distribution = [0, 0, 0, 0, 0];
    let sum = 0;
    let count = 0;

    posts.forEach((p) =>
        p.reviews?.forEach((r) => {
            const v = r.rating;
            if (typeof v === 'number' && v >= 1 && v <= 5) {
                distribution[Math.round(v) - 1] += 1;
                sum += v;
                count += 1;
            }
        }),
    );

    return {
        count,
        average: count ? Number((sum / count).toFixed(1)) : 0,
        distribution,
    };
};

export const getLikesReceived = (posts: Posts[]) =>
    posts.reduce(
        (total, p) => total + (Array.isArray(p.likes) ? p.likes.length : 0),
        0,
    );

/* ───────────── Seller level ───────────── */

export type MetricId = 'posts' | 'completion' | 'reviews' | 'rating';
export type Metrics = Record<MetricId, number>;
export type LevelId = 'newcomer' | 'active' | 'trusted' | 'elite';

export interface LevelDef {
    id: LevelId;
    fallback: string;
    color: string;
    requirements: { metric: MetricId; target: number }[];
}

export const LEVELS: LevelDef[] = [
    { id: 'newcomer', fallback: 'عضو جديد', color: '#94a3b8', requirements: [] },
    {
        id: 'active',
        fallback: 'بائع نشط',
        color: AMBER,
        requirements: [
            { metric: 'posts', target: 1 },
            { metric: 'completion', target: 80 },
        ],
    },
    {
        id: 'trusted',
        fallback: 'بائع موثوق',
        color: SUCCESS,
        requirements: [
            { metric: 'posts', target: 5 },
            { metric: 'reviews', target: 3 },
            { metric: 'rating', target: 4 },
        ],
    },
    {
        id: 'elite',
        fallback: 'بائع مميز',
        color: '#e6b422',
        requirements: [
            { metric: 'posts', target: 10 },
            { metric: 'reviews', target: 10 },
            { metric: 'rating', target: 4.5 },
        ],
    },
];

export interface RequirementProgress {
    metric: MetricId;
    current: number;
    target: number;
    met: boolean;
}

export interface LevelResult {
    current: LevelDef;
    next: LevelDef | null;
    progress: RequirementProgress[];
}

export const computeLevel = (m: Metrics): LevelResult => {
    let index = 0;
    LEVELS.forEach((lvl, i) => {
        if (lvl.requirements.every((r) => m[r.metric] >= r.target)) index = i;
    });

    const next = LEVELS[index + 1] ?? null;
    const progress = next
        ? next.requirements.map((r) => ({
              metric: r.metric,
              target: r.target,
              current: m[r.metric],
              met: m[r.metric] >= r.target,
          }))
        : [];

    return { current: LEVELS[index], next, progress };
};

/* ───────────── UI atoms ───────────── */

export const SectionHeader: FunctionComponent<{
    icon: ReactNode;
    title: string;
    action?: ReactNode;
}> = ({ icon, title, action }) => (
    <Box
        sx={(theme) => ({
            px: 3,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            borderBottom: `1px solid ${theme.palette.divider}`,
        })}
    >
        <Box
            aria-hidden='true'
            sx={(theme) => ({
                width: 36,
                height: 36,
                flexShrink: 0,
                borderRadius: '12px',
                display: 'grid',
                placeItems: 'center',
                bgcolor: alpha(AMBER, 0.14),
                color: theme.palette.mode === 'dark' ? AMBER : AMBER_DEEP,
            })}
        >
            {icon}
        </Box>
        <Typography variant='h6' component='h2' fontWeight={800} sx={{ flex: 1 }}>
            {title}
        </Typography>
        {action}
    </Box>
);

/** شريط تقدّم يتبع اتجاه الصفحة (RTL/LTR) تلقائياً بدون transform فيزيائي */
export const Meter: FunctionComponent<{
    value: number;
    color?: string;
    height?: number;
}> = ({ value, color = AMBER, height = 8 }) => (
    <Box
        aria-hidden='true'
        sx={{
            height,
            borderRadius: 999,
            overflow: 'hidden',
            bgcolor: alpha(color, 0.16),
        }}
    >
        <Box
            sx={{
                width: `${Math.max(0, Math.min(100, value))}%`,
                height: '100%',
                borderRadius: 999,
                bgcolor: color,
                transition: 'width .6s ease',
            }}
        />
    </Box>
);

/** نجوم بتعبئة جزئية — بتشتغل صح بالـ RTL */
export const StarRow: FunctionComponent<{
    value: number;
    size?: number;
    color?: string;
    emptyColor?: string;
}> = ({ value, size = 16, color = AMBER, emptyColor = 'rgba(148,163,184,.4)' }) => (
    <Box
        role='img'
        aria-label={`${value} / 5`}
        sx={{ display: 'inline-flex', gap: '2px' }}
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