import { Box, Chip, IconButton, Stack, Typography } from '@mui/material';
import { FeaturedAd } from '../../../interfaces/featuredAd';
import { formatDate, formatPrice } from '../../../helpers/dateAndPriceFormat';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import {
    FEATURED_AD_ICONS,
    FEATURED_AD_PRICES,
    FEATURED_AD_TIERS,
} from '../../../interfaces/featuredAdsMeta';

interface FeaturedAdCardProps {
    ad: FeaturedAd;
    onDelete?: (id: string) => void;
}

export default function FeaturedAdCard({ ad, onDelete }: FeaturedAdCardProps) {
    const tier = FEATURED_AD_TIERS[ad.type];
    const Icon = FEATURED_AD_ICONS[ad.type];

    return (
        <Box
            sx={{
                borderRadius: 3,
                border: '1.5px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                opacity: ad.isActive ? 1 : 0.65,
                transition: 'box-shadow 0.2s, transform 0.2s',
                '&:hover': {
                    boxShadow: `0 4px 20px ${tier.accent}25`,
                    transform: 'translateY(-2px)',
                },
            }}
        >
            {/* Accent top bar */}
            <Box sx={{ height: 5, bgcolor: tier.accent }} />

            <Box sx={{ p: 2 }}>
                {/* Header row */}
                <Stack
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                    mb={1.5}
                >
                    <Chip
                        icon={<Icon sx={{ fontSize: 14 }} />}
                        label={tier.label}
                        size='small'
                        sx={{
                            bgcolor: tier.bg,
                            color: tier.color,
                            fontWeight: 700,
                            fontSize: 11,
                            height: 22,
                            '& .MuiChip-icon': { color: tier.color },
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
                            fontWeight: 700,
                        }}
                    />
                </Stack>

                {/* Title */}
                <Typography
                    variant='body2'
                    fontWeight={600}
                    noWrap
                    sx={{ mb: 0.5 }}
                >
                    {ad.listingId?.product_name}
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
                        fontWeight={700}
                        sx={{ color: tier.accent }}
                    >
                        {formatPrice(FEATURED_AD_PRICES[ad.type])}
                    </Typography>
                </Stack>
                {onDelete && (
                    <IconButton
                        size='small'
                        onClick={() => onDelete(ad._id)}
                        sx={{
                            ml: 0.5,
                            color: 'text.disabled',
                            '&:hover': { color: 'error.main' },
                        }}
                    >
                        <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                )}
            </Box>
        </Box>
    );
}
