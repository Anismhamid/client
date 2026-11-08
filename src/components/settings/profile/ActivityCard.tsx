import { FunctionComponent, useMemo } from 'react';
import { Box, Card, Stack, Typography, alpha } from '@mui/material';
import { History as HistoryIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { AMBER, SectionHeader } from './ProfileShared';

interface ActivityCardProps {
    activity?: string[];
}

const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

const ActivityCard: FunctionComponent<ActivityCardProps> = ({ activity }) => {
    const { t, i18n } = useTranslation();

    const items = useMemo(() => activity?.slice(-5).reverse() ?? [], [activity]);

    const formatWhen = (timestamp: string) => {
        const date = new Date(timestamp);
        if (Number.isNaN(date.getTime())) return timestamp;

        const diffDays = Math.round(
            (startOfDay(new Date()) - startOfDay(date)) / 86400000,
        );
        const time = date.toLocaleTimeString(i18n.language, {
            hour: '2-digit',
            minute: '2-digit',
        });

        if (diffDays === 0) return `${t('activity.today')}، ${time}`;
        if (diffDays === 1) return `${t('activity.yesterday')}، ${time}`;
        return `${date.toLocaleDateString(i18n.language, {
            day: 'numeric',
            month: 'short',
        })}، ${time}`;
    };

    return (
        <Card variant='outlined' sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <SectionHeader icon={<HistoryIcon />} title={t('activity.title')} />

            <Box sx={{ p: 3 }}>
                {items.length ? (
                    <Box sx={{ position: 'relative' }}>
                        <Box
                            aria-hidden='true'
                            sx={(theme) => ({
                                position: 'absolute',
                                top: 10,
                                bottom: 10,
                                insetInlineStart: 9,
                                width: '2px',
                                background: `linear-gradient(180deg, ${AMBER}, ${alpha(theme.palette.divider, 0.5)})`,
                            })}
                        />
                        <Stack spacing={2.5} component='ol' sx={{ m: 0, p: 0, listStyle: 'none' }}>
                            {items.map((timestamp, index) => (
                                <Box
                                    component='li'
                                    key={`${timestamp}-${index}`}
                                    sx={{ position: 'relative', paddingInlineStart: '38px' }}
                                >
                                    <Box
                                        aria-hidden='true'
                                        sx={(theme) => ({
                                            position: 'absolute',
                                            insetInlineStart: 0,
                                            top: 1,
                                            width: 20,
                                            height: 20,
                                            borderRadius: '50%',
                                            display: 'grid',
                                            placeItems: 'center',
                                            bgcolor:
                                                index === 0
                                                    ? AMBER
                                                    : theme.palette.background.paper,
                                            border: `2px solid ${index === 0 ? AMBER : theme.palette.divider}`,
                                            boxShadow:
                                                index === 0
                                                    ? `0 0 0 4px ${alpha(AMBER, 0.15)}`
                                                    : 'none',
                                        })}
                                    >
                                        {index === 0 && (
                                            <Box
                                                sx={{
                                                    width: 6,
                                                    height: 6,
                                                    borderRadius: '50%',
                                                    bgcolor: '#fff',
                                                }}
                                            />
                                        )}
                                    </Box>
                                    <Typography variant='body2' fontWeight={600}>
                                        {formatWhen(timestamp)}
                                    </Typography>
                                    <Typography variant='caption' color='text.secondary'>
                                        {t('activity.lastLogin')}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                ) : (
                    <Stack alignItems='center' spacing={1} sx={{ py: 3 }}>
                        <Box
                            aria-hidden='true'
                            sx={(theme) => ({
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                display: 'grid',
                                placeItems: 'center',
                                bgcolor: alpha(theme.palette.text.secondary, 0.08),
                                color: 'text.secondary',
                            })}
                        >
                            <HistoryIcon />
                        </Box>
                        <Typography color='text.secondary' textAlign='center'>
                            {t('activity.empty')}
                        </Typography>
                    </Stack>
                )}
            </Box>
        </Card>
    );
};

export default ActivityCard;