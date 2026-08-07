import { FunctionComponent, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { initialProductValue, Posts } from '../../../interfaces/Posts';
import * as yup from 'yup';
import { getPostById, updatePost } from '../../../services/postsServices';
import { useTranslation } from 'react-i18next';
import handleRTL from '../../../locales/handleRTL';
import ProductForm, { DynamicField } from './PostForm';
import { categoriesLogic } from '../../../interfaces/postLogicMap';
import { Dialog, DialogTitle, Typography, IconButton, DialogContent, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface UpdateProductModalProps {
    show: boolean;
    onHide: () => void;
    postId: string;
    refresh: () => void;
}

const GRADIENT = 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)';


const UpdateProductModal: FunctionComponent<UpdateProductModalProps> = ({
    show,
    onHide,
    postId,
    refresh,
}) => {
    const { t } = useTranslation();
    // const formik = useAddProductFormik();
    const [post, setPost] = useState<Posts>(initialProductValue as Posts);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageData, setImageData] = useState<{
        url: string;
        publicId: string;
    } | null>(null);

    useEffect(() => {
        if (postId) {
            getPostById(postId).then((res) => {
                setPost(res);
                setImageData({
                    url: res.image.url,
                    publicId: res.image.publicId,
                });
            });
        }
    }, [postId]);

    type CategoryValue = keyof typeof categoriesLogic;
    type SubcategoryValue<C extends CategoryValue> =
        keyof (typeof categoriesLogic)[C];

    const category = post.category as CategoryValue;
    const subcategory = (post.subcategory || '') as SubcategoryValue<
        typeof category
    >;

    const dynamicFields = (categoriesLogic[category]?.[subcategory] ||
        []) as DynamicField[];

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

    const formik = useFormik<Posts>({
        enableReinitialize: true,
        initialValues: {
            product_name: post.product_name || '',
            category: post.category || '',
            subcategory: post.subcategory || '',
            type: post.brand || post.subcategory || '',
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
            createdAt: '',
            seller: {
                name: {
                    first: post.seller?.name?.first || '',
                    last: post.seller?.name?.last || '',
                },
                slug: post.seller?.slug || '',
            },
            featured: false,
        },
        validationSchema: yup.object({
            product_name: yup.string().min(2).required(),
            category: yup.string().required(),
            price: yup.number().required(),
            description: yup.string().min(2).max(500),
            image: yup
                .object({
                    url: yup.string().required().url(),
                    publicId: yup.string(),
                })
                .required(),
        }),
        onSubmit(values, { resetForm }) {
            updatePost(post._id as string, values)
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
        <>
            <Dialog
            open={show}
            onClose={onHide}
            fullWidth
            maxWidth='sm'
            dir={dir}
            sx={{ '& .MuiDialog-paper': { borderRadius: '16px', overflow: 'hidden' } }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: GRADIENT,
                    color: '#fff',
                    py: 1.75,
                }}
            >
                <Typography variant='h6' fontWeight='bold'>
                    {t('modals.updateProductModal.title')}
                </Typography>
                <IconButton onClick={onHide} size='small' sx={{ color: '#fff' }}>
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
        </>
    );
};

export default UpdateProductModal;
