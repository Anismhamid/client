import { FunctionComponent, ReactNode } from 'react';
import { m, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { alpha, Box, Button, Paper, Skeleton, Stack, Typography } from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';

import {
    BRAND_BROWN,
    BRAND_GOLD,
    BRAND_GRADIENT,
} from '../pages/Jobs/jobsBrand';
import { DISPLAY_FONT, INK } from '../pages/Jobs/jobBrand';

export type TicketTone = 'offer' | 'seeker';

// ─── Perforation (the "torn ticket" divider) ───────────────

const Perforation: FunctionComponent = () => {
    const notch = {
        position: 'absolute',
        top: 0,
        width: 18,
        height: 18,
        borderRadius: '50%',
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider',
    } as const;

    return (
        <Box aria-hidden sx={{ position: 'relative', height: 18 }}>
            <Box
                sx={{
                    position: 'absolute',
                    insetInline: 14,
                    top: 8,
                    borderTop: '2px dashed',
                    borderColor: 'divider',
                }}
            />
            <Box sx={{ ...notch, insetInlineStart: -10 }} />
            <Box sx={{ ...notch, insetInlineEnd: -10 }} />
        </Box>
    );
};

// ─── Ticket shell ──────────────────────────────────────────
// offer  → ink band (وظيفة شاغرة)
// seeker → gold-tinted band (باحث عن عمل)

interface TicketProps {
    tone: TicketTone;
    band: ReactNode;
    footer: ReactNode;
    children: ReactNode;
    muted?: boolean;
    paperProps?: Record<string, unknown>;
}

export const Ticket: FunctionComponent<TicketProps> = ({
    tone,
    band,
    footer,
    children,
    muted,
    paperProps,
}) => {
    const { i18n } = useTranslation();
    const shift = i18n.dir() === 'rtl' ? '-4px' : '4px';
    const offer = tone === 'offer';

    return (
        <Paper
            variant='outlined'
            {...paperProps}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderRadius: 3,
                overflow: 'hidden',
                color: 'text.primary',
                textDecoration: 'none',
                cursor: 'pointer',
                opacity: muted ? 0.6 : 1,
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    borderColor: BRAND_GOLD,
                    boxShadow: `0 10px 28px ${alpha(BRAND_GOLD, 0.18)}`,
                    '& .ticket-arrow': { transform: `translateX(${shift})` },
                },
                '&:focus-visible': { outline: `2px solid ${BRAND_GOLD}`, outlineOffset: 2 },
            }}
        >
            <Box
                sx={{
                    px: 2,
                    py: 1.25,
                    bgcolor: offer ? INK : alpha(BRAND_GOLD, 0.16),
                    color: offer ? '#fff' : 'text.primary',
                    borderBottom: offer ? 'none' : '1px solid',
                    borderColor: alpha(BRAND_GOLD, 0.3),
                }}
            >
                {band}
            </Box>

            <Box sx={{ flexGrow: 1, px: 2.5, pt: 2.5, pb: 2 }}>{children}</Box>

            <Perforation />

            <Box sx={{ px: 2.5, py: 1.5 }}>{footer}</Box>
        </Paper>
    );
};

export const TicketBand: FunctionComponent<{
    tone: TicketTone;
    icon: ReactNode;
    label: string;
    trailing?: string;
}> = ({ tone, icon, label, trailing }) => (
    <Stack direction='row' alignItems='center' spacing={1.25}>
        <Box
            sx={{
                width: 30,
                height: 30,
                flexShrink: 0,
                display: 'grid',
                placeItems: 'center',
                borderRadius: '9px',
                fontSize: 18,
                bgcolor: alpha(BRAND_GOLD, tone === 'offer' ? 0.22 : 0.2),
                color: tone === 'offer' ? BRAND_GOLD : BRAND_BROWN,
            }}
        >
            {icon}
        </Box>

        <Typography
            noWrap
            sx={{ flex: 1, minWidth: 0, fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: '0.9rem' }}
        >
            {label}
        </Typography>

        {trailing && (
            <Typography
                variant='caption'
                noWrap
                sx={{
                    fontWeight: 700,
                    color: tone === 'offer' ? BRAND_GOLD : 'text.secondary',
                }}
            >
                {trailing}
            </Typography>
        )}
    </Stack>
);

// ─── Small pieces ──────────────────────────────────────────

export const SalaryTag: FunctionComponent<{ amount: string | null; period?: string }> = ({
    amount,
    period,
}) => {
    const { t } = useTranslation();

    if (!amount) {
        return (
            <Typography variant='body2' color='text.secondary'>
                {t('pages.jobs.salaryNegotiable', 'الراتب حسب الاتفاق')}
            </Typography>
        );
    }

    return (
        <Box sx={{ lineHeight: 1.2 }}>
            <Typography
                component='span'
                sx={{
                    fontFamily: DISPLAY_FONT,
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    color: (theme) => (theme.palette.mode === 'dark' ? BRAND_GOLD : BRAND_BROWN),
                }}
            >
                <bdi>{amount}</bdi> ₪
            </Typography>
            {period && (
                <Typography component='span' variant='caption' color='text.secondary'>
                    {' / '}
                    {period}
                </Typography>
            )}
        </Box>
    );
};

