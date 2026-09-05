/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FormikHelpers } from 'formik';

import JobForm from '../../../components/jobs/JobForm';
import { CreateJobPayload } from '../../../interfaces/jobs.types';
import { createJob } from '../../../services/jobsService';
import { path } from '../../../routes/routes';
import { useTranslation } from 'react-i18next';

const CreateJob: FunctionComponent = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSubmit = async (
        values: CreateJobPayload,
        helpers: FormikHelpers<CreateJobPayload>,
    ) => {
        try {
            const job = await createJob(values);

            await Swal.fire({
                icon: 'success',
                title: t('messages.createdTitle'),
                text: t('messages.created'),
                confirmButtonText: t('actions.ok'),
            });

            navigate(`${path.jobs}/${job._id}`);
        } catch (error: any) {
            console.error('Create job error:', error);

            const status = error?.response?.status;

            if (status === 401) {
                await Swal.fire({
                    icon: 'warning',
                    title: t('errors.unauthorizedTitle'),
                    text: t('errors.unauthorized'),
                    confirmButtonText: t('actions.ok'),
                });
            } else if (status === 403) {
                await Swal.fire({
                    icon: 'error',
                    title: t('errors.forbiddenTitle'),
                    text: t('errors.forbidden'),
                    confirmButtonText: t('actions.ok'),
                });
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: t('errors.createTitle'),
                    text: t('errors.create'),
                    confirmButtonText: t('actions.ok'),
                });
            }
        } finally {
            helpers.setSubmitting(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                    mb: 1,
                    color: '#12161C',
                }}
            >
                {t('pages.jobs.form.create')}
            </Typography>

            <Box
                sx={{
                    width: 56,
                    height: 4,
                    borderRadius: 2,
                    mb: 3,
                    background: 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)',
                }}
            />

            <JobForm
                onSubmit={handleSubmit}
                mode="create"
            />
        </Container>
    );
};

export default CreateJob;