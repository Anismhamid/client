/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent } from 'react';
import { Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { FormikHelpers } from 'formik';

import JobForm from '../../../components/jobs/JobForm';
import { CreateJobPayload } from '../../../interfaces/jobs.types';
import { createJob } from '../../../services/jobsService';
import { path } from '../../../routes/routes';
import { BRAND_GOLD } from './jobsBrand';
import JobsPageHeading from './JobsPageHeading';

interface CreateJobProps {
    /** لما يكون داخل JobsPage: بدون Container وبدون عنوان */
    embedded?: boolean;
}

const CreateJob: FunctionComponent<CreateJobProps> = ({ embedded = false }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

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

    const handleSubmit = async (
        values: CreateJobPayload,
        helpers: FormikHelpers<CreateJobPayload>,
    ) => {
        try {
            const job = await createJob(values);

            await alert(
                'success',
                t('pages.jobs.messages.createdTitle'),
                t('pages.jobs.messages.created'),
            );

            navigate(`${path.jobs}/${job._id}`);
        } catch (error: any) {
            console.error('Create job error:', error);

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
                    t('pages.jobs.errors.createTitle'),
                    t('pages.jobs.errors.create'),
                );
            }
        } finally {
            helpers.setSubmitting(false);
        }
    };

    if (embedded) {
        return <JobForm onSubmit={handleSubmit} mode='create' />;
    }

    return (
        <Container maxWidth='md' sx={{ py: 4 }}>
            <JobsPageHeading title={t('pages.jobs.form.create')} />
            <JobForm onSubmit={handleSubmit} mode='create' />
        </Container>
    );
};

export default CreateJob;