import { FunctionComponent } from 'react';
import { Box, Typography } from '@mui/material';
import { BRAND_GRADIENT } from './jobsBrand';

interface JobsPageHeadingProps {
    title: string;
}

const JobsPageHeading: FunctionComponent<JobsPageHeadingProps> = ({
    title,
}) => (
    <Box sx={{ mb: 3 }}>
        <Typography
            variant='h4'
            component='h1'
            fontWeight={800}
            sx={{ lineHeight: 1.25 }}
        >
            {title}
        </Typography>

        <Box
            sx={{
                width: 56,
                height: 4,
                borderRadius: 2,
                mt: 1,
                background: BRAND_GRADIENT,
            }}
        />
    </Box>
);

export default JobsPageHeading;