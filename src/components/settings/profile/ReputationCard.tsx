import { FunctionComponent } from 'react';
import { Box, Card, Chip, Divider, Grid, Stack, Typography, alpha } from '@mui/material';
import {
    CheckCircle,
    RadioButtonUnchecked,
    StarBorder,
    WorkspacePremium,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { ReviewStats, LevelResult, MetricId, SectionHeader, StarRow, DISPLAY_FONT, Meter, SUCCESS, AMBER } from './ProfileShared';

interface ReputationCardProps {
    stats: ReviewStats;
    level: LevelResult;
    isOwner: boolean;
}

const formatMetric = (metric: MetricId, value: number) =>
    metric === 'rating'
        ? value.toFixed(1)
        : metric === 'completion'
          ? `${value}%`
          : String(value);

const ReputationCard: FunctionComponent<ReputationCardProps> = ({
    stats,
    level,
    isOwner,
}) => {
    const { t } = useTranslation();

    const metricLabels: Record<MetricId, string> = {
        posts: t('profile.req.posts', { defaultValue: 'إعلانات منشورة' }),
        completion: t('profile.req.completion', { defaultValue: 'اكتمال الملف' }),
        reviews: t('profile.req.reviews', { defaultValue: 'عدد التقييمات' }),
        rating: t('profile.req.rating', { defaultValue: 'متوسط التقييم' }),
    };

    const levelName = (id: string, fallback: string) =>
        t(`profile.level.${id}`, { defaultValue: fallback });

    return (
        <Card variant='outlined' sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <SectionHeader
                icon={<StarBorder />}
                title={t('profile.reputation', { defaultValue: 'السمعة والتقييمات' })}
            />

            <Box sx={{ p: 3 }}>
                {stats.count === 0 ? (
                    <Stack alignItems='center' spacing={1} sx={{ py: 3 }}>
                        <StarRow value={0} size={22} />
                        <Typography fontWeight={700}>
                            {t('profile.noReviewsYet', { defaultValue: 'لا تقييمات بعد' })}
                        </Typography>
                        <Typography
                            variant='body2'
                            color='text.secondary'
                            textAlign='center'
                            sx={{ maxWidth: 420 }}
                        >
                            {isOwner
                                ? t('profile.noReviewsOwnerHint', {
                                      defaultValue:
                                          'تظهر التقييمات هنا عندما يقيّم المشترون إعلاناتك.',
                                  })
                                : t('profile.noReviewsVisitorHint', {
                                      defaultValue: 'لم يقيّم أحد إعلانات هذا البائع بعد.',
                                  })}
                        </Typography>
                    </Stack>
                ) : (
                    <Grid container spacing={4} alignItems='center'>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Stack alignItems='center' spacing={1}>
                                <Typography
                                    component='p'
                                    sx={{
                                        fontFamily: DISPLAY_FONT,
                                        fontWeight: 800,
                                        fontSize: '3.25rem',
                                        lineHeight: 1,
                                        fontVariantNumeric: 'tabular-nums',
                                    }}
                                >
                                    {stats.average.toFixed(1)}
                                </Typography>
                                <StarRow value={stats.average} size={20} />
                                <Typography variant='body2' color='text.secondary'>
                                    {stats.count}{' '}
                                    {t('profile.reviewsCount', { defaultValue: 'تقييم' })}
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 8 }}>
                            <Stack spacing={1.25}>
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count = stats.distribution[star - 1];
                                    const pct = (count / stats.count) * 100;
                                    return (
                                        <Box
                                            key={star}
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns: '28px 1fr 32px',
                                                alignItems: 'center',
                                                gap: 1.5,
                                            }}
                                        >
                                            <Typography
                                                variant='body2'
                                                fontWeight={700}
                                                sx={{ fontVariantNumeric: 'tabular-nums' }}
                                            >
                                                {star}★
                                            </Typography>
                                            <Meter value={pct} />
                                            <Typography
                                                variant='body2'
                                                color='text.secondary'
                                                textAlign='end'
                                                sx={{ fontVariantNumeric: 'tabular-nums' }}
                                            >
                                                {count}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Stack>
                        </Grid>
                    </Grid>
                )}

                {isOwner && (
                    <>
                        <Divider sx={{ my: 3 }} />

                        <Stack
                            direction='row'
                            alignItems='center'
                            gap={1.5}
                            flexWrap='wrap'
                            useFlexGap
                            sx={{ mb: 2 }}
                        >
                            <Typography fontWeight={800}>
                                {t('profile.yourLevel', { defaultValue: 'مستواك' })}
                            </Typography>
                            <Chip
                                icon={<WorkspacePremium />}
                                label={levelName(level.current.id, level.current.fallback)}
                                size='small'
                                sx={{
                                    fontWeight: 700,
                                    bgcolor: alpha(level.current.color, 0.16),
                                    color: level.current.color,
                                    border: `1px solid ${alpha(level.current.color, 0.45)}`,
                                    '& .MuiChip-icon': { color: level.current.color },
                                }}
                            />
                        </Stack>

                        {level.next ? (
                            <>
                                <Typography
                                    variant='body2'
                                    color='text.secondary'
                                    sx={{ mb: 2 }}
                                >
                                    {t('profile.toReach', {
                                        defaultValue: 'للوصول إلى',
                                    })}{' '}
                                    <Box component='strong' sx={{ color: 'text.primary' }}>
                                        {levelName(level.next.id, level.next.fallback)}
                                    </Box>
                                </Typography>
                                <Stack spacing={1.75}>
                                    {level.progress.map((r) => (
                                        <Box key={r.metric}>
                                            <Stack
                                                direction='row'
                                                alignItems='center'
                                                justifyContent='space-between'
                                                sx={{ mb: 0.75 }}
                                            >
                                                <Stack
                                                    direction='row'
                                                    alignItems='center'
                                                    gap={0.75}
                                                >
                                                    {r.met ? (
                                                        <CheckCircle
                                                            sx={{ fontSize: 17, color: SUCCESS }}
                                                        />
                                                    ) : (
                                                        <RadioButtonUnchecked
                                                            sx={{
                                                                fontSize: 17,
                                                                color: 'text.disabled',
                                                            }}
                                                        />
                                                    )}
                                                    <Typography variant='body2'>
                                                        {metricLabels[r.metric]}
                                                    </Typography>
                                                </Stack>
                                                <Typography
                                                    variant='body2'
                                                    color='text.secondary'
                                                    dir='ltr'
                                                    sx={{ fontVariantNumeric: 'tabular-nums' }}
                                                >
                                                    {formatMetric(r.metric, r.current)} /{' '}
                                                    {formatMetric(r.metric, r.target)}
                                                </Typography>
                                            </Stack>
                                            <Meter
                                                value={(r.current / r.target) * 100}
                                                color={r.met ? SUCCESS : AMBER}
                                                height={6}
                                            />
                                        </Box>
                                    ))}
                                </Stack>
                            </>
                        ) : (
                            <Typography variant='body2' color='text.secondary'>
                                {t('profile.topLevel', {
                                    defaultValue: 'وصلت لأعلى مستوى. استمر بالمحافظة على تقييمك.',
                                })}
                            </Typography>
                        )}
                    </>
                )}
            </Box>
        </Card>
    );
};

export default ReputationCard;