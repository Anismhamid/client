/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { FormikHelpers } from 'formik';

import JobSeekerForm from '../../../components/jobs/Jobseekerform';
import { CreateJobSeekerPayload } from '../../../interfaces/jobs.types';
import { createJobSeeker } from '../../../services/jobSeekersService';
import { BRAND_GOLD } from './jobsBrand';

interface CreateJobSeekerProps {
    onCreated: () => void;
}

const CreateJobSeeker: FunctionComponent<CreateJobSeekerProps> = ({ onCreated }) => {
    const { t } = useTranslation();

    const alert = (icon: 'success' | 'warning' | 'error', title: string, text: string) =>
        Swal.fire({
            icon,
            title,
            text,
            confirmButtonText: t('pages.jobs.actions.ok'),
            confirmButtonColor: BRAND_GOLD,
        });

    const handleSubmit = async (
        values: CreateJobSeekerPayload,
        helpers: FormikHelpers<CreateJobSeekerPayload>,
    ) => {
        try {
            await createJobSeeker(values);

            await alert(
                'success',
                t('pages.jobs.seekers.messages.createdTitle', 'تم النشر'),
                t('pages.jobs.seekers.messages.created', 'صار بوستك ظاهر لأصحاب العمل'),
            );

            helpers.resetForm();
            onCreated();
        } catch (error: any) {
            console.error('Create job seeker error:', error);

            const status = error?.response?.status;

            if (status === 401) {
                await alert(
                    'warning',
                    t('pages.jobs.errors.unauthorizedTitle'),
                    t('pages.jobs.errors.unauthorized'),
                );
            } else if (status === 429) {
                await alert(
                    'warning',
                    t('pages.jobs.seekers.errors.limitTitle', 'وصلت للحد الأقصى'),
                    t('pages.jobs.seekers.errors.limit', 'عندك 3 بوستات فعّالة. عطّل أو احذف واحد قبل ما تنشر جديد.'),
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

    return <JobSeekerForm onSubmit={handleSubmit} mode='create' />;
};

export default CreateJobSeeker;