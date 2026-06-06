import {
    Box, Card, CardContent, Typography, Avatar, LinearProgress,
    Chip, alpha, useTheme, Skeleton,
} from '@mui/material';
import { ReactNode } from 'react';

// ─── Skeleton loading screen ──────────────────────────────────────────────────

export const SkeletonDashboard = () => (
    <Box>
        {/* stat cards */}
        <Box display='flex' gap={2} mb={4} flexWrap='wrap'>
            {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant='rounded' width={180} height={110} sx={{ borderRadius: 3, flex: '1 1 160px' }} />
            ))}
        </Box>
        {/* chart */}
        <Skeleton variant='rounded' height={260} sx={{ borderRadius: 3, mb: 3 }} />
        {/* table */}
        <Skeleton variant='rounded' height={340} sx={{ borderRadius: 3, mb: 3 }} />
        {/* bottom cards */}
        <Box display='flex' gap={2} flexWrap='wrap'>
            {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant='rounded' height={120} sx={{ borderRadius: 3, flex: '1 1 160px' }} />
            ))}
        </Box>
    </Box>
);

// ─── StatCard ─────────────────────────────────────────────────────────────────

interface StatCardProps {
    icon: ReactNode;
    label: string;
    value: string | number;
    subValue?: string;
    growth?: string;
    color: string;
    progressValue?: number;
    chips?: { label: string; color: 'success' | 'error' | 'warning' | 'info' | 'default' }[];
}

export const StatCard = ({
    icon, label, value, subValue, growth, color, progressValue, chips,
}: StatCardProps) => {
    return (
        <Card
            sx={{
                borderRadius: 4,
                flex: '1 1 180px',
                transition: 'transform .25s, box-shadow .25s',
                '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 16px 36px rgba(0,0,0,0.15)' },
            }}
        >
            <CardContent>
                <Box display='flex' alignItems='center' justifyContent='space-between'>
                    <Box sx={{ color, fontSize: 48, display: 'flex' }}>{icon}</Box>
                    <Box textAlign='right'>
                        <Typography variant='h3' fontWeight='bold'>{value}</Typography>
                        <Typography variant='body2' sx={{ opacity: .85 }}>{label}</Typography>
                    </Box>
                </Box>

                {growth && (
                    <Typography variant='caption' sx={{ opacity: .8, display: 'block', mt: 1 }}>
                        {growth}
                    </Typography>
                )}

                {progressValue !== undefined && (
                    <>
                        <LinearProgress
                            variant='determinate'
                            value={progressValue}
                            sx={{
                                mt: 1, height: 6, borderRadius: 3,
                                bgcolor: alpha('#fff', .2),
                                '& .MuiLinearProgress-bar': { bgcolor: '#fff' },
                            }}
                        />
                        {subValue && (
                            <Typography variant='caption' sx={{ opacity: .8 }}>{subValue}</Typography>
                        )}
                    </>
                )}

                {chips && (
                    <Box display='flex' gap={1} mt={1} flexWrap='wrap'>
                        {chips.map((c, i) => (
                            <Chip
                                key={i}
                                size='small'
                                label={c.label}
                                sx={{ bgcolor: alpha('#fff', .2) }}
                            />
                        ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

// ─── Medal avatar for table ranks ─────────────────────────────────────────────

const MEDAL_COLORS: Record<number, { bg: string; color: string }> = {
    0: { bg: '#FFD700', color: '#000' },
    1: { bg: '#C0C0C0', color: '#000' },
    2: { bg: '#CD7F32', color: '#000' },
};

export const MedalAvatar = ({ index }: { index: number }) => {
    const theme = useTheme();
    const medal = MEDAL_COLORS[index];
    return (
        <Avatar
            sx={{
                width: 32, height: 32, mx: 'auto',
                bgcolor: medal?.bg ?? theme.palette.grey[400],
                color: medal ? '#000' : '#fff',
                fontWeight: 'bold', fontSize: 13,
            }}
        >
            {index + 1}
        </Avatar>
    );
};

// ─── Category progress bar row ────────────────────────────────────────────────

import { formatPrice } from '../../../helpers/dateAndPriceFormat';
import { getCategoryName, CHART_COLORS } from './statisticsUtils';
import { CategoryStats } from './statisticsUtils';

export const CategoryBarRow = ({ category, index }: { category: CategoryStats; index: number }) => {
    const color = CHART_COLORS[index % CHART_COLORS.length];
    return (
        <Box mb={2.5}>
            <Box display='flex' justifyContent='space-between' mb={0.5}>
                <Box display='flex' alignItems='center' gap={1}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, boxShadow: `0 0 0 3px ${alpha(color, .2)}` }} />
                    <Typography variant='body2' fontWeight={600}>{getCategoryName(category.category)}</Typography>
                </Box>
                <Typography variant='body2' fontWeight={600} color='primary'>{category.count} منتج</Typography>
            </Box>
            <LinearProgress
                variant='determinate'
                value={category.percentage}
                sx={{
                    height: 8, borderRadius: 4,
                    bgcolor: alpha(color, .1),
                    '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 4 },
                }}
            />
            <Box display='flex' justifyContent='space-between' mt={0.5}>
                <Typography variant='caption' color='text.secondary'>
                    {category.percentage.toFixed(1)}% من الإجمالي
                </Typography>
                <Typography variant='caption' fontWeight={600} color='success.main'>
                    {formatPrice(category.totalValue)}
                </Typography>
            </Box>
        </Box>
    );
};
