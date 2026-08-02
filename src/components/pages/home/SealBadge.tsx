// components/home/SealBadge.tsx
// Signature element for the Home redesign: a wax-seal / stamp badge that
// echoes the idea of a "صفقة" (deal) being struck and sealed. Reused across
// HeroSection, StatsStrip and ContactCTA so the metaphor reads once and
// then feels familiar everywhere it repeats.
import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface SealBadgeProps {
    size?: number;
    rotate?: number;
    tone?: 'filled' | 'outline';
    children: ReactNode;
}

const GRADIENT_ID = 'safqa-seal-gradient';

const SealBadge = ({ size = 56, rotate = -6, tone = 'filled', children }: SealBadgeProps) => {
    const r = size / 2;

    return (
        <Box
            sx={{
                position: 'relative',
                width: size,
                height: size,
                flexShrink: 0,
                transform: `rotate(${rotate}deg)`,
                filter:
                    tone === 'filled'
                        ? 'drop-shadow(0 6px 14px rgba(139,69,19,0.35))'
                        : 'none',
            }}
        >
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <defs>
                    <linearGradient id={GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#B8860B" />
                        <stop offset="100%" stopColor="#8B4513" />
                    </linearGradient>
                </defs>
                <circle
                    cx={r}
                    cy={r}
                    r={r - 1.5}
                    fill={tone === 'filled' ? `url(#${GRADIENT_ID})` : 'none'}
                    stroke={tone === 'filled' ? 'none' : 'rgba(139,69,19,0.4)'}
                    strokeWidth={tone === 'filled' ? 0 : 1.5}
                    strokeDasharray={tone === 'filled' ? undefined : '2 4'}
                />
                {tone === 'filled' && (
                    <circle
                        cx={r}
                        cy={r}
                        r={r - 6}
                        fill="none"
                        stroke="rgba(255,255,255,0.55)"
                        strokeWidth={1.25}
                        strokeDasharray="2.5 4"
                    />
                )}
            </svg>
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `rotate(${-rotate}deg)`,
                    color: tone === 'filled' ? '#fff' : 'text.secondary',
                    lineHeight: 0,
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default SealBadge;
