// components/home/AdsSection.tsx
import {
    Container,
    Box,
    Typography,
    Stack,
    alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import HomepageFeaturedSection from '../ads/HomepageFeaturedSection';
import SealBadge from './SealBadge';
import { BRAND } from '../../navbar/theme/brand';

const AdsSection = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <Box
            component='aside'
            sx={{
                position: 'relative',
                borderBottom: '1px solid',
                borderColor: 'divider',
                pb: 1,
            }}
        >
            <Container
                maxWidth='lg'
                sx={{ px: { xs: 1.5, sm: 3, md: 4 }, mb: { xs: 3, md: 4 } }}
            >
                {/* ── Masthead ─────────────────────────────── */}
                <Stack
                    direction='row'
                    alignItems='center'
                    justifyContent='space-between'
                    flexWrap='wrap'
                    rowGap={1}
                    sx={{
                        pt: { xs: 4, md: 6 },
                        pb: 2,
                        mb: 3,
                        borderBottom: `1px dashed ${alpha(BRAND.brown, 0.2)}`,
                    }}
                >
                    <Stack direction='row' alignItems='center' gap={1.25}>
                        <SealBadge size={28} rotate={-6} tone='outline'>
                            <LocalOfferOutlinedIcon sx={{ fontSize: 15 }} />
                        </SealBadge>
                        <Box>
                            <Typography
                                variant='h2'
                                fontWeight={800}
                                sx={{
                                    fontSize: { xs: '1rem', sm: '1.1rem' },
                                    letterSpacing: '-0.01em',
                                    lineHeight: 1.25,
                                }}
                            >
                                {t('ads.topAdsSection.title', 'مختارات صفقة')}
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack
                        direction='row'
                        alignItems='center'
                        gap={0.5}
                        onClick={() => navigate('/featured-ads')}
                        role='button'
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ')
                                navigate('/featured-ads');
                        }}
                        sx={{
                            cursor: 'pointer',
                            color: BRAND.brown,
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            px: 1,
                            py: 0.5,
                            borderRadius: '8px',
                            transition: 'background 0.2s ease',
                            '&:hover': { bgcolor: alpha(BRAND.brown, 0.08) },
                            '&:hover .masthead-arrow': {
                                transform: 'translateX(3px)',
                            },
                        }}
                    >
                        <Typography
                            component='span'
                            sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}
                        >
                            {t('ads.topAdsSection.viewAll', 'عرض الكل')}
                        </Typography>
                    </Stack>
                </Stack>

                {/* القسم الشامل الذي سيعرض كل الإعلانات مرتبة */}
                <HomepageFeaturedSection />
            </Container>
        </Box>
    );
};

export default AdsSection;
