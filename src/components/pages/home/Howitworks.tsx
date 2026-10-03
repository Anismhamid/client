// components/home/HowItWorks.tsx
import { Box, Container, Typography } from '@mui/material';
import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SealBadge from './SealBadge';
import { BRAND } from '../../navbar/theme/brand';

const STEPS = [
    {
        key: 'howItWorks.step1',
        title: 'انشر إعلانك',
        descKey: 'howItWorks.step1Desc',
        desc: 'صوّر منتجك وحدد سعره، بدقيقتين بيكون أونلاين.',
    },
    {
        key: 'howItWorks.step2',
        title: 'تواصل مباشرة',
        descKey: 'howItWorks.step2Desc',
        desc: 'المشتري بيراسلك، واتفقوا على السعر والتسليم.',
    },
    {
        key: 'howItWorks.step3',
        title: 'اختم الصفقة',
        descKey: 'howItWorks.step3Desc',
        desc: 'سلّم المنتج واستلم حقك، وعلّم الإعلان كمباع.',
    },
];

const HowItWorks = () => {
    const { t } = useTranslation();

    return (
        <Box
            component='section'
            sx={{
                position: 'relative',
                borderTop: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                py: { xs: 5, md: 7 },
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: BRAND.ledgerLines(0.04),
                    maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
                    WebkitMaskImage:
                        'radial-gradient(ellipse at center, black 0%, transparent 70%)',
                    pointerEvents: 'none',
                }}
            />

            <Container maxWidth='md' sx={{ position: 'relative', px: { xs: 2, md: 4 } }}>
                <Typography
                    variant='h5'
                    sx={{ fontWeight: 800, textAlign: 'center', mb: { xs: 4, md: 5 } }}
                >
                    {t('howItWorks.title', 'كيف تتم الصفقة؟')}
                </Typography>

                <Box
                    sx={{
                        position: 'relative',
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                        gap: { xs: 4, sm: 2 },
                    }}
                >
                    {/* خط متقطع يوصل الأختام (ديسكتوب بس) */}
                    <Box
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            position: 'absolute',
                            top: 28,
                            insetInline: '16.6%',
                            borderTop: '2px dashed',
                            borderColor: BRAND.ledger(0.35),
                        }}
                    />

                    {STEPS.map((step, i) => (
                        <m.div
                            key={step.key}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.45, delay: i * 0.12 }}
                            style={{ position: 'relative', textAlign: 'center' }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
                                <SealBadge size={56} rotate={i % 2 === 0 ? -6 : 6} pulse={i === 2}>
                                    <Typography
                                        component='span'
                                        sx={{
                                            fontWeight: 800,
                                            fontSize: '1.3rem',
                                            fontVariantNumeric: 'tabular-nums',
                                        }}
                                    >
                                        {i + 1}
                                    </Typography>
                                </SealBadge>
                            </Box>
                            <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                                {t(step.key, step.title)}
                            </Typography>
                            <Typography
                                variant='body2'
                                sx={{
                                    color: 'text.secondary',
                                    lineHeight: 1.75,
                                    maxWidth: 240,
                                    mx: 'auto',
                                }}
                            >
                                {t(step.descKey, step.desc)}
                            </Typography>
                        </m.div>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default HowItWorks;