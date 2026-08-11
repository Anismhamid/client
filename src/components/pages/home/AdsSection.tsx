// components/home/AdsSection.tsx
import { Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TopAdsSection from '../ads/TopAdsSection';
import HomepageFeaturedSection from '../ads/HomepageFeaturedSection ';

const AdsSection = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
            <Container
                maxWidth='lg'
                sx={{ px: { xs: 1.5, sm: 3, md: 4 }, mb: { xs: 3, md: 4 } }}
            >
                <HomepageFeaturedSection
                    onViewAll={() => navigate('/featured-ads')}
                />
            </Container>

            <TopAdsSection />
        </Box>
    );
};

export default AdsSection;
