// Logo component with variants
import { useState } from 'react';
import {
    alpha,
    Box,
    CardMedia,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';

interface SafqaLogoProps {
    onClick?: () => void;
}

const SafqaLogo = ({ onClick }: SafqaLogoProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Box
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={onClick}
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
                gap: 1,
                textDecoration: 'none',
            }}
        >
            {/* Animated Icon */}
            <Box
                component={motion.div}
                animate={{
                    rotate: isHovered ? [0, -5, 5, 0] : 0,
                    borderRadius: isHovered ? '16px' : '12px',
                }}
                transition={{ duration: 0.3 }}
                sx={{
                    width: { xs: 36, sm: 60 },
                    height: { xs: 36, sm: 60 },
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isHovered
                        ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`
                        : 'none',
                }}
            >
                <CardMedia
                    component='img'
                    image='/d3.png'
                    alt='صفقة | Safqa'
                    sx={{ width: '100%', height: '100%' }}
                />
            </Box>

            {/* Text (hidden on very small screens) */}
            {!isMobile && (
                <Box>
                    <Typography
                        variant='h6'
                        sx={{
                            fontWeight: 800,
                            lineHeight: 1.2,
                            background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        صفقة
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Typography
                            variant='caption'
                            sx={{ color: 'text.secondary', fontWeight: 500 }}
                        >
                            SAFQA
                        </Typography>
                        <Typography
                            variant='caption'
                            sx={{ color: 'text.disabled' }}
                        >
                            ספקה
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
};
export default SafqaLogo;
