import {FunctionComponent, useEffect, useState} from "react";
import {FormikValues, useFormik} from "formik";
import {Products} from "../../interfaces/Products";
import * as yup from "yup";
import {Modal, ModalHeader} from "react-bootstrap";
import {fontAwesomeIcon} from "../../FontAwesome/Icons";
import {getProductByspicificName, updateProduct} from "../../services/productsServices";
import {productCategories} from "../../interfaces/productsCategoeis";
import {useTranslation} from "react-i18next";
import handleRTL from "../../locales/handleRTL";

interface UpdateProductModalProps {
	show: boolean;
	onHide: Function;
	product_name: string;
	refresh: () => void;
}

const UpdateProductModal: FunctionComponent<UpdateProductModalProps> = ({
	show,
	onHide,
	product_name,
	refresh,
}) => {
	const {t} = useTranslation();

	const [product, setProduct] = useState<{
		product_name: string;
		category: string;
		price: number;
		quantity_in_stock: number;
		description: string;
		image_url: string;
		sale: boolean;
		discount: number;
	}>({
		product_name: "",
		category: "",
		price: 0,
		quantity_in_stock: 1,
		description: "",
		image_url: "",
		sale: false,
		discount: 0,
	});

	useEffect(() => {
		if (product_name) {
			getProductByspicificName(product_name)
				.then((res) => {
					setProduct(res);
				})
				.catch((err) => console.log(err));
		}
	}, [product_name]);

	const formik: FormikValues = useFormik<Products>({
		enableReinitialize: true,
		initialValues: {
			product_name: product.product_name,
			category: product.category,
			price: product.price,
			quantity_in_stock: product.quantity_in_stock,
			description: product.description,
			image_url: product.image_url,
			sale: product.sale,
			discount: product.discount,
		},
		validationSchema: yup.object({
			product_name: yup
				.string()
				.min(2, t("modals.updateProductModal.validation.productNameMin"))
				.required(t("modals.updateProductModal.validation.productNameRequired")),
			category: yup
				.string()
				.required(t("modals.updateProductModal.validation.categoryRequired")),
			price: yup
				.number()
				.required(t("modals.updateProductModal.validation.priceRequired")),
			quantity_in_stock: yup
				.number()
				.min(1, t("modals.updateProductModal.validation.quantityMin"))
				.required(t("modals.updateProductModal.validation.quantityRequired")),
			description: yup
				.string()
				.min(2, t("modals.updateProductModal.validation.descriptionMin"))
				.max(500, t("modals.updateProductModal.validation.descriptionMax")),
			image_url: yup
				.string()
				.required(t("modals.updateProductModal.validation.imageUrlRequired"))
				.url(t("modals.updateProductModal.validation.imageUrlInvalid")),
			sale: yup.boolean(),
			discount: yup.number(),
		}),
		onSubmit(values, {resetForm}) {
			updateProduct(product_name as string, values as Products)
				.then(() => {
					onHide();
					resetForm();
					refresh();
				})
				.catch((err) => {
					console.log(err);
				});
		},
	});

	const dir = handleRTL();

	return (
		<Modal
			style={{
				zIndex: 2000,
			}}
			show={show}
			onHide={() => onHide()}
			centered
			dir={dir}
		>
			<ModalHeader closeButton>
				<h6
					title={t("modals.updateProductModal.title")}
					aria-label={t("modals.updateProductModal.title")}
					className='display-6  p-2 fw-bold text-center'
				>
					{t("modals.updateProductModal.title")}
				</h6>
			</ModalHeader>
			<Modal.Body className='rounded  d-flex justify-content-center align-items-center'>
				<div className='container '>
					<form autoComplete='off' noValidate onSubmit={formik.handleSubmit}>
						{/* product_name */}
						<div className='form-floating mb-3'>
							<input
								type='text'
								name='product_name'
								value={formik.values.product_name}
								onChange={formik.handleChange}
								className='form-control'
								id='product_name'
								placeholder={t(
									"modals.updateProductModal.productNamePlaceholder",
								)}
							/>
							<label
								htmlFor='product_name'
								title={t("modals.updateProductModal.productName")}
								aria-label={t("modals.updateProductModal.productName")}
							>
								{t("modals.updateProductModal.productName")}
							</label>
							{(formik.touched.product_name ||
								formik.errors.product_name) && (
								<p className='text-danger fw-bold'>
									{formik.errors.product_name}
								</p>
							)}
						</div>

						{/* category */}
						<div className='input-group-sm mb-3 form-select'>
							<select
								title={t("modals.updateProductModal.selectCategory")}
								aria-label={t("modals.updateProductModal.selectCategory")}
								name='category'
								value={formik.values.category}
								onChange={formik.handleChange}
								className='form-control'
								id='category'
							>
								<option disabled>
									{t("modals.updateProductModal.selectCategory")}
								</option>
								{productCategories.map(
									(category: {id: string; label: string}) => (
										<option
											aria-label={t(
												"modals.updateProductModal.selectCategory",
											)}
											title={category.id}
											value={category.id}
											key={category.id}
										>
											{category.label}
										</option>
									),
								)}
							</select>
							{(formik.touched.category || formik.errors.category) && (
								<div className='text-danger fw-bold'>
									{formik.errors.category}
								</div>
							)}
						</div>

						{/* price */}
						<div className='input-group mb-3'>
							<span className='input-group-text' dir='ltr' id='price'>
								{fontAwesomeIcon.shekel}
							</span>
							<input
								type='number'
								name='price'
								className='form-control'
								placeholder='מחיר'
								aria-label='מחיר'
								aria-describedby='price'
								value={formik.values.price}
								onChange={formik.handleChange}
							/>
						</div>
						{(formik.touched.price ||
							formik.errors.price ||
							formik.values.price > 0) && (
							<div className='text-danger fw-bold'>
								{formik.errors.price}
							</div>
						)}

						{/* quantity_in_stock */}
						<div className='form-floating my-3'>
							<input
								type='number'
								name='quantity_in_stock'
								value={formik.values.quantity_in_stock}
								onChange={formik.handleChange}
								className='form-control'
								id='quantity_in_stock'
								placeholder='כמות במלאי'
							/>
							<label htmlFor='quantity_in_stock'>כמות במלאי</label>
							{(formik.touched.quantity_in_stock ||
								formik.errors.quantity_in_stock) && (
								<div className='text-danger fw-bold'>
									{formik.errors.quantity_in_stock}
								</div>
							)}
						</div>

						{/* description */}
						<div className='form-floating mb-3'>
							<textarea
								name='description'
								value={formik.values.description}
								onChange={formik.handleChange}
								className='form-control'
								id='description'
								placeholder='תיאור המוצר'
								rows={4}
							/>
							<label htmlFor='description'>
								תיאור המוצר
								<hr />
							</label>
							{formik.touched.description && formik.errors.description && (
								<div className='text-danger fw-bold'>
									{formik.errors.description}
								</div>
							)}
						</div>

						{/* image_url */}
						<div className='form-floating mb-3'>
							<input
								type='text'
								name='image_url'
								value={formik.values.image_url}
								onChange={formik.handleChange}
								className='form-control'
								id='image_url'
								placeholder='כתובת תמונה'
							/>
							<label htmlFor='image_url'>כתובת תמונה</label>
							{formik.touched.image_url && formik.errors.image_url && (
								<div className='text-danger fw-bold'>
									{formik.errors.image_url}
								</div>
							)}
						</div>

						{/* sale */}
						<div className='form-floating mb-3 fw-bold'>
							<div className='form-check form-switch'>
								<input
									className='form-check-input'
									type='checkbox'
									role='switch'
									id='sale'
									name='sale'
									checked={formik.values.sale ? true : false}
									onChange={formik.handleChange}
								/>
								<label className='form-check-label' htmlFor='sale'>
									במבצע
								</label>
							</div>
						</div>

						{/* discount */}
						<div className='form-floating mb-3'>
							<input
								type='number'
								name='discount'
								disabled={formik.values.sale ? false : true}
								value={formik.values.discount}
								onChange={(e) => {
									// If sale is unchecked, reset discount to 0
									if (!formik.values.sale) {
										formik.setFieldValue("discount", 0);
									} else {
										formik.handleChange(e);
									}
								}}
								className={`form-control  ${
									formik.values.sale ? "" : "d-none"
								}`}
								id='discount'
								placeholder='% הנחה באחוזים'
							/>
							<label
								className={`${formik.values.sale ? "" : "d-none"}`}
								htmlFor='discount'
							>
								אחוז הנחה
							</label>
						</div>

						<button type='submit' className='btn btn-success w-100'>
							עדכן
						</button>
						<button
							onClick={() => onHide()}
							className='my-3 btn btn-danger w-100'
						>
							סגירה
						</button>
					</form>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default UpdateProductModal;
