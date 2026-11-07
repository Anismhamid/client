import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { initialProductValue, Posts } from '../../../interfaces/Posts';
import * as yup from 'yup';
import { getPostById, updatePost } from '../../../services/postsServices';
import { useTranslation } from 'react-i18next';
import handleRTL from '../../../locales/handleRTL';
import ProductForm, { DynamicField } from './PostForm';
import { categoriesLogic } from '../../../interfaces/postLogicMap';
import {
    Dialog,
    DialogTitle,
    IconButton,
    DialogContent,
    Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { BRAND } from '../../../components/navbar/theme/brand';

interface UpdateProductModalProps {
    show: boolean;
    onHide: () => void;
    postId: string;
    refresh: () => void;
}

type CategoryValue = keyof typeof categoriesLogic;
type SubcategoryValue<C extends CategoryValue> =
    keyof (typeof categoriesLogic)[C];

const dialogSx = {
    '& .MuiDialog-paper': {
        borderRadius: '16px',
        overflow: 'hidden',
    },
} as const;

const titleSx = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: BRAND.gradient,
    color: '#fff',
    py: 1.75,
    fontWeight: 'bold',
    fontSize: '1.25rem',
} as const;

const validationSchema = yup.object({
    product_name: yup.string().min(2).required(),
    category: yup.string().required(),
    subcategory: yup.string().required(),
    type: yup.string().required(),
    price: yup.number().required(),
    description: yup.string().min(2).max(500),
    image: yup
        .object({
            url: yup.string().required().url(),
            publicId: yup.string(),
        })
        .required(),
});

const UpdateProductModal: FunctionComponent<UpdateProductModalProps> = ({
    show,
    onHide,
    postId,
    refresh,
}) => {
    const { t } = useTranslation();
    const [post, setPost] = useState<Posts>(initialProductValue as Posts);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageData, setImageData] = useState<{
        url: string;
        publicId: string;
    } | null>(null);

    useEffect(() => {
        if (!postId) return;
        let cancelled = false;

        getPostById(postId).then((res) => {
            if (cancelled) return;
            setPost(res);
            setImageData({
                url: res.image.url,
                publicId: res.image.publicId,
            });
        });

        return () => {
            cancelled = true;
        };
    }, [postId]);

    // الـ useFormik هون، فالمودال كله بيعمل re-render مع كل ضغطة حرف.
    // لهيك لازم نثبّت الحسابات والـ initialValues بـ useMemo (وإلا Formik
    // بيقارنها deep مع كل render).
    const dynamicFields = useMemo(() => {
        const category = post.category as CategoryValue;
        const subcategory = (post.subcategory || '') as SubcategoryValue<
            typeof category
        >;
        return (categoriesLogic[category]?.[subcategory] ||
            []) as DynamicField[];
    }, [post.category, post.subcategory]);

    const initialValues = useMemo<Posts>(() => {
        const initialDynamicValues = dynamicFields.reduce(
            (acc, field) => {
                acc[field.name] =
                    post[field.name as keyof Posts] ??
                    (field.type === 'boolean' ? false : '');
                return acc;
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {} as Record<string, any>,
        );

        return {
            product_name: post.product_name || '',
            category: post.category || '',
            subcategory: post.subcategory || '',
            type: post.type || post.subcategory || '',
            price: post.price || 0,
            description: post.description || '',
            image: {
                url: post.image.url || '',
                publicId: post.image.publicId || '',
            },
            sale: post.sale || false,
            discount: post.discount || 0,
            location: post.location || '',
            in_stock: post.in_stock,
            ...initialDynamicValues,
            createdAt: post.createdAt || '',
            featured: post.featured ?? false,
        } as Posts;
    }, [post, dynamicFields]);

    const formik = useFormik<Posts>({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        // لازم نرجّع الـ promise: بدونها Formik بيضل isSubmitting=true
        // (الزر يضل loading) وإذا فشل الطلب بيعلق للأبد.
        onSubmit(values, { resetForm }) {
            // الحقول الديناميكية اللي ما كانت موجودة بالمنشور بنبعتها '' من الفورم،
            // والسيرفر (Joi) بيرفض النص الفاضي. فبنشيل بس الحقول الفاضية اللي
            // أصلاً ما كانت محفوظة؛ أما لو المستخدم مسح قيمة محفوظة بتنبعت متل ما هي.
            const payload = { ...values } as Record<string, unknown>;
            dynamicFields.forEach(({ name }) => {
                if (
                    payload[name] === '' &&
                    (post as unknown as Record<string, unknown>)[name] == null
                ) {
                    delete payload[name];
                }
            });

            return updatePost(post._id as string, payload as unknown as Posts)
                .then(() => {
                    resetForm();
                    refresh();
                    onHide();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
    });

    const dir = handleRTL();

    return (
        <Dialog
            open={show}
            onClose={onHide}
            fullWidth
            maxWidth='sm'
            dir={dir}
            sx={dialogSx}
        >
            <DialogTitle sx={titleSx}>
                {t('modals.updateProductModal.title')}

                <IconButton
                    onClick={onHide}
                    size='small'
                    sx={{ color: '#fff' }}
                    aria-label={t('common.close', 'إغلاق')}
                >
                    <CloseIcon fontSize='small' />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                <Box>
                    <ProductForm
                        imageData={imageData}
                        formik={formik}
                        mode='update'
                        imageFile={imageFile}
                        setImageFile={setImageFile}
                        setImageData={setImageData}
                        onHide={onHide}
                    />
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProductModal;