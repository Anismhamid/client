import HomeIcon from '@mui/icons-material/Home';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { AdType, FeaturedAd } from '../../interfaces/featuredAd';
import { formatDate, formatPrice } from '../../helpers/dateAndPriceFormat';



interface FeaturedAdCardProps {
    ad: FeaturedAd;
    onDelete?: (id: string) => void;
}

const typeConfig: Record<
    AdType,
    { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
    homepage: {
        label: 'Homepage',
        color: '#085041',
        bg: '#E1F5EE',
        icon: <HomeIcon sx={{ fontSize: 14 }} />,
    },
    top: {
        label: 'Top',
        color: '#633806',
        bg: '#FAEEDA',
        icon: <KeyboardArrowUpIcon sx={{ fontSize: 14 }} />,
    },
    highlight: {
        label: 'Highlight',
        color: '#3C3489',
        bg: '#EEEDFE',
        icon: <StarBorderIcon sx={{ fontSize: 14 }} />,
    },
};

const accentColor: Record<AdType, string> = {
    homepage: '#1D9E75',
    top: '#BA7517',
    highlight: '#7F77DD',
};

export default function FeaturedAdCard({ ad }: FeaturedAdCardProps) {
    const config = typeConfig[ad.type];
    const accent = accentColor[ad.type];

    const priceMap: Record<AdType, number> = {
        highlight: 10,
        top: 25,
        homepage: 50,
    };

    return (
        <Box
            sx={{
                borderRadius: 3,
                border: '0.5px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                bgcolor: 'background.paper',
                opacity: ad.isActive ? 1 : 0.65,
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: '0 2px 12px rgba(0,0,0,0.07)' },
            }}
        >
            {/* Accent top bar */}
            <Box sx={{ height: 4, bgcolor: accent }} />

            <Box sx={{ p: 2 }}>
                {/* Header row */}
                <Stack
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                    mb={1.5}
                >
                    <Chip
                        icon={config.icon as React.ReactElement}
                        label={config.label}
                        size='small'
                        sx={{
                            bgcolor: config.bg,
                            color: config.color,
                            fontWeight: 500,
                            fontSize: 11,
                            height: 22,
                            '& .MuiChip-icon': { color: config.color },
                        }}
                    />
                    <Chip
                        label={ad.isActive ? 'نشط' : 'منتهي'}
                        size='small'
                        sx={{
                            bgcolor: ad.isActive ? '#EAF3DE' : '#F1EFE8',
                            color: ad.isActive ? '#3B6D11' : '#5F5E5A',
                            fontSize: 11,
                            height: 22,
                            fontWeight: 500,
                        }}
                    />
                </Stack>

                {/* Title */}
                <Typography
                    variant='body2'
                    fontWeight={500}
                    noWrap
                    sx={{ mb: 0.5 }}
                >
                    {ad.listingId?.product_name ?? '(الإعلان محذوف)'}
                </Typography>
                <Typography
                    variant='caption'
                    color='text.secondary'
                    display='block'
                    sx={{ mb: 1.5 }}
                >
                    {ad.listingId?.location} — {ad.listingId?.category}
                </Typography>

                {/* Footer row */}
                <Stack
                    direction='row'
                    justifyContent='space-between'
                    sx={{
                        borderTop: '0.5px solid',
                        borderColor: 'divider',
                        pt: 1,
                    }}
                >
                    <Typography variant='caption' color='text.disabled'>
                        {formatDate(ad.startDate)}
                    </Typography>
                    <Typography variant='caption' color='text.disabled'>
                        {formatDate(ad.endDate)}
                    </Typography>
                    <Typography
                        variant='caption'
                        fontWeight={500}
                        sx={{ color: accent }}
                    >
                        {formatPrice(priceMap[ad.type])}
                    </Typography>
                </Stack>
            </Box>
        </Box>
    );
}
