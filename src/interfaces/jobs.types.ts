import { User } from './User';

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

export type SalaryPeriod = 'hourly' | 'daily' | 'monthly' | 'yearly';

// ─── NEW: sectors / regions / seeker enums ─────────────────

export type JobCategory =
    | 'hi_tech'
    | 'engineering'
    | 'construction'
    | 'manufacturing'
    | 'agriculture'
    | 'transport'
    | 'retail'
    | 'hospitality'
    | 'healthcare'
    | 'education'
    | 'office'
    | 'finance'
    | 'customer_service'
    | 'security'
    | 'cleaning'
    | 'maintenance'
    | 'beauty'
    | 'media_design'
    | 'legal'
    | 'other';

export type JobRegion =
    | 'north'
    | 'haifa'
    | 'sharon'
    | 'center'
    | 'tel_aviv'
    | 'jerusalem'
    | 'south';

export type HebrewLevel = 'none' | 'basic' | 'good' | 'fluent';
export type Availability = 'immediate' | 'two_weeks' | 'month' | 'flexible';
export type SeekerLanguage = 'ar' | 'he' | 'en' | 'ru';

// ─── Jobs (offers) ─────────────────────────────────────────

export interface Job {
    _id: string;
    seller: User;
    type: JobType;
    jobTitle: string;
    category?: JobCategory;
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
    category?: JobCategory;
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

export interface AdminJobsFilters extends JobsFilters {
    search?: string;
}

export interface CreateJobPayload {
    type: JobType;
    jobTitle: string;
    category?: JobCategory;
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

export type UpdateJobPayload = Partial<CreateJobPayload>;

// ─── Job seekers ("looking for a job" posts) ───────────────

export interface JobSeeker {
    _id: string;
    user: User;
    title: string;
    category: JobCategory;
    types: JobType[];
    experienceLevel?: ExperienceLevel;
    region?: JobRegion;
    location?: string;
    remote: boolean;
    expectedSalary?: number;
    salaryPeriod?: SalaryPeriod;
    skills: string[];
    languages: SeekerLanguage[];
    hebrewLevel: HebrewLevel;
    availability: Availability;
    about?: string;
    showPhone: boolean;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface JobSeekersResponse {
    success: boolean;
    count?: number;
    seekers: JobSeeker[];
    pagination?: JobsPagination;
}

export interface JobSeekersFilters {
    q?: string;
    category?: JobCategory;
    region?: JobRegion;
    type?: JobType;
    experienceLevel?: ExperienceLevel;
    hebrewLevel?: HebrewLevel;
    remote?: boolean;
    page?: number;
    limit?: number;
}

export interface CreateJobSeekerPayload {
    title: string;
    category: JobCategory;
    types: JobType[];
    experienceLevel?: ExperienceLevel;
    region?: JobRegion;
    location?: string;
    remote: boolean;
    expectedSalary?: number;
    salaryPeriod?: SalaryPeriod;
    skills: string[];
    languages: SeekerLanguage[];
    hebrewLevel: HebrewLevel;
    availability: Availability;
    about?: string;
    showPhone: boolean;
}

export type UpdateJobSeekerPayload = Partial<CreateJobSeekerPayload>;