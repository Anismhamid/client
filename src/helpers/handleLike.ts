import { showError } from '../atoms/toasts/ReactToast';
import { AuthValues } from '../interfaces/authValues';
import { Posts } from '../interfaces/Posts';
import { path } from '../routes/routes';
import { toggleLike } from '../services/postsServices';

export interface HandleLikeParams {
    isLoggedIn: boolean;
    isLiking: boolean;
    navigate: (path: string) => void;
    setIsLiking: (value: boolean) => void;
    setProduct?: (updater: (prev: Posts) => Posts) => void;
    product: Posts;
    auth?: AuthValues | null;
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
    // =========================
    // Login
    // =========================

    if (!isLoggedIn) {
        navigate(path.Login);
        return;
    }

    if (isLiking) {
        return;
    }

    // =========================
    // Validate user
    // =========================

    const userId = auth?._id;

    if (!userId) {
        showError('معلومات المستخدم غير متوفرة');
        return;
    }

    // =========================
    // Validate product
    // =========================

    const productId = product?._id;

    if (!productId) {
        console.error('❌ Like: product is missing', product);
        showError('معلومات الإعلان غير متوفرة');
        return;
    }

    // =========================
    // Request
    // =========================

    setIsLiking(true);

    try {
        const res = await toggleLike(productId);

        console.log('❤️ Toggle Like:', res);

        if (!res || typeof res.liked !== 'boolean') {
            console.error('❌ Invalid like response:', res);

            showError('استجابة غير صحيحة من الخادم');
            return;
        }

        // =========================
        // Update local product
        // =========================

        if (setProduct) {
            setProduct((prev: Posts) => {
                const currentLikes = prev.likes || [];

                if (res.liked) {
                    return {
                        ...prev,
                        likes: currentLikes.includes(userId)
                            ? currentLikes
                            : [...currentLikes, userId],
                    };
                }

                return {
                    ...prev,
                    likes: currentLikes.filter(
                        (id) => String(id) !== String(userId),
                    ),
                };
            });
        }

        // =========================
        // Callback
        // =========================

        onLikeToggle?.(productId, res.liked);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('❌ Toggle Like Error:', error);

        console.error('Status:', error?.response?.status);

        console.error('Data:', error?.response?.data);

        showError(
            error?.response?.data?.message || 'حدث خطأ أثناء تحديث المفضلة',
        );
    } finally {
        setIsLiking(false);
    }
};
