// theme/brand.ts
// مصدر واحد لهوية صفقة — غيّر هون وبيتغير بكل الصفحات.
export const BRAND = {
    gold: '#B8860B',
    brown: '#8B4513',
    gradient: 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)',
    // brown بشفافية، للخطوط والـ hover والظلال
    ledger: (alpha = 0.05) => `rgba(139,69,19,${alpha})`,
    // خطوط الدفتر الأفقية
    ledgerLines: (alpha = 0.05, gap = 26) =>
        `repeating-linear-gradient(rgba(139,69,19,${alpha}) 0px, rgba(139,69,19,${alpha}) 1px, transparent 1px, transparent ${gap}px)`,
} as const;