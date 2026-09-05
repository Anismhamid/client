export type JobType =
    | 'full_time'
    | 'part_time'
    | 'temporary'
    | 'remote'
    | 'daily'
    | 'internship';

export type ExperienceLevel =
    | 'no_experience'
    | 'entry'
    | 'mid'
    | 'senior'
    | 'manager';

export type SalaryPeriod =
    | 'hourly'
    | 'daily'
    | 'monthly'
    | 'yearly';

export interface Job {
    _id: string;

    seller: {
        _id: string;
        name: string;
        image?: string;
        slug?: string;
    };

    type: JobType;

    jobTitle: string;

    companyName?: string;

    industry?: string;

    experienceLevel?: ExperienceLevel;

    salaryMin?: number;

    salaryMax?: number;

    salaryPeriod?: SalaryPeriod;

    location?: string;

    remote: boolean;

    requirements?: string[];

    benefits?: string[];

    createdAt: string;

    updatedAt: string;
}

export interface JobsPagination {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export interface JobsResponse {
    success: boolean;
    count?: number;
    jobs: Job[];
    pagination?: JobsPagination;
}

export interface JobsFilters {
    type?: JobType;
    experienceLevel?: ExperienceLevel;
    salaryMin?: number;
    salaryMax?: number;
    salaryPeriod?: SalaryPeriod;
    remote?: boolean;
    location?: string;
    industry?: string;
    page?: number;
    limit?: number;
}

export interface CreateJobPayload {
    type: JobType;
    jobTitle: string;
    companyName?: string;
    industry?: string;
    experienceLevel?: ExperienceLevel;
    salaryMin?: number;
    salaryMax?: number;
    salaryPeriod?: SalaryPeriod;
    location?: string;
    remote: boolean;
    requirements?: string[];
    benefits?: string[];
}

export type UpdateJobPayload =
    Partial<CreateJobPayload>;