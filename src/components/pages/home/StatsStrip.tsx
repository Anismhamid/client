// components/home/StatsStrip.tsx
import { Box, Container, Typography } from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import handleRTL from '../../../locales/handleRTL';
import { useTranslation } from 'react-i18next';
import SealBadge from './SealBadge';

interface StatsStripProps {
    postsCount: number;
}

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
                bgcolor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
                position: 'relative',
            }}
        >
            <Container maxWidth='lg' sx={{ px: { xs: 1.5, md: 4 } }}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        position: 'relative',
                        // خط الدفتر الأفقي الخفيف، نفس تكسچر الـ Hero
                        backgroundImage:
                            'repeating-linear-gradient(rgba(139,69,19,0.05) 0px, rgba(139,69,19,0.05) 1px, transparent 1px, transparent 26px)',
                    }}
                >
                    {STATS(postsCount).map((stat, i) => {
                        const { Icon } = stat;
                        return (
                            <Box
                                key={stat.label}
                                sx={{
                                    textAlign: 'center',
                                    py: { xs: 2, sm: 2.5 },
                                    px: { xs: 0.5, sm: 1.5 },
                                    position: 'relative',
                                    // خط متقطع عمودي بين البنود، مو صندوق كامل
                                    ...(i !== 0 && {
                                        borderInlineStart: '1px dashed',
                                        borderColor: 'divider',
                                    }),
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                                    <SealBadge size={30} rotate={i % 2 === 0 ? -6 : 6} tone='outline'>
                                        <Icon sx={{ fontSize: 15 }} />
                                    </SealBadge>
                                </Box>
                                <Typography
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: { xs: '1.1rem', sm: '1.35rem' },
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

            <Box
                sx={{
                    height: 8,
                    backgroundImage: (theme) =>
                        `radial-gradient(circle at 8px 0, transparent 7px, ${theme.palette.background.paper} 7.5px)`,
                    backgroundSize: '16px 8px',
                    backgroundRepeat: 'repeat-x',
                }}
            />
        </Box>
    );
};

export default StatsStrip;