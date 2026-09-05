// components/home/AdsSection.tsx
import { Container, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import TopAdsSection from '../ads/TopAdsSection';
import HomepageFeaturedSection from '../ads/HomepageFeaturedSection';
import SealBadge from './SealBadge';

const AdsSection = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
            <Container
                maxWidth='lg'
                sx={{ px: { xs: 1.5, sm: 3, md: 4 }, mb: { xs: 3, md: 4 } }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 2,
                        pt: { xs: 3, md: 4 },
                    }}
                >
                    <SealBadge size={26} rotate={-6} tone='outline'>
                        <LocalOfferOutlinedIcon sx={{ fontSize: 14 }} />
                    </SealBadge>
                    <Typography
                        variant='overline'
                        sx={{
                            fontWeight: 700,
                            letterSpacing: 0.6,
                            color: 'text.secondary',
                        }}
                    >
                        {t('featuredAds.eyebrow', 'إعلانات مميزة')}
                    </Typography>
                </Box>

                <HomepageFeaturedSection
                    onViewAll={() => navigate('/featured-ads')}
                />
            </Container>

            <TopAdsSection />
        </Box>
    );
};

export default AdsSection;