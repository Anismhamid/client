import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationAR from './ar.json';

export type Lang = 'ar' | 'he' | 'en';

const SUPPORTED: readonly Lang[] = ['ar', 'he', 'en'];
const DEFAULT_LANG: Lang = 'ar';

const lazyLoaders = {
    he: () => import('./he.json'),
    en: () => import('./en.json'),
} as const;

const stored = localStorage.getItem('lang');

const initialLang: Lang = SUPPORTED.includes(stored as Lang)
    ? (stored as Lang)
    : DEFAULT_LANG;

i18n.use(initReactI18next).init({
    resources: { ar: { translation: translationAR } },
    lng: DEFAULT_LANG,
    fallbackLng: false, // المفاتيح متطابقة بكل اللغات
    interpolation: { escapeValue: false },
});

export async function loadLanguage(lng: Lang): Promise<void> {
    if (lng !== 'ar' && !i18n.hasResourceBundle(lng, 'translation')) {
        const mod = await lazyLoaders[lng]();
        i18n.addResourceBundle(lng, 'translation', mod.default, true, true);
    }

    if (i18n.language !== lng) {
        await i18n.changeLanguage(lng);
    }
}

// main.tsx بيستنى هاد قبل الـ render. إذا فشل التحميل بتضل اللغة 'ar'
export const i18nReady = loadLanguage(initialLang);

export default i18n;