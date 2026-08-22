import { FunctionComponent } from 'react';
import Style from './loader.module.css';
import { Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Loader: FunctionComponent = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    return (
        <Box
            role='status'
            aria-live='polite'
            className={Style.wrapper}
            sx={{ bgcolor: theme.palette.background.default, py: 20 }}
        >
            <Box
                display='flex'
                flexDirection='column'
                justifyContent='center'
                alignItems='center'
                gap={3}
            >
                <div className={Style.logoLoader}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 100 100'
                        className={Style.logoSvg}
                    >
                        <defs>
                            <linearGradient
                                id='safqaGradient'
                                x1='0%'
                                y1='0%'
                                x2='100%'
                                y2='100%'
                            >
                                <stop offset='0%' stopColor='#B8860B' />
                                <stop offset='100%' stopColor='#8B4513' />
                            </linearGradient>
                        </defs>
                        <circle
                            cx='50'
                            cy='50'
                            r='42'
                            fill='none'
                            stroke='url(#safqaGradient)'
                            strokeWidth='6'
                            strokeLinecap='round'
                            strokeDasharray='180 100'
                            className={Style.ring}
                        />
                    </svg>
                    <div className={Style.dot} />
                </div>

                <Typography
                    variant='h5'
                    align='center'
                    fontWeight={700}
                    className={Style.title}
                    sx={{ color: theme.palette.text.primary }}
                >
                    {t('loader.welcome')}
                </Typography>
                <Typography
                    variant='subtitle2'
                    align='center'
                    className={Style.subtitle}
                    sx={{ color: theme.palette.text.secondary }}
                >
                    {t('loader.message')}
                </Typography>
            </Box>
        </Box>
    );
};

export default Loader;