export const ArrowFab: FunctionComponent = () => {
    const { i18n } = useTranslation();
    return (
        <Box
            className='ticket-arrow'
            aria-hidden
            sx={{
                width: 36,
                height: 36,
                flexShrink: 0,
                display: 'grid',
                placeItems: 'center',
                borderRadius: '50%',
                color: '#fff',
                background: BRAND_GRADIENT,
                transition: 'transform 0.2s ease',
            }}
        >
            <ArrowBackRounded
                sx={{ fontSize: 20, transform: i18n.dir() === 'rtl' ? 'none' : 'scaleX(-1)' }}
            />
        </Box>
    );
};

export const NewBadge: FunctionComponent = () => {
    const { t } = useTranslation();
    return (
        <Box
            component='span'
            sx={{
                px: 0.75,
                py: 0.15,
                borderRadius: 1,
                fontSize: 11,
                fontWeight: 800,
                color: '#fff',
                background: BRAND_GRADIENT,
            }}
        >
            {t('pages.jobs.new', 'جديد')}
        </Box>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const isRecent = (iso?: string, days = 3) =>
    !!iso && Date.now() - new Date(iso).getTime() < days * 86400000;

// ─── Grid helpers ──────────────────────────────────────────

export const TICKETS_GRID_SX = {
    display: 'grid',
    gap: 2.5,
    gridTemplateColumns: {
        xs: '1fr',
        md: 'repeat(2, minmax(0, 1fr))',
        xl: 'repeat(3, minmax(0, 1fr))',
    },
} as const;

/** One staggered reveal when a page of results arrives */
export const Reveal: FunctionComponent<{ index: number; children: ReactNode }> = ({
    index,
    children,
}) => {
    const reduce = useReducedMotion();
    return (
        <m.div
            style={{ height: '100%' }}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.045, ease: 'easeOut' }}
        >
            {children}
        </m.div>
    );
};

export const TicketsSkeleton: FunctionComponent<{ count?: number }> = ({ count = 6 }) => (
    <Box sx={TICKETS_GRID_SX} aria-busy>
        {Array.from({ length: count }).map((_, i) => (
            <Paper key={i} variant='outlined' sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Skeleton variant='rectangular' height={46} />
                <Stack spacing={1.25} sx={{ p: 2.5 }}>
                    <Stack direction='row' spacing={1.75}>
                        <Skeleton variant='rounded' width={52} height={52} sx={{ borderRadius: '14px' }} />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton width='80%' height={26} />
                            <Skeleton width='50%' />
                        </Box>
                    </Stack>
                    <Skeleton width='35%' />
                    <Stack direction='row' spacing={1}>
                        <Skeleton variant='rounded' width={70} height={24} />
                        <Skeleton variant='rounded' width={70} height={24} />
                    </Stack>
                </Stack>
                <Skeleton variant='text' sx={{ mx: 2.5, mb: 2 }} height={36} />
            </Paper>
        ))}
    </Box>
);

export const EmptyState: FunctionComponent<{
    icon: ReactNode;
    title: string;
    hint?: string;
    actionLabel?: string;
    onAction?: () => void;
}> = ({ icon, title, hint, actionLabel, onAction }) => (
    <Stack alignItems='center' spacing={1.5} sx={{ py: 9, textAlign: 'center' }}>
        <Box
            sx={{
                width: 88,
                height: 88,
                display: 'grid',
                placeItems: 'center',
                borderRadius: '50%',
                fontSize: 38,
                color: BRAND_BROWN,
                bgcolor: alpha(BRAND_GOLD, 0.12),
                border: `2px dashed ${alpha(BRAND_GOLD, 0.6)}`,
            }}
        >
            {icon}
        </Box>
        <Typography sx={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: '1.2rem' }}>
            {title}
        </Typography>
        {hint && (
            <Typography variant='body2' color='text.secondary' sx={{ maxWidth: 360 }}>
                {hint}
            </Typography>
        )}
        {actionLabel && onAction && (
            <Button
                onClick={onAction}
                disableElevation
                sx={{
                    mt: 1,
                    px: 3,
                    fontWeight: 700,
                    color: '#fff',
                    background: BRAND_GRADIENT,
                    '&:hover': { background: BRAND_GRADIENT, filter: 'brightness(0.92)' },
                }}
            >
                {actionLabel}
            </Button>
        )}
    </Stack>
);