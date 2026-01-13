import {Box} from "@mui/material";
import {FormikProps} from "formik";
import {FunctionComponent} from "react";
import {useTranslation} from "react-i18next";
import {productCategories} from "../../../interfaces/productsCategoeis";
import {fontAwesomeIcon} from "../../../FontAwesome/Icons";
import {CarColor, colors} from "../../colorsSettingr/carsColors";
import {Products} from "../../../interfaces/Products";

interface NewProductFormProps {
	formik: FormikProps<Products>;
	onHide: () => void;
}

const NewProductForm: FunctionComponent<NewProductFormProps> = ({formik, onHide}) => {
	const {t} = useTranslation();

	return (
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
					placeholder={t("modals.addProductModal.productNamePlaceholder")}
					title={t("modals.addProductModal.productNamePlaceholderdefrent")}
				/>
				<label htmlFor='product_name'>
					{t("modals.addProductModal.productName")}
				</label>
				{(formik.touched.product_name || formik.errors.product_name) && (
					<p className='text-danger fw-bold'>{formik.errors.product_name}</p>
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
						aria-label={t("modals.addProductModal.selectCategory")}
					>
						{t("modals.addProductModal.selectCategory")}
					</option>
					{productCategories.map((category: {id: string; label: string}) => (
						<option value={category.id} key={category.id}>
							{category.label}
						</option>
					))}
				</select>
				{(formik.touched.category || formik.errors.category) && (
					<div className='text-danger fw-bold'>{formik.errors.category}</div>
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
			{(formik.touched.price || formik.errors.price || formik.values.price > 0) && (
				<div className='text-danger fw-bold'>{formik.errors.price}</div>
			)}

			{/* if the category is cars show car settings */}
			{formik.values.category === "Cars" && (
				<Box>
					brand
					<div className='input-group mb-3'>
						<span className='input-group-text' dir='ltr' id='brand'>
							{fontAwesomeIcon.brand}
						</span>
						<input
							type='text'
							name='brand'
							className='form-control'
							placeholder={t("modals.addProductModal.brand")}
							aria-label={t("modals.addProductModal.brand")}
							aria-describedby={t("modals.addProductModal.brand")}
							value={formik.values.brand}
							onChange={formik.handleChange}
							title={t("modals.addProductModal.brand")}
						/>
					</div>
					{(formik.touched.brand ||
						formik.errors.brand ||
						formik.values.brand == "") && (
						<div className='text-danger fw-bold'>{formik.errors.brand}</div>
					)}
					{/* year */}
					year
					<div className='input-group mb-3'>
						<span className='input-group-text' dir='ltr' id='year'>
							{fontAwesomeIcon.year}
						</span>

						<input
							type='date'
							name='year'
							className='form-control'
							placeholder={t("modals.addProductModal.year")}
							aria-label={t("modals.addProductModal.year")}
							aria-describedby={t("modals.addProductModal.year")}
							value={formik.values.year}
							onChange={formik.handleChange}
							title={t("modals.addProductModal.year")}
						/>
					</div>
					{(formik.touched.year ||
						formik.errors.year ||
						formik.values.year == "") && (
						<div className='text-danger fw-bold'>{formik.errors.year}</div>
					)}
					{/* fuel */}
					fuel
					<select
						name='fuel'
						value={formik.values.fuel}
						onChange={formik.handleChange}
						className='form-control'
						id='fuel'
						aria-label={t("modals.addProductModal.fuel")}
						title={t("modals.addProductModal.fuel")}
					>
						<option disabled aria-label={t("modals.addProductModal.fuel")}>
							{t("modals.addProductModal.fuel")}
						</option>
						{["diesel", "banzen", "Electric"].map((fuel: string, index) => (
							<option value={fuel} key={index}>
								{fuel}
							</option>
						))}
					</select>
					{(formik.touched.fuel || formik.errors.fuel) && (
						<div className='text-danger fw-bold'>{formik.errors.fuel}</div>
					)}
					{/* mileage */}
					<div className='input-group my-3'>
						<span className='input-group-text' dir='ltr' id='fuel'>
							mileage
							{fontAwesomeIcon.mileage}
						</span>
						<input
							type='text'
							name='mileage'
							className='form-control'
							placeholder={t("modals.addProductModal.mileage")}
							aria-label={t("modals.addProductModal.mileage")}
							aria-describedby={t("modals.addProductModal.mileage")}
							value={formik.values.mileage}
							onChange={formik.handleChange}
							title={t("modals.addProductModal.mileage")}
						/>
					</div>
					{(formik.touched.mileage ||
						formik.errors.mileage ||
						formik.values.mileage == 0) && (
						<div className='text-danger fw-bold'>{formik.errors.mileage}</div>
					)}
					color
					{/* color */}
					<select
						name='color'
						value={formik.values.color}
						onChange={formik.handleChange}
						className='form-control'
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
						<div className='text-danger fw-bold'>{formik.errors.color}</div>
					)}
				</Box>
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
					placeholder={t("modals.addProductModal.descriptionPlaceholder")}
					aria-label={t("modals.addProductModal.descriptionPlaceholder")}
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
					<div className='text-danger fw-bold'>{formik.errors.description}</div>
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
				<label htmlFor='image_url'>{t("modals.addProductModal.imageUrl")}</label>
				{formik.touched.image_url && formik.errors.image_url && (
					<div className='text-danger fw-bold'>{formik.errors.image_url}</div>
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
					className={`form-control  ${formik.values.sale ? "" : "d-none"}`}
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
				<button onClick={() => onHide()} className='btn btn-danger w-100'>
					{t("modals.addProductModal.closeButton")}
				</button>
				<button type='submit' className='btn btn-primary w-100'>
					{t("modals.addProductModal.addButton")}
				</button>
			</div>
		</form>
	);
};

export default NewProductForm;
