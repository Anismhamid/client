/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { Posts } from '../interfaces/Posts';
import { showError } from '../atoms/toasts/ReactToast';

const api = `${import.meta.env.VITE_API_URL}`;

/**
 * Gets a specific product by name
 * @param productName - The name of the product to fetch
 * @returns The product data if found, or null if there's an error or product not found
 */
export const getProductById = async (product_id: string) => {
    try {
        const product = await axios.get(
            `${api}/products/spicific/${product_id}`,
            {
                headers: { Authorization: localStorage.getItem('token') },
            },
        );
        return product.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const getRelatedProducts = async (
    category: string,
    currentProductId?: string,
    limit: number = 4,
): Promise<Posts[]> => {
    try {
        // بناء الـ query params بشكل صحيح
        const params = new URLSearchParams({
            category: category,
            limit: limit.toString(),
            ...(currentProductId && { excludeId: currentProductId }), // استبعاد المنتج الحالي
        });

        const response = await axios.get(
            `${api}/products?${params.toString()}`,
        );

        // التحقق من هيكل البيانات المرجعة
        if (response.data && Array.isArray(response.data)) {
            return response.data;
        }

        // إذا كان الـ API يعيد البيانات في شكل مختلف
        if (response.data?.products && Array.isArray(response.data.products)) {
            return response.data.products;
        }

        // إذا كان الـ API يعيد بيانات داخل data
        if (response.data?.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }

        return [];
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching related products:', {
                status: error.response?.status,
                message: error.message,
                category,
            });

            // يمكن إضافة رسائل خطأ مخصصة حسب الحالة
            if (error.response?.status === 404) {
                console.warn(`No products found for category: ${category}`);
            } else if (error.response?.status === 500) {
                console.error('Server error while fetching related products');
            }
        } else {
            console.error('Unexpected error:', error);
        }

        // نعيد مصفوفة فارغة بدلاً من undefined لتجنب أخطاء في الـ UI
        return [];
    }
};

// نسخة متقدمة مع فلترة وترتيب
export const getRelatedProductsAdvanced = async (
    category: string,
    currentProductId?: string,
    options?: {
        limit?: number;
        sortBy?: 'price' | 'rating' | 'createdAt';
        sortOrder?: 'asc' | 'desc';
        minPrice?: number;
        maxPrice?: number;
    },
): Promise<Posts[]> => {
    try {
        const params = new URLSearchParams({
            category: category,
            limit: (options?.limit || 4).toString(),
            ...(options?.sortBy && { sortBy: options.sortBy }),
            ...(options?.sortOrder && { sortOrder: options.sortOrder }),
            ...(options?.minPrice && { minPrice: options.minPrice.toString() }),
            ...(options?.maxPrice && { maxPrice: options.maxPrice.toString() }),
            ...(currentProductId && { excludeId: currentProductId }),
        });

        const response = await axios.get(
            `${api}/products/related?${params.toString()}`,
        );

        return response.data?.products || response.data?.data || [];
    } catch (error) {
        console.error('Error in getRelatedProductsAdvanced:', error);
        return [];
    }
};

/**
 * Update product by id
 * @param productId - The id of the product to update
 * @param updatedProduct - The updated product data
 * @returns The updated product if successful, or null if there's an error
 */
export const updateProduct = async (
    productId: string,
    updatedProduct: Posts,
) => {
    try {
        const product = await axios.put(
            `${api}/products/${productId}`,
            updatedProduct,
            {
                headers: {
                    Authorization: localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
            },
        );
        return product.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

/**
 * Get all products from all categories
 * @returns An array of products, or an empty array if there's an error
 */
export const getAllProducts = async () => {
    try {
        const response = await axios.get(`${api}/products`);
        if (Array.isArray(response.data)) return response.data;
        return [];
    } catch (error: any) {
        console.error(error);
        return [];
    }
};

/**
 * Create a new product
 * @param products - Product data to be created
 * @returns The created product if successful, or null if there's an error
 */
export const createNewPost = async (product: Posts) => {
    try {
        const response = await axios.post(`${api}/products`, product, {
            headers: {
                Authorization: localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error: any) {
        const message =
            error?.response?.data?.message ||
            error?.message ||
            'Something went wrong';

        showError(message);

        throw error;
    }
};

/**
 * Get products in discount limit (6 items)
 * @returns An array of products on discount, or an empty array if there's an error
 */
export async function getProductsInDiscount() {
    try {
        const response = await axios.get(`${api}/discounts`);
        return response.data;
    } catch (error) {
        console.log(error);
        return [];
    }
}

/**
 * Delete product by name
 * @param productName - The name of the product to delete
 * @returns The deleted product if successful, or null if there's an error
 */
export async function deleteProduct(productId: string) {
    try {
        const response = await axios.delete(`${api}/products/${productId}`, {
            headers: {
                Authorization: localStorage.getItem('token'),
            },
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Delete product error:', {
                status: error.response?.status,
                message: error.response?.data || error.message,
                productId,
            });
            throw new Error(error.response?.data || error.message);
        }
        throw error;
    }
}

/**
 * Get products by category name
 * @param category - The name of the category to fetch products for
 * @returns Array of products if successful, or an empty array if there's an error
 */
export const getProductsByCategory = async (category: string) => {
    try {
        const response = await axios.get(`${api}/products/${category}`);
        return response.data;
    } catch (error) {
        console.log(error);

        return [];
    }
};

export const getCustomerProfileProductsBySlug = async (
    slug: string,
): Promise<Posts[]> => {
    try {
        const res = await axios.get(`${api}/products/customer/${slug}`);
        return res.data;
    } catch (err) {
        console.log(err);

        return [];
    }
};

export const toggleLike = async (productId: string) => {
    const token = localStorage.getItem('token');
    try {
        const res = await axios.patch(
            `${api}/products/${productId}/like`,
            {},
            {
                headers: { Authorization: token },
            },
        );
        return res.data; // { liked: true/false, totalLikes: number }
    } catch (error) {
        console.log(error);

        return [];
    }
};
