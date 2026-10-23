import api from './api';
import type {
    CreateJobSeekerPayload,
    JobSeeker,
    JobSeekersFilters,
    JobSeekersResponse,
    UpdateJobSeekerPayload,
} from '../interfaces/jobs.types';

const BASE = '/job-seekers';

export const searchJobSeekers = async (
    filters: JobSeekersFilters,
): Promise<JobSeekersResponse> => {
    const { data } = await api.get<JobSeekersResponse>(BASE, { params: filters });
    return data;
};

export const getMyJobSeekers = async (): Promise<JobSeeker[]> => {
    const { data } = await api.get<{ seekers: JobSeeker[] }>(`${BASE}/mine`);
    return data.seekers;
};

export const getJobSeekerById = async (id: string): Promise<JobSeeker> => {
    const { data } = await api.get<{ seeker: JobSeeker }>(`${BASE}/${id}`);
    return data.seeker;
};

export const createJobSeeker = async (
    payload: CreateJobSeekerPayload,
): Promise<JobSeeker> => {
    const { data } = await api.post<{ seeker: JobSeeker }>(BASE, payload);
    return data.seeker;
};

export const updateJobSeeker = async (
    id: string,
    payload: UpdateJobSeekerPayload,
): Promise<JobSeeker> => {
    const { data } = await api.put<{ seeker: JobSeeker }>(`${BASE}/${id}`, payload);
    return data.seeker;
};

export const toggleJobSeeker = async (id: string): Promise<JobSeeker> => {
    const { data } = await api.patch<{ seeker: JobSeeker }>(`${BASE}/${id}/toggle`);
    return data.seeker;
};

export const deleteJobSeeker = async (id: string): Promise<void> => {
    await api.delete(`${BASE}/${id}`);
};