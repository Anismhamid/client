// components/home/StatsStrip.tsx
import { Box, Container, Typography } from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
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
        { num: `${count}+`, label: t('ActivePost'), Icon: TrendingUpRoundedIcon },
        { num: '24/7', label: t('ContinuousSupport'), Icon: SupportAgentRoundedIcon },
        { num: '100%', label: t('SafeAndReliable'), Icon: VerifiedUserRoundedIcon },
    ];

    return (
        <Box
            dir={direction}
            sx={{
                bgcolor: 'background.default',
                borderBottom: '1px solid',
                borderColor: 'divider',
                py: { xs: 2, md: 2.5 },
                px: { xs: 1.5, md: 4 },
            }}
        >
            <Container maxWidth='lg'>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: { xs: 1, sm: 2 },
                    }}
                >
                    {STATS(postsCount).map((stat) => {
                        const { Icon } = stat;
                        return (
                            <Box
                                key={stat.label}
                                sx={{
                                    textAlign: 'center',
                                    py: { xs: 1.25, sm: 1.5 },
                                    px: { xs: 0.5, sm: 1.5 },
                                    borderRadius: '14px',
                                    bgcolor: (theme) =>
                                        theme.palette.mode === 'dark'
                                            ? 'rgba(184,134,11,0.08)'
                                            : 'rgba(184,134,11,0.06)',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: { xs: 30, sm: 34 },
                                        height: { xs: 30, sm: 34 },
                                        borderRadius: '50%',
                                        background: GRADIENT,
                                        color: '#fff',
                                        mb: 0.75,
                                    }}
                                >
                                    <Icon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                                </Box>
                                <Typography
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: { xs: '1.05rem', sm: '1.3rem' },
                                        color: 'text.primary',
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {stat.num}
                                </Typography>
                                <Typography
                                    variant='caption'
                                    sx={{
                                        display: 'block',
                                        mt: 0.4,
                                        color: 'text.secondary',
                                        fontSize: { xs: '0.68rem', sm: '0.75rem' },
                                        letterSpacing: 0.2,
                                    }}
                                >
                                    {stat.label}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            </Container>
        </Box>
    );
};

export default StatsStrip;