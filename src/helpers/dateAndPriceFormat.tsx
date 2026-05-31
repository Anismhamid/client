import dayjs from 'dayjs';

/**
 *
 * @param date
 * @returns formated date to local ILS
 */
export const formatDate = (date: string) => {
    return dayjs(date).format('HH:mm - DD/MM/YYYY');
};

/**
 *
 * @param price
 * @returns formated price to local ILS
 */
export const formatPrice = (price: number) => {
    if (price === undefined || price === null || isNaN(price)) {
        return '—';
    }

    return price.toLocaleString('he-IL', {
        style: 'currency',
        currency: 'ILS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
};
