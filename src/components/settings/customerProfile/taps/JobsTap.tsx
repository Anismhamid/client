import { Grid, Box, Chip, Typography } from '@mui/material';
import { FunctionComponent } from 'react';
import { m } from 'framer-motion';
import { LocalOffer, WorkOutline } from '@mui/icons-material';
import { Job } from '../../../../interfaces/jobs.types';
import { User } from '../../../../interfaces/chat/usersMessages';
import { useTranslation } from 'react-i18next';
import JobsCard from '../../../jobs/JobsCard';

// هوية صفقة اللونية الموحدة
const BRAND_GOLD = '#B8860B';
const BRAND_BROWN = '#8B4513';
const BRAND_GRADIENT = `linear-gradient(90deg, ${BRAND_GOLD}, ${BRAND_BROWN})`;

interface JobsTabProps {
   
    jobs: Job[];
    user: User;
}

// ملاحظة: التبويب (TabPanel) مغلَّف مرة واحدة فقط من الأب CustomerProfile
const JobsTab: FunctionComponent<JobsTabProps> = ({ jobs, user }) => {
    const { t } = useTranslation();

    return (
        <Box m={4}>
            <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                m={3}
            >
                <Typography
                    variant='h5'
                    fontWeight='bold'
                    sx={{ position: 'relative' }}
                >
                    {t('pages.jobs.postedBy', { defaultValue: 'وظائف' })}{' '}
                    {user.name?.first}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: -8,
                            insetInlineStart: 0,
                            width: 60,
                            height: 4,
                            background: BRAND_GRADIENT,
                            borderRadius: 2,
                        }}
                    />
                </Typography>

                <Chip
                    icon={<LocalOffer />}
                    label={`${jobs.length} ${t('common.availablePosts')}`}
                    variant='outlined'
                    sx={{
                        px: 1,
                        borderColor: BRAND_GOLD,
                        color: BRAND_BROWN,
                        fontWeight: 700,
                    }}
                />
            </Box>

            {jobs.length > 0 ? (
                <Grid container spacing={3}>
                    {jobs.map((job, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={job._id}>
                            <m.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.05,
                                }}
                            >
                                <JobsCard job={job} />
                            </m.div>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box textAlign='center' py={10}>
                    <WorkOutline
                        sx={{
                            fontSize: 80,
                            color: 'text.secondary',
                            mb: 2,
                        }}
                    />
                    <Typography
                        variant='h6'
                        color='text.secondary'
                        gutterBottom
                    >
                        {t('pages.jobs.noJobs', {
                            defaultValue: 'ما في وظائف مضافة',
                        })}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                        {t('pages.jobs.noJobsYet', {
                            defaultValue: `${user.name?.first} لسا ما نشر أي وظيفة`,
                            name: user.name?.first,
                        })}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default JobsTab;