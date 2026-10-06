/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent, useEffect, useState } from 'react';
import { CircularProgress, Container } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { FormikHelpers } from 'formik';

import JobForm from '../../../components/jobs/JobForm';
import { CreateJobPayload, Job } from '../../../interfaces/jobs.types';
import { getJobById, updateJob } from '../../../services/jobsService';
import { path } from '../../../routes/routes';
import JobsPageHeading from './JobsPageHeading';
import { BRAND_GOLD } from './jobsBrand';

const EditJob: FunctionComponent = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);

    const alert = (
        icon: 'success' | 'warning' | 'error',
        title: string,
        text: string,
    ) =>
        Swal.fire({
            icon,
            title,
            text,
            confirmButtonText: t('pages.jobs.actions.ok'),
            confirmButtonColor: BRAND_GOLD,
        });

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const loadJob = async () => {
            try {
                setLoading(true);
                setJob(await getJobById(id));
            } catch (error) {
                console.error('Load job error:', error);

                await alert(
                    'error',
                    t('pages.jobs.errors.loadTitle'),
                    t('pages.jobs.errors.load'),
                );

                navigate(path.jobs, { replace: true });
            } finally {
                setLoading(false);
            }
        };

        loadJob();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, navigate, t]);

    const handleSubmit = async (
        values: CreateJobPayload,
        helpers: FormikHelpers<CreateJobPayload>,
    ) => {
        if (!id) {
            helpers.setSubmitting(false);
            return;
        }

        try {
            const updatedJob = await updateJob(id, values);

            await alert(
                'success',
                t('pages.jobs.messages.updatedTitle'),
                t('pages.jobs.messages.updated'),
            );

            navigate(`${path.jobs}/${updatedJob._id}`, { replace: true });
        } catch (error: any) {
            console.error('Update job error:', error);

            const status = error?.response?.status;

            if (status === 401) {
                await alert(
                    'warning',
                    t('pages.jobs.errors.unauthorizedTitle'),
                    t('pages.jobs.errors.unauthorized'),
                );
            } else if (status === 403) {
                await alert(
                    'error',
                    t('pages.jobs.errors.forbiddenTitle'),
                    t('pages.jobs.errors.forbidden'),
                );
            } else {
                await alert(
                    'error',
                    t('pages.jobs.errors.updateTitle'),
                    t('pages.jobs.errors.update'),
                );
            }
        } finally {
            helpers.setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Container
                maxWidth='md'
                sx={{ py: 8, display: 'flex', justifyContent: 'center' }}
            >
                <CircularProgress sx={{ color: BRAND_GOLD }} />
            </Container>
        );
    }

    if (!job) return null;

    return (
        <Container maxWidth='md' sx={{ py: 4 }}>
            <JobsPageHeading title={t('pages.jobs.form.update')} />
            <JobForm initialValues={job} onSubmit={handleSubmit} mode='edit' />
        </Container>
    );
};

export default EditJob;