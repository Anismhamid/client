// components/ads/AdGridSkeleton.tsx
import { Grid, Skeleton } from '@mui/material';

interface AdGridSkeletonProps {
    count?: number;
    height?: number;
}

/**
 * Shared skeleton loader for ad grid sections.
 * Used by HighlightAdsSection and TopAdsSection.
 */
export const AdGridSkeleton = ({ count = 4, height = 280 }: AdGridSkeletonProps) => (
    <Grid container spacing={2.5}>
        {Array.from({ length: count }).map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
                <Skeleton
                    variant="rectangular"
                    height={height}
                    sx={{ borderRadius: 3 }}
                />
            </Grid>
        ))}
    </Grid>
);