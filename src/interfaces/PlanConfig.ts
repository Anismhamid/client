// config/plansConfig.ts
import BoltIcon from '@mui/icons-material/Bolt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import { SvgIconComponent } from '@mui/icons-material';
import { AdType } from '../interfaces/featuredAd';

export interface PlanConfig {
    id: AdType;
    title: string;
    description: string;
    price: number;
    days: number;
    icon: SvgIconComponent;
    emoji: string;
    accent: string;      // اللون الأساسي (للحدود والأزرار)
    lightBg: string;     // خلفية فاتحة (للوضع النهاري)
    darkBg: string;      // خلفية داكنة (للوضع الليلي)
    perks: string[];     // قائمة المزايا
    recommended?: boolean; // هل هي الباقة الأكثر شعبية؟
    order: number;       // رقم الترتيب (1 = الأرخص)
}

// ⚠️ الترتيب هنا هو "المصدر الوحيد للحقيقة" ⚠️
export const PLANS: PlanConfig[] = [
    {
        id: 'highlight',
        title: 'تمييز الإعلان',
        description: 'أضف لمسة جمالية لإعلانك داخل القوائم',
        price: 10,
        days: 7,
        icon: BoltIcon,
        emoji: '✨',
        accent: '#ca8a04', // أصفر/ذهبي
        lightBg: '#FEF9C3',
        darkBg: '#332c08',
        order: 1,
        perks: [
            'إطار ملون حول الإعلان',
            'تمييز في قائمة البحث',
            'مدة 7 أيام',
        ],
    },
    {
        id: 'top',
        title: 'أعلى البحث',
        description: 'تصدر نتائج البحث وكن أول من يراه المشترون',
        price: 25,
        days: 7,
        icon: TrendingUpIcon,
        emoji: '🚀',
        accent: '#c2410c', // برتقالي
        lightBg: '#FFEDD5',
        darkBg: '#3a2211',
        order: 2,
        perks: [
            'الظهور في مقدمة نتائج البحث',
            'أولوية في التصفح',
            'شارة "مميز" على الإعلان',
            'مدة 7 أيام',
        ],
    },
    {
        id: 'homepage',
        title: 'الصفحة الرئيسية',
        description: 'أقصى درجات الظهور.. إعلانك في واجهة الموقع',
        price: 50,
        days: 7,
        icon: StarIcon,
        emoji: '🏠',
        accent: '#B8860B', // ذهبي داكن
        lightBg: '#FEF3C7',
        darkBg: '#3b2c0f',
        order: 3,
        recommended: true, // الأكثر شعبية
        perks: [
            'الظهور في الصفحة الرئيسية',
            'مشاهدات مضاعفة',
            'شارة ذهبية مميزة',
            'دعم فني ذو أولوية',
            'مدة 7 أيام',
        ],
    },
];

// دالة مساعدة للبحث السريع
export const getPlanById = (id: AdType) => PLANS.find(p => p.id === id);