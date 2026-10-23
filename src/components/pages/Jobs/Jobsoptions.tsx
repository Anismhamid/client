import type { TFunction } from 'i18next';
import type {
    Availability,
    ExperienceLevel,
    HebrewLevel,
    JobCategory,
    JobRegion,
    JobType,
    SalaryPeriod,
    SeekerLanguage,
} from '../../../interfaces/jobs.types';

export interface Opt<T extends string = string> {
    value: T;
    /** Arabic default label (used as i18n defaultValue) */
    ar: string;
}

export const JOB_CATEGORIES: Opt<JobCategory>[] = [
    { value: 'hi_tech', ar: 'هاي تك وبرمجة' },
    { value: 'engineering', ar: 'هندسة وتقنيين' },
    { value: 'construction', ar: 'بناء وعمارة' },
    { value: 'manufacturing', ar: 'صناعة ومصانع' },
    { value: 'agriculture', ar: 'زراعة' },
    { value: 'transport', ar: 'نقل وسياقة ولوجستيات' },
    { value: 'retail', ar: 'تجارة ومبيعات' },
    { value: 'hospitality', ar: 'مطاعم وفنادق وسياحة' },
    { value: 'healthcare', ar: 'صحة وتمريض' },
    { value: 'education', ar: 'تعليم وتربية' },
    { value: 'office', ar: 'إدارة وسكرتارية' },
    { value: 'finance', ar: 'محاسبة ومالية' },
    { value: 'customer_service', ar: 'خدمة زبائن' },
    { value: 'security', ar: 'أمن وحراسة' },
    { value: 'cleaning', ar: 'تنظيف' },
    { value: 'maintenance', ar: 'صيانة وحرف (كهربا، سباكة، نجارة...)' },
    { value: 'beauty', ar: 'تجميل وعناية' },
    { value: 'media_design', ar: 'إعلام وتصميم' },
    { value: 'legal', ar: 'قانون' },
    { value: 'other', ar: 'أخرى' },
];

export const JOB_REGIONS: Opt<JobRegion>[] = [
    { value: 'north', ar: 'الشمال' },
    { value: 'haifa', ar: 'حيفا والكرمل' },
    { value: 'sharon', ar: 'الشارون' },
    { value: 'center', ar: 'المركز' },
    { value: 'tel_aviv', ar: 'تل أبيب وغوش دان' },
    { value: 'jerusalem', ar: 'القدس' },
    { value: 'south', ar: 'الجنوب والنقب' },
];

export const HEBREW_LEVELS: Opt<HebrewLevel>[] = [
    { value: 'none', ar: 'بدون عبرية' },
    { value: 'basic', ar: 'أساسي' },
    { value: 'good', ar: 'جيد' },
    { value: 'fluent', ar: 'ممتاز' },
];

export const AVAILABILITIES: Opt<Availability>[] = [
    { value: 'immediate', ar: 'فوراً' },
    { value: 'two_weeks', ar: 'خلال أسبوعين' },
    { value: 'month', ar: 'خلال شهر' },
    { value: 'flexible', ar: 'مرن' },
];

export const SEEKER_LANGUAGES: Opt<SeekerLanguage>[] = [
    { value: 'ar', ar: 'العربية' },
    { value: 'he', ar: 'العبرية' },
    { value: 'en', ar: 'الإنجليزية' },
    { value: 'ru', ar: 'الروسية' },
];

// These already have translations in pages.jobs.*
export const JOB_TYPE_VALUES: JobType[] = [
    'full_time',
    'part_time',
    'temporary',
    'remote',
    'daily',
    'internship',
];

export const EXPERIENCE_VALUES: ExperienceLevel[] = [
    'no_experience',
    'entry',
    'mid',
    'senior',
    'manager',
];

export const SALARY_PERIOD_VALUES: SalaryPeriod[] = [
    'hourly',
    'daily',
    'monthly',
    'yearly',
];

export const optLabel = (t: TFunction, ns: string, o: Opt): string =>
    t(`pages.jobs.${ns}.${o.value}`, { defaultValue: o.ar }) as string;

export const labelOf = (
    t: TFunction,
    ns: string,
    list: Opt[],
    value?: string,
): string => {
    const o = list.find((x) => x.value === value);
    return o ? optLabel(t, ns, o) : '';
};

export const timeAgo = (iso: string | undefined, locale: string): string | null => {
    if (!iso) return null;

    const diffSec = (new Date(iso).getTime() - Date.now()) / 1000;
    if (Number.isNaN(diffSec)) return null;

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const units: [Intl.RelativeTimeFormatUnit, number][] = [
        ['month', 2592000],
        ['day', 86400],
        ['hour', 3600],
        ['minute', 60],
    ];

    for (const [unit, seconds] of units) {
        if (Math.abs(diffSec) >= seconds) {
            return rtf.format(Math.round(diffSec / seconds), unit);
        }
    }
    return rtf.format(0, 'minute');
};

/** Israeli numbers: 05x-xxxxxxx → 9725x... */
export const whatsappLink = (phone: string): string => {
    const d = phone.replace(/\D/g, '');
    const n = d.startsWith('972') ? d : d.startsWith('0') ? `972${d.slice(1)}` : d;
    return `https://wa.me/${n}`;
};