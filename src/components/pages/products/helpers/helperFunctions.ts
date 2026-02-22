import {showError} from "../../../../atoms/toasts/ReactToast";

export const generatePath = (path: string, params: Record<string, string>) => {
	let newPath = path;
	Object.keys(params).forEach((key) => {
		newPath = newPath.replace(`:${key}`, params[key]);
	});
	return newPath;
};

export const formatTimeAgo = (createdAt: string) => {
	const now = new Date();
	const productDate = new Date(createdAt || now);
	const diffMs = now.getTime() - productDate.getTime();
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

	if (diffHours < 1) return "منذ دقائق";
	if (diffHours < 24) return `منذ ${diffHours} ساعة`;
	if (diffHours < 168) return `منذ ${Math.floor(diffHours / 24)} يوم`;
	return `منذ ${Math.floor(diffHours / 168)} أسبوع`;
};

// ----- Memoized handlers -----
export const handleShare = async () => {
	if (!navigator.share) {
		showError("المشاركة غير مدعومة في هذا المتصفح");
		return;
	}
};
