import {showError, showSuccess} from "../atoms/toasts/ReactToast";
import {AuthValues} from "../interfaces/authValues";
import {Products} from "../interfaces/Posts";
import {path} from "../routes/routes";
import {toggleLike} from "../services/postsServices";

export interface HandleLikeParams {
	isLoggedIn: boolean;
	isLiking: boolean;
	navigate: (path: string) => void;
	setIsLiking: (value: boolean) => void;
	setProduct?: (updater: (prev: Products) => Products) => void;
	product: Products;
	auth: AuthValues;
	onLikeToggle?: (productId: string, liked: boolean) => void;
}

export const handleLike = async ({
	isLoggedIn,
	isLiking,
	navigate,
	setIsLiking,
	setProduct,
	product,
	auth,
	onLikeToggle,
}: HandleLikeParams): Promise<void> => {
	if (!isLoggedIn) {
		navigate(path.Login);
		return;
	}

	if (isLiking) return;

	// تحقق من وجود auth._id
	if (!auth?._id) {
		showError("معلومات المستخدم غير متوفرة");
		return;
	}

	const userId = auth._id; // تأكد أن userId موجود

	setIsLiking(true);
	try {
		const res = await toggleLike(product._id ?? "");

		// تحديث حالة المنتج إذا تم تمرير setProduct
		if (setProduct) {
			setProduct((prev: Products) => ({
				...prev,
				likes: res.liked
					? [...(prev.likes || []), userId]
					: (prev.likes || []).filter((id) => id !== userId),
			}));
		}

		// استدعاء callback إذا كان موجوداً
		if (onLikeToggle) {
			onLikeToggle(product._id!, res.liked);
		}

		showSuccess(
			res.liked ? "تمت إضافة المنتج للمفضلة" : "تمت إزالة المنتج من المفضلة",
		);
	} catch (err) {
		console.error(err);
		showError("حدث خطأ أثناء تحديث المفضلة");
	} finally {
		setIsLiking(false);
	}
};
