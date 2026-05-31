// components/home/StatsStrip.tsx
import { Box, Container, Typography } from '@mui/material';
import handleRTL from '../../../locales/handleRTL';

interface StatsStripProps {
    postsCount: number;
}

const STATS = (count: number) => [
    { num: `${count}+`, label: 'منتج نشط' },
    { num: '٢٤/٧', label: 'دعم متواصل' },
    { num: '١٠٠٪', label: 'آمن وموثوق' },
];

const StatsStrip = ({ postsCount }: StatsStripProps) => {
    const direction = handleRTL();

    return (
        <Box
            dir={direction}
            sx={{
                bgcolor: 'background.default',
                boxShadow: '10px 10px 10px rgba(245, 159, 11, 0.067)',
                py: 2.5,
                px: { xs: 2, md: 4 },
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: { xs: 3, md: 6 },
                        flexWrap: 'wrap',
                    }}
                >
                    {STATS(postsCount).map((stat) => (
                        <Box key={stat.label} sx={{ textAlign: 'center' }}>
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    fontSize: '1.25rem',
                                    color: 'text.primary',
                                    lineHeight: 1.2,
                                }}
                            >
                                {stat.num}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
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