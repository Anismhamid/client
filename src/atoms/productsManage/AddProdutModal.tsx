import {FunctionComponent} from "react";
import {FormikValues, useFormik} from "formik";
import {Products} from "../../interfaces/Products";
import * as yup from "yup";
import {Modal, ModalHeader} from "react-bootstrap";
import {fontAwesomeIcon} from "../../FontAwesome/Icons";
import {createNewProduct} from "../../services/productsServices";
import {productCategories} from "../../interfaces/productsCategoeis";
import {Box} from "@mui/material";
import {useTranslation} from "react-i18next";
import handleRTL from "../../locales/handleRTL";

interface AddProdutModalProps {
	show: boolean;
	onHide: Function;
	refrehs: () => void;
}

const AddProdutModal: FunctionComponent<AddProdutModalProps> = ({
	show,
	onHide,
	refrehs,
}) => {
	const {t} = useTranslation();

	const formik: FormikValues = useFormik<Products>({
		initialValues: {
			product_name: "",
			category: "",
			price: 0,
			quantity_in_stock: 1,
			description: "",
			image_url: "",
			sale: false,
			discount: 0,
		},
		validationSchema: yup.object({
			product_name: yup
				.string()
				.min(2, t("modals.addProductModal.validation.productNameMin"))
				.required(t("modals.addProductModal.validation.productNameRequired")),
			category: yup
				.string()
				.required(t("modals.addProductModal.validation.categoryRequired")),
			price: yup
				.number()
				.required(t("modals.addProductModal.validation.priceRequired")),
			quantity_in_stock: yup
				.number()
				.min(1, t("modals.addProductModal.validation.quantityMin"))
				.required(t("modals.addProductModal.validation.quantityRequired")),
			description: yup
				.string()
				.min(2, t("modals.addProductModal.validation.descriptionMin"))
				.max(500, t("modals.addProductModal.validation.descriptionMax")),
			image_url: yup
				.string()
				.required(t("modals.addProductModal.validation.imageUrlRequired"))
				.url(t("modals.addProductModal.validation.imageUrlInvalid")),
			sale: yup.boolean(),
			discount: yup.number(),
		}),
		onSubmit(values, {resetForm}) {
			createNewProduct(values);
			resetForm();
			refrehs();
		},
	});

	const dir = handleRTL();
	return (
		<Modal dir={dir} show={show} onHide={() => onHide()} centered>
			<ModalHeader closeButton>
				<h1 className='display-6 fw-bold text-center'>
					{t("modals.addProductModal.title")}
				</h1>
			</ModalHeader>
			<Modal.Body className='rounded d-flex justify-content-center align-items-center'>
				<div className='container '>
					<form autoComplete='off' noValidate onSubmit={formik.handleSubmit}>
						{/* product_name */}
						<Box className='form-floating mb-3'>
							<input
								type='text'
								name='product_name'
								value={formik.values.product_name}
								onChange={formik.handleChange}
								className='form-control'
								id='product_name'
								placeholder={t(
									"modals.addProductModal.productNamePlaceholder",
								)}
								title={t(
									"modals.addProductModal.productNamePlaceholderdefrent",
								)}
							/>
							<label htmlFor='product_name'>
								{t("modals.addProductModal.productName")}
							</label>
							{(formik.touched.product_name ||
								formik.errors.product_name) && (
								<p className='text-danger fw-bold'>
									{formik.errors.product_name}
								</p>
							)}
						</Box>

						{/* category */}
						<div className='input-group-sm mb-3 form-select'>
							<select
								name='category'
								value={formik.values.category}
								onChange={formik.handleChange}
								className='form-control'
								id='category'
								aria-label={t("modals.addProductModal.selectCategory")}
								title={t("modals.addProductModal.selectCategory")}
							>
								<option
									disabled
									aria-label={t(
										"modals.addProductModal.selectCategory",
									)}
								>
									{t("modals.addProductModal.selectCategory")}
								</option>
								{productCategories.map(
									(category: {id: string; label: string}) => (
										<option value={category.id} key={category.id}>
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
								placeholder={t("modals.addProductModal.price")}
								aria-label={t("modals.addProductModal.price")}
								aria-describedby={t("modals.addProductModal.price")}
								value={formik.values.price}
								onChange={formik.handleChange}
								title={t("modals.addProductModal.price")}
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
								placeholder={t("modals.addProductModal.quantity")}
								title={t("modals.addProductModal.quantity")}
								aria-label={t("modals.addProductModal.quantity")}
							/>
							<label htmlFor='quantity_in_stock'>
								{t("modals.addProductModal.quantity")}
							</label>
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
								placeholder={t(
									"modals.addProductModal.descriptionPlaceholder",
								)}
								aria-label={t(
									"modals.addProductModal.descriptionPlaceholder",
								)}
								rows={4}
							/>
							<label
								htmlFor='description'
								aria-label={t("modals.addProductModal.description")}
							>
								{t("modals.addProductModal.description")}
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
								placeholder={t("modals.addProductModal.imageUrl")}
								aria-label={t("modals.addProductModal.imageUrl")}
							/>
							<label htmlFor='image_url'>
								{t("modals.addProductModal.imageUrl")}
							</label>
							{formik.touched.image_url && formik.errors.image_url && (
								<div className='text-danger fw-bold'>
									{formik.errors.image_url}
								</div>
							)}
						</div>

						{/* sale */}
						<div className='form-floating mb-3 text-primary fw-bold'>
							<div className='form-check form-switch sale-switch'>
								<input
									className='form-check-input sale-switch'
									type='checkbox'
									role='switch'
									id='sale'
									name='sale'
									checked={formik.values.sale ? true : false}
									onChange={formik.handleChange}
								/>
								<label
									className='form-check-label sale-switch'
									htmlFor='sale'
									aria-label={t("modals.addProductModal.sale")}
								>
									{t("modals.addProductModal.sale")}
								</label>
							</div>
						</div>

						{/* discount */}
						<div className='form-floating mb-3'>
							<input
								type='number'
								name='discount'
								disabled={formik.values.sale ? false : true}
								value={formik.values.discount || 0}
								onChange={formik.handleChange}
								className={`form-control  ${
									formik.values.sale ? "" : "d-none"
								}`}
								id='discount'
								placeholder={t("modals.addProductModal.discount")}
								aria-label={t("modals.addProductModal.discount")}
							/>
							<label
								className={`${formik.values.sale ? "" : "d-none"}`}
								htmlFor='discount'
							>
								{t("modals.addProductModal.discount")}
							</label>
						</div>
						<div className=' d-flex gap-5'>
							<button
								onClick={() => onHide()}
								className='btn btn-danger w-100'
							>
								{t("modals.addProductModal.closeButton")}
							</button>
							<button type='submit' className='btn btn-primary w-100'>
								{t("modals.addProductModal.addButton")}
							</button>
						</div>
					</form>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default AddProdutModal;
