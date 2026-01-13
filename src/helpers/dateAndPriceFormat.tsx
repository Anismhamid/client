/**
 *
 * @param date
 * @returns formated date to local ILS
 */
export const formatDate = (date: string) =>
	new Date(date).toLocaleString("he-IL", {
		year: "2-digit",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});

/**
 *
 * @param price
 * @returns formated price to local ILS
 */
export const formatPrice = (price: number) => {
	if (price === undefined || price === null || isNaN(price)) {
		return "—";
	}

	return price.toLocaleString("he-IL", {
		style: "currency",
		currency: "ILS",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});
};
