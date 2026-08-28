// components/home/StatsStrip.tsx
import { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import { motion, useInView } from 'framer-motion';
import handleRTL from '../../../locales/handleRTL';
import { useTranslation } from 'react-i18next';
import SealBadge from './SealBadge';

interface StatsStripProps {
    postsCount: number;
}

// Animates the leading digits of a stat string ("128+" / "24/7" / "100%")
// from 0 up to their target once the strip scrolls into view, keeping any
// non-numeric prefix/suffix (the "+", "/7", "%") static.
const AnimatedStatNumber = ({ value, active }: { value: string; active: boolean }) => {
    const match = value.match(/^(\d+)(.*)$/);
    const target = match ? parseInt(match[1], 10) : null;
    const suffix = match ? match[2] : '';
    const [display, setDisplay] = useState(target === null ? value : 0);

    useEffect(() => {
        if (!active || target === null) return;

        const duration = 900;
        const start = performance.now();

        let frame: number;
        const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * target));
            if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(frame);
    }, [active, target]);

    if (target === null) return <>{value}</>;
    return (
        <>
            {display}
            {suffix}
        </>
    );
};

const StatsStrip = ({ postsCount }: StatsStripProps) => {
    const direction = handleRTL();
    const { t } = useTranslation();
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });

    const STATS = (count: number) => [
        { num: `${count}+`, label: t('ActivePost'), Icon: TrendingUpRoundedIcon },
        { num: '24/7', label: t('ContinuousSupport'), Icon: SupportAgentRoundedIcon },
        { num: '100%', label: t('SafeAndReliable'), Icon: VerifiedUserRoundedIcon },
    ];

    return (
        <Box
            ref={ref}
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
                            <motion.div
                                key={stat.label}
                                whileHover={{ y: -3 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        py: { xs: 2, sm: 2.5 },
                                        px: { xs: 0.5, sm: 1.5 },
                                        position: 'relative',
                                        cursor: 'default',
                                        // خط متقطع عمودي بين البنود، مو صندوق كامل
                                        ...(i !== 0 && {
                                            borderInlineStart: '1px dashed',
                                            borderColor: 'divider',
                                        }),
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                                        <SealBadge
                                            size={30}
                                            rotate={i % 2 === 0 ? -6 : 6}
                                            tone='outline'
                                        >
                                            <Icon sx={{ fontSize: 15 }} />
                                        </SealBadge>
                                    </Box>
                                    <Typography
                                        sx={{
                                            fontWeight: 800,
                                            fontSize: { xs: '1.1rem', sm: '1.35rem' },
                                            color: 'text.primary',
                                            lineHeight: 1.2,
                                            fontVariantNumeric: 'tabular-nums',
                                        }}
                                    >
                                        <AnimatedStatNumber value={stat.num} active={inView} />
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
                            </motion.div>
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