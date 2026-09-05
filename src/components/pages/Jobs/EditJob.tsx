/* eslint-disable @typescript-eslint/no-explicit-any */

import { FunctionComponent, useEffect, useState } from 'react';

import {
    Box,
    CircularProgress,
    Container,
    Typography,
} from '@mui/material';

import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { FormikHelpers } from 'formik';

import JobForm from '../../../components/jobs/JobForm';

import {
    CreateJobPayload,
    Job,
} from '../../../interfaces/jobs.types';

import {
    getJobById,
    updateJob,
} from '../../../services/jobsService';

import { path } from '../../../routes/routes';

const EditJob: FunctionComponent = () => {
    const { id } = useParams<{ id: string }>();

    const navigate = useNavigate();

    const { t } = useTranslation();

    const [job, setJob] = useState<Job | null>(null);

    const [loading, setLoading] = useState(true);

    // =====================================================
    // Load Job
    // =====================================================

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const loadJob = async () => {
            try {
                setLoading(true);

                const data = await getJobById(id);

                setJob(data);
            } catch (error) {
                console.error('Load job error:', error);

                await Swal.fire({
                    icon: 'error',
                    title: t('pages.jobs.errors.loadTitle'),
                    text: t('pages.jobs.errors.load'),
                    confirmButtonText: t('pages.jobs.actions.ok'),
                });

                navigate(path.jobs, {
                    replace: true,
                });
            } finally {
                setLoading(false);
            }
        };

        loadJob();
    }, [id, navigate, t]);

    // =====================================================
    // Submit
    // =====================================================

    const handleSubmit = async (
        values: CreateJobPayload,
        helpers: FormikHelpers<CreateJobPayload>,
    ) => {
        if (!id) {
            helpers.setSubmitting(false);
            return;
        }

        try {
            const updatedJob = await updateJob(
                id,
                values,
            );

            await Swal.fire({
                icon: 'success',
                title: t('pages.jobs.messages.updatedTitle'),
                text: t('pages.jobs.messages.updated'),
                confirmButtonText: t('pages.jobs.actions.ok'),
            });

            navigate(
                `${path.jobs}/${updatedJob._id}`,
                {
                    replace: true,
                },
            );
        } catch (error: any) {
            console.error(
                'Update job error:',
                error,
            );

            const status =
                error?.response?.status;

            // =====================================================
            // Unauthorized
            // =====================================================

            if (status === 401) {
                await Swal.fire({
                    icon: 'warning',
                    title: t(
                        'pages.jobs.errors.unauthorizedTitle',
                    ),
                    text: t(
                        'pages.jobs.errors.unauthorized',
                    ),
                    confirmButtonText: t(
                        'pages.jobs.actions.ok',
                    ),
                });
            }

            // =====================================================
            // Forbidden
            // =====================================================

            else if (status === 403) {
                await Swal.fire({
                    icon: 'error',
                    title: t(
                        'pages.jobs.errors.forbiddenTitle',
                    ),
                    text: t(
                        'pages.jobs.errors.forbidden',
                    ),
                    confirmButtonText: t(
                        'pages.jobs.actions.ok',
                    ),
                });
            }

            // =====================================================
            // General Error
            // =====================================================

            else {
                await Swal.fire({
                    icon: 'error',
                    title: t(
                        'pages.jobs.errors.updateTitle',
                    ),
                    text: t(
                        'pages.jobs.errors.update',
                    ),
                    confirmButtonText: t(
                        'pages.jobs.actions.ok',
                    ),
                });
            }
        } finally {
            helpers.setSubmitting(false);
        }
    };

    // =====================================================
    // Loading
    // =====================================================

    if (loading) {
        return (
            <Container
                maxWidth='md'
                sx={{
                    py: 8,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CircularProgress />
            </Container>
        );
    }

    // =====================================================
    // Job not found
    // =====================================================

    if (!job) {
        return null;
    }

    // =====================================================
    // Render
    // =====================================================

    return (
        <Container
            maxWidth='md'
            sx={{
                py: 4,
            }}
        >
            <Typography
                variant='h4'
                fontWeight={700}
                sx={{
                    mb: 1,
                    color: '#12161C',
                }}
            >
                {t('pages.jobs.form.update')}
            </Typography>

            <Box
                sx={{
                    width: 56,
                    height: 4,
                    borderRadius: 2,
                    mb: 3,
                    background:
                        'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)',
                }}
            />

            <JobForm
                initialValues={job}
                onSubmit={handleSubmit}
                mode='edit'
            />
        </Container>
    );
};

export default EditJob;