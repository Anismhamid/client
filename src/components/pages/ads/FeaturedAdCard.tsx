import {
    Box,
    Chip,
    IconButton,
    Stack,
    Typography,
    alpha,
    Tooltip,
    useTheme,
} from '@mui/material';
import { FeaturedAd } from '../../../interfaces/featuredAd';
import { formatDate, formatPrice } from '../../../helpers/dateAndPriceFormat';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import { useTranslation } from 'react-i18next';
import { getPlanById, PLANS } from '../../../interfaces/PlanConfig';

// ✅ استخدام ملف الباقات المركزي

interface FeaturedAdCardProps {
    ad: FeaturedAd;
    onDelete?: (id: string) => void;
}

export default function FeaturedAdCard({ ad, onDelete }: FeaturedAdCardProps) {
    const { t } = useTranslation();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    // جلب بيانات الباقة من المصدر المركزي
    const planMeta = getPlanById(ad.type) || PLANS[0];

    // تجهيز المتغيرات لتتوافق مع التصميم القديم
    const tier = {
        accent: planMeta.accent,
        color: isDark ? planMeta.darkBg : planMeta.emoji || planMeta.accent, // لون النص
        bg: isDark ? planMeta.darkBg : planMeta.lightBg, // الخلفية
        label: planMeta.title,
    };

    const Icon = planMeta.icon;

    return (
        <Box
            sx={{
                position: 'relative',
                borderRadius: '16px',
                border: '1.5px solid',
                borderColor: ad.isActive ? alpha(tier.accent, 0.35) : 'divider',
                bgcolor: 'background.paper',
                overflow: 'hidden',
                opacity: ad.isActive ? 1 : 0.7,
                transition: 'all 0.25s ease',
                '&:hover': {
                    transform: 'translateY(-3px)',
                    borderColor: ad.isActive
                        ? alpha(tier.accent, 0.6)
                        : 'text.disabled',
                    boxShadow: `0 16px 40px -20px ${alpha(tier.accent, 0.5)}`,
                    '& .row-delete': { opacity: 1 },
                },
            }}
        >
            {/* Accent top bar → gradient ribbon */}
            <Box
                sx={{
                    height: 4,
                    background: `linear-gradient(90deg, ${tier.accent}, ${alpha(tier.accent, 0.35)})`,
                }}
            />

            <Box sx={{ p: 2 }}>
                {/* Header row: tier chip + status chip */}
                <Stack
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                    mb={1.5}
                >
                    <Chip
                        icon={<Icon sx={{ fontSize: 13 }} aria-hidden='true' />}
                        label={tier.label}
                        size='small'
                        sx={{
                            bgcolor: alpha(tier.accent, 0.12),
                            color: tier.color,
                            fontWeight: 800,
                            fontSize: 10.5,
                            height: 22,
                            letterSpacing: 0.2,
                            border: `1px solid ${alpha(tier.accent, 0.25)}`,
                            '& .MuiChip-icon': { color: tier.color },
                            '& .MuiChip-label': { px: 1 },
                        }}
                    />
                    <Stack direction='row' alignItems='center' gap={0.5}>
                        {ad.isActive && (
                            <Box
                                sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    bgcolor: '#3B6D11',
                                    boxShadow: '0 0 0 3px rgba(59,109,17,0.15)',
                                }}
                            />
                        )}
                        <Chip
                            label={
                                ad.isActive
                                    ? t('ads.stats.active', 'نشط')
                                    : t('ads.stats.expired', 'منتهي')
                            }
                            size='small'
                            sx={{
                                bgcolor: ad.isActive
                                    ? alpha('#3B6D11', isDark ? 0.15 : 0.08)
                                    : alpha('#5F5E5A', isDark ? 0.15 : 0.08),
                                color: ad.isActive
                                    ? isDark
                                        ? '#9CCC65'
                                        : '#3B6D11'
                                    : isDark
                                      ? '#94a3b8'
                                      : '#5F5E5A',
                                fontSize: 10.5,
                                height: 22,
                                fontWeight: 800,
                                letterSpacing: 0.2,
                            }}
                        />
                    </Stack>
                </Stack>

                {/* Product title — 2-line clamp for cleaner rhythm */}
                <Typography
                    variant='body2'
                    fontWeight={800}
                    sx={{
                        mb: 0.5,
                        fontSize: '0.9rem',
                        lineHeight: 1.35,
                        color: 'text.primary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {ad.listingId?.product_name ||
                        t('ads.common.untitled', 'بدون عنوان')}
                </Typography>

                {/* Meta line with icons */}
                <Stack
                    direction='row'
                    alignItems='center'
                    flexWrap='wrap'
                    gap={1.25}
                    sx={{ mb: 1.75, color: 'text.secondary' }}
                >
                    {ad.listingId?.location && (
                        <Stack direction='row' alignItems='center' gap={0.4}>
                            <LocationOnRoundedIcon sx={{ fontSize: 12 }} />
                            <Typography
                                variant='caption'
                                sx={{ fontSize: 11, fontWeight: 600 }}
                            >
                                {ad.listingId.location}
                            </Typography>
                        </Stack>
                    )}
                    {ad.listingId?.category && (
                        <Box
                            component='span'
                            sx={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: 'text.secondary',
                            }}
                        >
                            {ad.listingId.category}
                        </Box>
                    )}
                </Stack>

                {/* Dashed divider = ticket-stub cut */}
                <Box
                    sx={{
                        borderTop: `1.5px dashed ${alpha(
                            ad.isActive ? tier.accent : '#000',
                            isDark ? 0.15 : 0.12,
                        )}`,
                        pt: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1,
                    }}
                >
                    {/* Dates block */}
                    <Stack direction='row' alignItems='center' gap={0.5}>
                        <CalendarMonthRoundedIcon
                            sx={{ fontSize: 13, color: 'text.disabled' }}
                        />
                        <Typography
                            variant='caption'
                            sx={{
                                fontSize: 10.5,
                                color: 'text.secondary',
                                fontWeight: 600,
                            }}
                        >
                            {formatDate(ad.startDate)} →{' '}
                            {formatDate(ad.endDate)}
                        </Typography>
                    </Stack>

                    {/* Price + delete */}
                    <Stack direction='row' alignItems='center' gap={0.5}>
                        <Typography
                            variant='caption'
                            fontWeight={900}
                            sx={{
                                color: ad.isActive
                                    ? tier.accent
                                    : 'text.disabled',
                                fontSize: 12,
                            }}
                        >
                            {/* ✅ استخدام سعر الباقة الجديد */}
                            {formatPrice(planMeta.price)}
                        </Typography>
                        {onDelete && (
                            <Tooltip
                                title={t('ads.delete', 'حذف الإعلان')}
                                arrow
                            >
                                <IconButton
                                    size='small'
                                    onClick={() => onDelete(ad._id)}
                                    aria-label={t('ads.delete', 'حذف الإعلان')}
                                    className='row-delete'
                                    sx={{
                                        ml: 0.25,
                                        color: 'text.disabled',
                                        opacity: { xs: 0.7, sm: 0.5 },
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            color: 'error.main',
                                            bgcolor: alpha(
                                                theme.palette.error.main,
                                                0.08,
                                            ),
                                        },
                                    }}
                                >
                                    <DeleteOutlineIcon
                                        sx={{ fontSize: 16 }}
                                        aria-hidden='true'
                                    />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}
