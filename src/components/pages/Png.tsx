import { Button, Box, Typography, Stack } from '@mui/material';
import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import errorDogImg from '../../assets/image-removebg-preview3.png';

/**
 * 404 Page - Page Not Found
 */
const PageNotFound: FunctionComponent = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <>
            <title>{t('pages.pageNotFound.title')}</title>

            <meta
                name='description'
                content={t('pages.pageNotFound.description')}
            />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '80vh',
                    px: 2,
                }}
            >
                <Stack
                    spacing={2}
                    alignItems='center'
                    textAlign='center'
                    maxWidth={800}
                >
                    <Typography
                        variant='h4'
                        fontWeight={700}
                        sx={{
                            background:
                                'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        {t('pages.pageNotFound.heading')}
                    </Typography>

                    <Box
                        component='img'
                        src={errorDogImg}
                        alt={t('pages.pageNotFound.imageAlt')}
                        sx={{
                            width: '100%',
                            maxWidth: 500,
                            filter: 'drop-shadow(10px -10px 6px rgba(136, 134, 134, 0.3))',
                        }}
                    />

                    <Typography variant='body1' color='text.secondary'>
                        {t('pages.pageNotFound.message')}
                    </Typography>

                    <Button
                        variant='contained'
                        onClick={() => navigate(-1)}
                        sx={{
                            mt: 2,
                            background:
                                'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)',
                            '&:hover': {
                                background:
                                    'linear-gradient(135deg, #8B4513 0%, #B8860B 100%)',
                            },
                        }}
                    >
                        {t('pages.pageNotFound.goBack')}
                    </Button>
                </Stack>
            </Box>
        </>
    );
};

export default PageNotFound;
