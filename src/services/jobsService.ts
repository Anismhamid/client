import api from './api';

import {
    CreateJobPayload,
    Job,
    JobsFilters,
    JobsResponse,
    UpdateJobPayload,
} from '../interfaces/jobs.types';

const JOBS_BASE = '/jobs';

// =====================================================
// Get jobs
// =====================================================

export const getJobs = async (): Promise<JobsResponse> => {
    const { data } = await api.get<JobsResponse>(JOBS_BASE);

    return data;
};

// =====================================================
// Search jobs
// =====================================================

export const searchJobs = async (
    filters: JobsFilters,
): Promise<JobsResponse> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
        }
    });

    const { data } = await api.get<JobsResponse>(
        `${JOBS_BASE}/search`,
        { params },
    );

    return data;
};

// =====================================================
// Get jobs by type
// =====================================================

export const getJobsByType = async (
    type: string,
): Promise<JobsResponse> => {
    const { data } = await api.get<JobsResponse>(
        `${JOBS_BASE}/type/${type}`,
    );

    return data;
};

// =====================================================
// Get single job
// =====================================================

export const getJobById = async (id: string): Promise<Job> => {
    const { data } = await api.get<{
        success: boolean;
        job: Job;
    }>(`${JOBS_BASE}/${id}`);

    return data.job;
};

// =====================================================
// Create job
// =====================================================

export const createJob = async (
    payload: CreateJobPayload,
): Promise<Job> => {
    const { data } = await api.post<{
        success: boolean;
        job: Job;
    }>(JOBS_BASE, payload);

    return data.job;
};

// =====================================================
// Update job
// =====================================================

export const updateJob = async (
    id: string,
    payload: UpdateJobPayload,
): Promise<Job> => {
    const { data } = await api.patch<{
        success: boolean;
        job: Job;
    }>(`${JOBS_BASE}/${id}`, payload);

    return data.job;
};

// =====================================================
// Delete job
// =====================================================

export const deleteJob = async (id: string): Promise<void> => {
    await api.delete(`${JOBS_BASE}/${id}`);
};