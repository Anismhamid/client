import {FunctionComponent, useEffect, useState} from "react";
import {useFormik} from "formik";
import {initialProductValue, Products} from "../../../interfaces/Products";
import * as yup from "yup";
import {Modal, ModalHeader} from "react-bootstrap";
import {getProductById, updateProduct} from "../../../services/productsServices";
import {useTranslation} from "react-i18next";
import handleRTL from "../../../locales/handleRTL";
import ProductForm, {DynamicField} from "./ProductForm";
import {categoriesLogic} from "../productLogicMap";

interface UpdateProductModalProps {
	show: boolean;
	onHide: Function;
	productId: string;
	refresh: () => void;
}

const UpdateProductModal: FunctionComponent<UpdateProductModalProps> = ({
	show,
	onHide,
	productId,
	refresh,
}) => {
	const {t} = useTranslation();
	// const formik = useAddProductFormik();
	const [product, setProduct] = useState<Products>(initialProductValue as Products);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imageData, setImageData] = useState<{
		url: string;
		publicId: string;
	} | null>(null);

	useEffect(() => {
		if (productId) {
			getProductById(productId).then((res) => {
				setProduct(res);
				setImageData({
					url: res.image,
					publicId: "",
				});
			});
		}
	}, [productId]);

	type CategoryValue = keyof typeof categoriesLogic;
	type SubcategoryValue<C extends CategoryValue> = keyof (typeof categoriesLogic)[C];

	const category = product.category as CategoryValue;
	const subcategory = (product.subcategory || "") as SubcategoryValue<typeof category>;

	const dynamicFields = (categoriesLogic[category]?.[subcategory] ||
		[]) as DynamicField[];

	const initialDynamicValues = dynamicFields.reduce(
		(acc, field) => {
			acc[field.name] =
				product[field.name as keyof Products] ??
				(field.type === "boolean" ? false : "");
			return acc;
		},
		{} as Record<string, any>,
	);

	const formik = useFormik<Products>({
		enableReinitialize: true,
		initialValues: {
			product_name: product.product_name || "",
			category: product.category || "",
			subcategory: product.subcategory || "",
			type: product.type || product.subcategory || "",
			price: product.price || 0,
			description: product.description || "",
			image: product.image || "",
			sale: product.sale || false,
			discount: product.discount || 0,
			location: product.location || "",
			in_stock: product.in_stock,
			...initialDynamicValues,
		},
		validationSchema: yup.object({
			product_name: yup.string().min(2).required(),
			category: yup.string().required(),
			price: yup.number().required(),
			description: yup.string().min(2).max(500),
			image: yup.string().required().url(),
		}),
		onSubmit(values, {resetForm}) {
			updateProduct(productId, values).then(() => {
				onHide();
				resetForm();
				refresh();
			});
		},
	});

	// const {countries, loading} = useCountries();

	const dir = handleRTL();

	return (
		<>
			<Modal
				style={{zIndex: 2000}}
				show={show}
				onHide={() => onHide()}
				centered
				dir={dir}
			>
				<ModalHeader closeButton>
					<h6 className='display-6 p-2 fw-bold text-center'>
						{t("modals.updateProductModal.title")}
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
