import {FunctionComponent, useEffect, useState} from "react";
import {useFormik} from "formik";
import {Products} from "../../interfaces/Products";
import * as yup from "yup";
import {Modal, ModalHeader} from "react-bootstrap";
import {fontAwesomeIcon} from "../../FontAwesome/Icons";
import {getProductById, updateProduct} from "../../services/productsServices";
import {productsCategories} from "../../interfaces/productsCategoeis";
import {useTranslation} from "react-i18next";
import handleRTL from "../../locales/handleRTL";
import {CarColor, colors} from "../colorsSettings/carsColors";
import {Box} from "@mui/material";

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
	const [product, setProduct] = useState<{
		product_name: string;
		category: string;
		price: number;
		quantity_in_stock: number;
		description: string;
		image_url: string;
		sale: boolean;
		discount: number;
		brand: string;
		year: string;
		fuel: string;
		mileage: number;
		color: string;
	}>({
		product_name: "",
		category: "",
		price: 0,
		quantity_in_stock: 1,
		description: "",
		image_url: "",
		sale: false,
		discount: 0,
		brand: "",
		year: "",
		fuel: "",
		mileage: 0,
		color: "",
	});

	useEffect(() => {
		if (productId) {
			getProductById(productId)
				.then((res) => {
					setProduct(res);
				})
				.catch((err) => console.log(err));
		}
	}, [productId]);

	const formik = useFormik<Products>({
		enableReinitialize: true,
		initialValues: {
			product_name: product.product_name,
			category: product.category,
			price: product.price,
			description: product.description,
			image_url: product.image_url,
			sale: product.sale,
			discount: product.discount,
			brand: product.brand,
			year: product.year,
			fuel: product.fuel,
			mileage: product.mileage,
			color: product.color,
			likes: [],
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
			updateProduct(productId as string, values as Products)
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

						{/* if the category is cars show car settings */}
						{formik.values.category === "Cars" && (
							<Box>
								<div className='input-group mb-3'>
									<span
										className='input-group-text'
										dir='ltr'
										id='brand'
									>
										{fontAwesomeIcon.brand}
									</span>
									<input
										type='text'
										name='brand'
										className={`form-control ${
											formik.touched.brand && formik.errors.brand
												? "is-invalid"
												: ""
										}`}
										placeholder={t("modals.addProductModal.brand")}
										aria-label={t("modals.addProductModal.brand")}
										aria-describedby={t(
											"modals.addProductModal.brand",
										)}
										value={formik.values.brand}
										onChange={formik.handleChange}
										title={t("modals.addProductModal.brand")}
									/>
								</div>
								{(formik.touched.brand ||
									formik.errors.brand ||
									formik.values.brand == "") && (
									<div className='invalid-feedback'>
										{formik.errors.brand}
									</div>
								)}
								{/* year */}
								{t("modals.addProductModal.year")}
								<div className='input-group mb-3'>
									<span
										className='input-group-text'
										dir='ltr'
										id='year'
									>
										{fontAwesomeIcon.year}
									</span>

									<input
										type='date'
										name='year'
										className={`form-control ${
											formik.touched.year && formik.errors.year
												? "is-invalid"
												: "is-valid"
										}`}
										placeholder={t("modals.addProductModal.year")}
										aria-label={t("modals.addProductModal.year")}
										aria-describedby={t(
											"modals.addProductModal.year",
										)}
										value={formik.values.year}
										onChange={formik.handleChange}
										title={t("modals.addProductModal.year")}
									/>
								</div>
								{(formik.touched.year ||
									formik.errors.year ||
									formik.values.year == "") && (
									<div className='invalid-feedback'>
										{formik.errors.year}
									</div>
								)}
								{/* fuel */}
								{t("modals.addProductModal.fuel.label")}
								<select
									name='fuel'
									value={formik.values.fuel}
									onChange={formik.handleChange}
									className={`form-control ${
										formik.touched.fuel && formik.errors.fuel
											? "is-invalid"
											: ""
									}`}
									id='fuel'
									aria-label={t("modals.addProductModal.fuel")}
									title={t("modals.addProductModal.fuel")}
								>
									<option
										disabled
										aria-label={t("modals.addProductModal.fuel")}
									>
										{t("modals.addProductModal.fuel.label")}
									</option>
									{[
										"modals.addProductModal.fuel.setttings.diesel",
										"modals.addProductModal.fuel.setttings.gasoline",
										"modals.addProductModal.fuel.setttings.electric",
									].map((fuel: string, index) => (
										<option value={fuel} key={index}>
											{t(fuel)}
										</option>
									))}
								</select>
								{(formik.touched.fuel || formik.errors.fuel) && (
									<div className='invalid-feedback'>
										{formik.errors.fuel}
									</div>
								)}
								{/* mileage */}
								<div className='input-group my-3'>
									<span className='input-group-text' id='mileage'>
										{t("modals.addProductModal.mileage")}
										{fontAwesomeIcon.mileage}
									</span>
									<input
										type='text'
										name='mileage'
										className={`form-control ${
											formik.touched.mileage &&
											formik.errors.mileage
												? "is-invalid"
												: ""
										}`}
										placeholder={t("modals.addProductModal.mileage")}
										aria-label={t("modals.addProductModal.mileage")}
										aria-describedby={t(
											"modals.addProductModal.mileage",
										)}
										value={formik.values.mileage}
										onChange={formik.handleChange}
										title={t("modals.addProductModal.mileage")}
									/>
								</div>
								{(formik.touched.mileage ||
									formik.errors.mileage ||
									formik.values.mileage == 0) && (
									<div className='invalid-feedback'>
										{formik.errors.mileage}
									</div>
								)}
								{t("color")}
								{/* color */}
								<select
									name='color'
									value={formik.values.color}
									onChange={formik.handleChange}
									className={`form-control ${
										formik.touched.color && formik.errors.color
											? "is-invalid"
											: ""
									}`}
									id='color'
									aria-label={t("modals.addProductModal.color")}
									title={t("modals.addProductModal.color")}
								>
									<option value='' disabled>
										{t("modals.addProductModal.color")}
									</option>

									{colors.map((color: CarColor) => (
										<option value={color.hex} key={color.hex}>
											{color.key} ({color.hex})
										</option>
									))}
								</select>
								{formik.values.color && (
									<Box className='d-flex align-items-center gap-2 mt-2'>
										<Box
											sx={{
												width: 20,
												height: 20,
												backgroundColor: formik.values.color,
												border: "1px solid #ccc",
											}}
										/>
										<span>{formik.values.color}</span>
									</Box>
								)}
								{formik.touched.color && formik.errors.color && (
									<div className='invalid-feedback'>
										{formik.errors.color}
									</div>
								)}
							</Box>
						)}

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
								{productsCategories.map(
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

						{/* description */}
						<div className='form-floating mb-3'>
							<textarea
								aria-label={t("modals.updateProductModal.description")}
								name='description'
								value={formik.values.description}
								onChange={formik.handleChange}
								className='form-control'
								id='description'
								placeholder={t("modals.updateProductModal.description")}
								rows={4}
							/>
							<label
								htmlFor='description'
								aria-label={t("modals.updateProductModal.description")}
							>
								{t("modals.updateProductModal.description")}
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
								aria-label={t("modals.updateProductModal.imageUrl")}
								type='text'
								name='image_url'
								value={formik.values.image_url}
								onChange={formik.handleChange}
								className='form-control'
								id='image_url'
								placeholder={t("modals.updateProductModal.imageUrl")}
							/>
							<label htmlFor='image_url'>
								{t("modals.updateProductModal.imageUrl")}
							</label>
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
									aria-label={t("modals.updateProductModal.sale")}
									className='form-check-input'
									type='checkbox'
									role='switch'
									id='sale'
									name='sale'
									checked={formik.values.sale ? true : false}
									onChange={formik.handleChange}
								/>
								<label
									className='form-check-label'
									htmlFor='sale'
									aria-label={t("modals.updateProductModal.sale")}
								>
									{t("modals.updateProductModal.sale")}
								</label>
							</div>
						</div>

						{/* discount */}
						<div className='form-floating mb-3'>
							<input
								aria-label={t("modals.updateProductModal.discount")}
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
							/>
							<label
								className={`${formik.values.sale ? "" : "d-none"}`}
								htmlFor='discount'
								aria-label={t("modals.updateProductModal.discount")}
							>
								{t("modals.updateProductModal.discount")}
							</label>
						</div>

						<button
							type='submit'
							className='btn btn-success w-100'
							aria-label={t("modals.updateProductModal.updateButton")}
						>
							{t("modals.updateProductModal.updateButton")}
						</button>
						<button
							onClick={() => onHide()}
							className='my-3 btn btn-danger w-100'
							aria-label={t("modals.updateProductModal.closeButton")}
						>
							{t("modals.updateProductModal.closeButton")}
						</button>
					</form>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default UpdateProductModal;
