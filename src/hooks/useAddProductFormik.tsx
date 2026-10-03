import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { createNewPost } from '../services/postsServices';
import { Posts } from '../interfaces/Posts';
import { useState } from 'react';
import { uploadImage } from '../services/uploadImage';
import { useUser } from './useUSer';

const useAddPostFormik = (
    onHide: () => void,
    onSuccess?: () => void,
    onError?: (error: unknown) => void,
) => {
    const { t } = useTranslation();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const { auth } = useUser();
    const [imageData, setImageData] = useState<{
        url: string;
        publicId: string;
    } | null>(null);

    const formik = useFormik<Posts>({
        initialValues: {
            product_name: '',
            image: { url: '', publicId: '' },
            category: 'House',
            subcategory: '',
            type: '',
            price: 0,
            description: '',
            sale: false,
            discount: 0,
            in_stock: true,
            location: auth?.address?.city || '',
            featured: false,
        },
        validationSchema: yup.object({
            product_name: yup
                .string()
                .min(2, t('modals.addProductModal.validation.productNameMin'))
                .required(
                    t('modals.addProductModal.validation.productNameRequired'),
                ),
            // الصورة مطلوبة: إعلان بدون صورة بيضعّف الشبكة كلها
            image: yup.object({
                url: yup
                    .string()
                    .required(
                        t(
                            'modals.addProductModal.validation.imageRequired',
                            'أضف صورة للمنتج',
                        ),
                    ),
            }),
            category: yup
                .string()
                .required(
                    t('modals.addProductModal.validation.categoryRequired'),
                ),
            price: yup
                .number()
                .required(t('modals.addProductModal.validation.priceRequired')),
            type: yup.string(),
            description: yup
                .string()
                .min(2, t('modals.addProductModal.validation.descriptionMin'))
                .max(
                    500,
                    t('modals.addProductModal.validation.descriptionMax'),
                ),

            sale: yup.boolean(),
            discount: yup.number(),
            location: yup.string(),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                let uploadedImage = imageData;

                if (imageFile && !imageData) {
                    uploadedImage = await uploadImage(imageFile);
                    setImageData({
                        url: uploadedImage.url,
                        publicId: uploadedImage.publicId,
                    });
                }

                // ما نبعت status من الكلاينت أبدًا: السيرفر هو اللي بيقرّر (pending / approved)
                await createNewPost({
                    ...values,
                    image: {
                        url: uploadedImage?.url || '',
                        publicId: uploadedImage?.publicId || '',
                    },
                });

                resetForm();
                setImageFile(null);
                setImageData(null);
                onSuccess?.();
                onHide?.();
            } catch (error) {
                console.error(error);
                // قبل: الفشل كان صامت والمستخدم ما يعرف شو صار
                onError?.(error);
            }
        },
    });
    return { formik, imageFile, setImageFile, imageData, setImageData };
};

export default useAddPostFormik;