// components/home/HeroSection.tsx
import { Box, Button, Stack, Typography, Chip, alpha } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VerifiedIcon from '@mui/icons-material/Verified';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { m } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../../hooks/useUSer';
import handleRTL from '../../../locales/handleRTL';
import { path } from '../../../routes/routes';
import { useEffect, useState } from 'react';
import SealBadge from './SealBadge';
import AISearch from '../../../atoms/AISearch';
import { BRAND } from '../../navbar/theme/brand';
import {
    ArticleOutlined,
    NotificationsActiveOutlined,
    Search,
    WorkOutlineOutlined,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import HeroFloatingChips from './HeroFloatingChips';

interface HeroSectionProps {
    onAddProduct: () => void;
}

const FLOATING_SEALS = [
    { top: '18%', left: '6%', size: 22, rotate: -12, delay: 0 },
    { top: '72%', left: '4%', size: 14, rotate: 10, delay: 0.6 },
    { top: '26%', left: '92%', size: 16, rotate: 14, delay: 0.3 },
    { top: '78%', left: '94%', size: 20, rotate: -8, delay: 0.9 },
];

const TRUST_ITEMS = [
    {
        icon: SupportAgentOutlinedIcon,
        key: 'common.trust.support',
        fallback: 'دعم ٢٤/٧',
    },
    {
        icon: HandshakeOutlinedIcon,
        key: 'common.trust.verifiedDeals',
        fallback: 'صفقات موثوقة',
    },
];

const QUICK_LINKS = [
    {
        to: '/jobs',
        icon: WorkOutlineOutlined,
        key: 'common.tabs.jobs',
        fallback: 'الوظائف',
    },
    {
        to: '/blog',
        icon: ArticleOutlined,
        key: 'common.tabs.blog',
        fallback: 'مقالات',
    },
    {
        to: '/saved-searches',
        icon: NotificationsActiveOutlined,
        key: 'common.tabs.mySmartSearch',
        requiresLogin: true,
        fallback: 'تنبيهاتي',
    }, // عدّل المسار
];

const quickLinkSx = {
    borderRadius: '10px',
    gap: 1,
    fontWeight: 700,
    fontSize: '0.85rem',
    borderColor: alpha(BRAND.brown, 0.35),
    color: 'text.primary',
    '&:hover': {
        borderColor: BRAND.brown,
        color: BRAND.brown,
        bgcolor: alpha(BRAND.brown, 0.05),
    },
};

const HeroSection = ({ onAddProduct }: HeroSectionProps) => {
    const { isLoggedIn } = useUser();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const direction = handleRTL();
    const rtl = direction === 'rtl';
    const [referenceNumber] = useState(() => `SFQ-${new Date().getFullYear()}`);
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [navigate]);

    const handleAddClick = () => {
        if (isLoggedIn) onAddProduct();
        else navigate(path.Login, { state: { from: path.Home } });
    };

    return (
        <Box
            id='hero-section'
            dir={direction}
            sx={{
                position: 'relative',
                overflow: 'hidden',
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                py: { xs: 6, md: 10 },
                px: { xs: 2, md: 4 },
            }}
        >
            <Box position={'relative'}>
                <HeroFloatingChips />
            </Box>
            {/* ── Background layers ─────────────────────────────── */}

            {/* Ledger texture */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: BRAND.ledgerLines(0.05, 30),
                    maskImage:
                        'radial-gradient(ellipse 80% 60% at 50% 40%, black 0%, transparent 85%)',
                    WebkitMaskImage:
                        'radial-gradient(ellipse 80% 60% at 50% 40%, black 0%, transparent 85%)',
                    pointerEvents: 'none',
                }}
            />

            {/* Warm glow anchored to the title side */}
            <Box
                sx={{
                    position: 'absolute',
                    top: { xs: '10%', md: '20%' },
                    [rtl ? 'right' : 'left']: { xs: '-20%', md: '-5%' },
                    width: { xs: 380, md: 620 },
                    height: { xs: 380, md: 620 },
                    borderRadius: '50%',
                    background:
                        'radial-gradient(circle, rgba(184,134,11,0.18) 0%, transparent 65%)',
                    filter: 'blur(30px)',
                    pointerEvents: 'none',
                }}
            />

            {/* Opposite cool accent for balance */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: { xs: '-10%', md: '-15%' },
                    [rtl ? 'left' : 'right']: '-10%',
                    width: { xs: 300, md: 480 },
                    height: { xs: 300, md: 480 },
                    borderRadius: '50%',
                    background:
                        'radial-gradient(circle, rgba(62,123,106,0.10) 0%, transparent 70%)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none',
                }}
            />

            {/* Floating decorative seals */}
            <Box
                sx={{
                    display: { xs: 'none', md: 'block' },
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                }}
            >
                {FLOATING_SEALS.map((seal, i) => (
                    <m.div
                        key={i}
                        style={{
                            position: 'absolute',
                            top: seal.top,
                            left: rtl ? undefined : seal.left,
                            right: rtl ? seal.left : undefined,
                        }}
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 0.45, y: [0, -10, 0] }}
                        transition={{
                            opacity: { duration: 0.6, delay: seal.delay },
                            y: {
                                duration: 5 + i,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: seal.delay,
                            },
                        }}
                    >
                        <SealBadge
                            size={seal.size}
                            rotate={seal.rotate}
                            tone='outline'
                        >
                            <Box
                                sx={{
                                    width: seal.size * 0.35,
                                    height: seal.size * 0.35,
                                }}
                            />
                        </SealBadge>
                    </m.div>
                ))}
            </Box>

            {/* ── Main split grid ──────────────────────────────── */}
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    maxWidth: 1180,
                    mx: 'auto',
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1.15fr 0.85fr' },
                    gap: { xs: 5, md: 6 },
                    alignItems: 'center',
                }}
            >
                {/* ── LEFT: Editorial copy ─────────────────────── */}
                <Box
                    sx={{
                        textAlign: { xs: 'center', md: rtl ? 'right' : 'left' },
                    }}
                >
                    {/* Eyebrow badge */}
                    <m.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                px: 1.5,
                                py: 0.75,
                                mb: 3,
                                border: '1px solid',
                                borderColor: alpha(BRAND.brown, 0.3),
                                borderRadius: '999px',
                                bgcolor: alpha(BRAND.brown, 0.06),
                                backdropFilter: 'blur(6px)',
                            }}
                        >
                            <SealBadge size={20} rotate={-8} pulse>
                                <VerifiedIcon sx={{ fontSize: 12 }} />
                            </SealBadge>
                            <Typography
                                variant='caption'
                                sx={{
                                    color: BRAND.brown,
                                    fontWeight: 700,
                                    letterSpacing: 0.5,
                                    fontSize: '0.72rem',
                                }}
                            >
                                {t('TrustedOnlineMarketplace')}
                            </Typography>
                        </Box>
                    </m.div>

                    {/* Title — broken into two visual lines for hierarchy */}
                    <m.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Typography
                            component='h1'
                            sx={{
                                fontWeight: 900,
                                fontSize: { xs: '2.6rem', md: '3.6rem' },
                                lineHeight: 1.05,
                                letterSpacing: '-0.03em',
                                mb: 2,
                            }}
                        >
                            <Box
                                component='span'
                                sx={{
                                    display: 'inline-block',
                                    marginInlineEnd: 1.5,
                                }}
                            >
                                🛒
                            </Box>
                            <Box
                                component='span'
                                sx={{
                                    background: BRAND.gradient,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    color: 'transparent',
                                }}
                            >
                                {t('webPageName')}
                            </Box>
                        </Typography>
                    </m.div>

                    {/* Description with a hand-drawn underline accent */}
                    <m.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                    >
                        <Typography
                            variant='body1'
                            sx={{
                                color: 'text.secondary',
                                fontSize: { xs: '1rem', md: '1.15rem' },
                                lineHeight: 1.75,
                                mb: 3.5,
                                maxWidth: 520,
                                mx: { xs: 'auto', md: 0 },
                            }}
                        >
                            {t('bestOffers')}
                        </Typography>
                    </m.div>

                    {/* CTA buttons */}
                    <m.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={1.5}
                            justifyContent={{
                                xs: 'center',
                                md: rtl ? 'flex-start' : 'flex-start',
                            }}
                            sx={{ mb: 3 }}
                        >
                            <m.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    variant='contained'
                                    size='large'
                                    aria-label={t('create-post')}
                                    title={t('create-post')}
                                    startIcon={<AddIcon />}
                                    onClick={handleAddClick}
                                    sx={{
                                        px: 3.5,
                                        py: 1.4,
                                        borderRadius: '12px',
                                        fontWeight: 700,
                                        fontSize: '0.95rem',
                                        background: BRAND.gradient,
                                        boxShadow: `0 12px 28px -12px ${BRAND.ledger(0.6)}`,
                                        '&:hover': {
                                            boxShadow: `0 16px 32px -12px ${BRAND.ledger(0.7)}`,
                                            background: BRAND.gradient,
                                            filter: 'brightness(1.06)',
                                        },
                                    }}
                                >
                                    {t('create-post')}
                                </Button>
                            </m.div>
                            <m.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    variant='outlined'
                                    size='large'
                                    aria-label={
                                        t('browse-posts') || 'تصفح المنتجات'
                                    }
                                    title={t('browse-posts') || 'تصفح المنتجات'}
                                    endIcon={
                                        <ArrowForwardRoundedIcon
                                            sx={{
                                                fontSize: 18,
                                                transform: rtl
                                                    ? 'scaleX(-1)'
                                                    : 'none',
                                            }}
                                        />
                                    }
                                    sx={{
                                        px: 3.5,
                                        py: 1.4,
                                        borderRadius: '12px',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        borderWidth: '1.5px',
                                        borderColor: alpha(BRAND.brown, 0.5),
                                        color: 'text.primary',
                                        '&:hover': {
                                            borderWidth: '1.5px',
                                            borderColor: BRAND.brown,
                                            color: BRAND.brown,
                                            bgcolor: alpha(BRAND.brown, 0.04),
                                        },
                                    }}
                                    onClick={() =>
                                        document
                                            .getElementById('products-section')
                                            ?.scrollIntoView({
                                                behavior: 'smooth',
                                            })
                                    }
                                >
                                    {t('browse-posts') || 'تصفح المنتجات'}
                                </Button>
                            </m.div>
                        </Stack>
                    </m.div>
                </Box>

                {/* ── RIGHT: "Deal card" panel ─────────────────── */}
                <m.div
                    initial={{ opacity: 0, y: 24, rotate: rtl ? -1.5 : 1.5 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            borderRadius: '22px',
                            p: { xs: 2.5, md: 3 },
                            bgcolor: 'background.paper',
                            border: `1px solid ${alpha(BRAND.brown, 0.18)}`,
                            boxShadow: `0 30px 70px -30px ${alpha(BRAND.brown, 0.35)}`,
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                insetInlineStart: 0,
                                insetInlineEnd: 0,
                                height: 4,
                                background: BRAND.gradient,
                            },
                        }}
                    >
                        {/* Fake receipt header */}
                        <Stack
                            direction='row'
                            alignItems='center'
                            justifyContent='space-between'
                            mb={2.5}
                        >
                            <Chip
                                label={t('hero.dealCard.badge', 'صفقة مضمونة')}
                                size='small'
                                sx={{
                                    bgcolor: alpha(BRAND.brown, 0.1),
                                    color: BRAND.brown,
                                    fontWeight: 800,
                                    fontSize: '0.7rem',
                                    letterSpacing: 0.3,
                                }}
                            />
                            <Typography
                                sx={{
                                    fontFamily: 'monospace',
                                    fontSize: '0.72rem',
                                    color: 'text.secondary',
                                    letterSpacing: 1,
                                }}
                            >
                                {referenceNumber}
                            </Typography>
                        </Stack>
                        <Stack spacing={1.25} sx={{ mb: 2 }}>
                            <Button
                                component={RouterLink}
                                to={path.smartSearch}
                                variant='contained'
                                fullWidth
                                startIcon={<Search />}
                                endIcon={
                                    <ArrowForwardRoundedIcon
                                        sx={{
                                            fontSize: 16,
                                            transform: rtl
                                                ? 'scaleX(-1)'
                                                : 'none',
                                        }}
                                    />
                                }
                                sx={{
                                    justifyContent: 'space-between',
                                    borderRadius: '10px',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    background: BRAND.gradient,
                                    '&:hover': {
                                        background: BRAND.gradient,
                                        filter: 'brightness(1.06)',
                                    },
                                    '& .MuiButton-endIcon': {
                                        marginInlineStart: 'auto',
                                    },
                                }}
                            >
                                {t('hero.smartSearch', 'البحث الذكي')}
                            </Button>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: 1.25,
                                }}
                            >
                                {QUICK_LINKS.map(
                                    ({
                                        to,
                                        icon: Icon,
                                        key: labelKey,
                                        fallback,
                                        requiresLogin,
                                    }) => {
                                        const locked = Boolean(
                                            requiresLogin && !isLoggedIn,
                                        );

                                        return (
                                            <Button
                                                key={to}
                                                component={RouterLink}
                                                to={locked ? path.Login : to}
                                                state={
                                                    locked
                                                        ? { from: to }
                                                        : undefined
                                                }
                                                variant='outlined'
                                                startIcon={
                                                    <Icon
                                                        sx={{ fontSize: 18 }}
                                                    />
                                                }
                                                sx={{
                                                    ...quickLinkSx,
                                                    minWidth: 0,
                                                    width: '100%',
                                                    justifyContent:
                                                        'flex-start',
                                                }}
                                            >
                                                {t(labelKey, fallback)}
                                                {locked
                                                    ? ` ${t('login.loginButton')}`
                                                    : ''}
                                            </Button>
                                        );
                                    },
                                )}
                            </Box>
                        </Stack>
                        {/* AI search lives inside the panel — the "engine" */}
                        <AISearch />
                        {/* Smart search shortcut */}
                        {/* Trust ticker */}
                        <Stack
                            direction='row'
                            flexWrap='wrap'
                            rowGap={1}
                            columnGap={{ xs: 1.5, md: 2 }}
                            sx={{
                                mt: 3,
                                pt: 2.5,
                                borderTop: `1px dashed ${alpha(BRAND.brown, 0.2)}`,
                            }}
                        >
                            {TRUST_ITEMS.map(
                                ({ icon: Icon, key, fallback }) => (
                                    <Box
                                        key={key}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.6,
                                            color: 'text.secondary',
                                        }}
                                    >
                                        <Icon
                                            sx={{
                                                fontSize: 15,
                                                color: BRAND.gold,
                                            }}
                                        />
                                        <Typography
                                            variant='caption'
                                            sx={{
                                                fontWeight: 600,
                                                letterSpacing: 0.2,
                                                fontSize: '0.72rem',
                                            }}
                                        >
                                            {t(key, fallback)}
                                        </Typography>
                                    </Box>
                                ),
                            )}
                        </Stack>
                    </Box>
                </m.div>
            </Box>
        </Box>
    );
};

export default HeroSection;
