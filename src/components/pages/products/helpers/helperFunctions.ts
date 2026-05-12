import { showError } from '../../../../atoms/toasts/ReactToast';
import { TFunction } from 'i18next';

export const generatePath = (path: string, params: Record<string, string>) => {
    let newPath = path;
    Object.keys(params).forEach((key) => {
        newPath = newPath.replace(`:${key}`, params[key]);
    });
    return newPath;
};

export const formatTimeAgo = (createdAt: string, t: TFunction) => {
    const now = new Date();
    const productDate = new Date(createdAt || now);
    const diffMs = now.getTime() - productDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffMinutes < 1) return t?.('justNow');
    if (diffMinutes < 60) return t?.('minutesAgo', { count: diffMinutes });
    if (diffHours < 24) return t?.('hoursAgo', { count: diffHours });
    if (diffDays < 7) return t?.('daysAgo', { count: diffDays });
    return t?.('weeksAgo', { count: diffWeeks });
};

// ----- Memoized handlers -----
export const handleShare = async () => {
    if (!navigator.share) {
        showError('المشاركة غير مدعومة في هذا المتصفح');
        return;
    }
};

