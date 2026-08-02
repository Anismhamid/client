// components/home/StatsStrip.tsx
import { Box, Container, Typography } from '@mui/material';
import handleRTL from '../../../locales/handleRTL';
import { useTranslation } from 'react-i18next';

interface StatsStripProps {
    postsCount: number;
}

const GRADIENT = 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)';

const StatsStrip = ({ postsCount }: StatsStripProps) => {
    const direction = handleRTL();
    const { t } = useTranslation();
    const STATS = (count: number) => [
        { num: `${count}+`, label: t('ActivePost') },
        { num: '24/7', label: t('ContinuousSupport') },
        { num: '100%', label: t('SafeAndReliable') },
    ];
    return (
        <Box
            dir={direction}
            sx={{
                bgcolor: 'background.default',
                borderTop: '1px solid',
                borderBottom: '1px solid',
                borderColor: 'divider',
                py: 2.5,
                px: { xs: 2, md: 4 },
            }}
        >
            <Container maxWidth='lg'>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'stretch',
                        flexWrap: 'wrap',
                    }}
                >
                    {STATS(postsCount).map((stat, i) => (
                        <Box
                            key={stat.label}
                            sx={{
                                textAlign: 'center',
                                px: { xs: 2.5, md: 4 },
                                borderInlineStart: i === 0 ? 'none' : '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <Typography
                                sx={{
                                    display: 'inline-block',
                                    fontWeight: 800,
                                    fontSize: '1.3rem',
                                    color: 'text.primary',
                                    lineHeight: 1.2,
                                    position: 'relative',
                                    pb: 0.5,
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: 0,
                                        insetInlineStart: '15%',
                                        insetInlineEnd: '15%',
                                        height: '3px',
                                        borderRadius: '2px',
                                        background: GRADIENT,
                                    },
                                }}
                            >
                                {stat.num}
                            </Typography>
                            <Typography
                                variant='caption'
                                sx={{
                                    display: 'block',
                                    mt: 0.75,
                                    color: 'text.secondary',
                                    letterSpacing: 0.3,
                                }}
                            >
                                {stat.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default StatsStrip;