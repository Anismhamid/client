import { FunctionComponent, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { initialProductValue, Posts } from '../../../interfaces/Posts';
import * as yup from 'yup';
import { Modal, ModalHeader } from 'react-bootstrap';
import { getPostById, updatePost } from '../../../services/postsServices';
import { useTranslation } from 'react-i18next';
import handleRTL from '../../../locales/handleRTL';
import ProductForm, { DynamicField } from './PostForm';
import { categoriesLogic } from '../../../interfaces/postLogicMap';

interface UpdateProductModalProps {
    show: boolean;
    onHide: () => void;
    postId: string;
    refresh: () => void;
}

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
                name: post.seller.name || '',
                slug: post.seller.slug || undefined,
                user: {
                    _id: post.seller.user._id || '',
                    name: post.seller.user.name || '',
                    image: undefined,
                },
            },
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
            <Modal
                style={{ zIndex: 2000 }}
                show={show}
                onHide={() => onHide()}
                centered
                dir={dir}
            >
                <ModalHeader closeButton>
                    <h6 className='display-6 p-2 fw-bold text-center'>
                        {t('modals.updateProductModal.title')}
                    </h6>
                </ModalHeader>

                <Modal.Body className='rounded d-flex justify-content-center align-items-center'>
                    <div className='container'>
                        <ProductForm
                            imageData={imageData}
                            formik={formik}
                            mode='update'
                            imageFile={imageFile}
                            setImageFile={setImageFile}
                            setImageData={setImageData}
                            onHide={() => onHide()}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default UpdateProductModal;
