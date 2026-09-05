import { FunctionComponent } from 'react';
import {
    Grid,
    Typography,
    Box,
} from '@mui/material';

import { WorkOffOutlined } from '@mui/icons-material';

import JobsCard from './JobsCard';
import { Job } from '../../interfaces/jobs.types';

interface JobsGridProps {
    jobs: Job[];
    loading?: boolean;
}

const JobsGrid: FunctionComponent<JobsGridProps> = ({
    jobs,
    loading = false,
}) => {
    if (!loading && jobs.length === 0) {
        return (
            <Box
                sx={{
                    py: 8,
                    textAlign: 'center',
                }}
            >
                <WorkOffOutlined
                    sx={{ fontSize: 48, color: '#B8860B', mb: 1, opacity: 0.7 }}
                />

                <Typography
                    variant="h6"
                    color="text.secondary"
                >
                    لا توجد وظائف حالياً
                </Typography>
            </Box>
        );
    }

    return (
        <Grid
            container
            spacing={2}
        >
            {jobs.map((job) => (
                <Grid
                    key={job._id}
                    size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                        lg: 3,
                    }}
                >
                    <JobsCard job={job} />
                </Grid>
            ))}
        </Grid>
    );
};

export default JobsGrid;