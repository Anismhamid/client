// components/home/HeroFloatingChips.tsx
import {
    Box,
    ButtonBase,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { m } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import type { ReactNode } from 'react';
import { WorkOutline } from '@mui/icons-material';

const GRADIENT = 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)';
const INK = '#12161C';

interface Chip {
    key: string;
    label: string;
    icon: ReactNode;
    to: string;
    top: string;
    insetInlineStart: string; // logical: يتبع RTL
    primary?: boolean;
    delay: number;
}

const HeroFloatingChips = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

    if (!isDesktop) return null;

    const chips: Chip[] = [
        // 3. أقصى اليمين حد اللوغو
        {
            key: 'messages',
            label: t('hero.messages', 'محادثاتي'),
            icon: <ChatBubbleOutlineIcon fontSize='small' />,
            to: '/messages/chat',
            top: '50%',
            insetInlineStart: '8%',
            delay: 0.8,
        },
        // 4. بين الكرت والنص
        {
            key: 'jobs',
            label: t('hero.jobs', 'وظائف'),
            icon: <WorkOutline fontSize='small' />,
            to: '/jobs',
            top: '46%',
            insetInlineStart: '47%',
            delay: 2.5,
        },
    ];
    return (
        <Box
            sx={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 3,
            }}
        >
            {chips.map((c) => (
                <Box
                    key={c.key}
                    sx={{
                        position: 'relative',
                        top: c.top,
                        insetInlineStart: c.insetInlineStart,
                        zIndex: 3,
                    }}
                >
                    <m.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                        transition={{
                            opacity: { duration: 0.4, delay: c.delay * 0.3 },
                            scale: { duration: 0.4, delay: c.delay * 0.3 },
                            y: {
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: c.delay,
                            },
                        }}
                    >
                        <ButtonBase
                            onClick={() => navigate(c.to)}
                            aria-label={c.label}
                            sx={{
                                pointerEvents: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.75,
                                px: 1.75,
                                py: 0.9,
                                borderRadius: '0px 20px 20px 20px',
                                background: c.primary ? GRADIENT : '#fff',
                                color: c.primary ? '#fff' : INK,
                                border: c.primary
                                    ? 'none'
                                    : '1px solid rgba(184,134,11,.35)',
                                boxShadow: '0 8px 20px rgba(139,69,19,.15)',
                                transition: 'transform .2s, box-shadow .2s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow:
                                        '0 12px 26px rgba(139,69,19,.25)',
                                },
                            }}
                        >
                            {c.icon}
                            <Typography variant='body2' fontWeight={700} noWrap>
                                {c.label}
                            </Typography>
                        </ButtonBase>
                    </m.div>
                </Box>
            ))}
        </Box>
    );
};

export default HeroFloatingChips;
