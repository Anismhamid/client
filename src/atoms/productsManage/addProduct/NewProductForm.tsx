import {Box, Button} from "@mui/material";
import {FormikProps} from "formik";
import {FunctionComponent, useState, useEffect, useMemo} from "react";
import {useTranslation} from "react-i18next";
import {fontAwesomeIcon} from "../../../FontAwesome/Icons";
import {CarColor, colors} from "../../colorsSettings/carsColors";
import {Products} from "../../../interfaces/Products";
import {uploadImage} from "../../../services/uploadImage";
import {categoriesLogic, CategoryValue} from "../productLogicMap";
import {productsCategories} from "../../../interfaces/productsCategoeis";
import {LoadingButton} from "@mui/lab";

interface NewProductFormProps {
	formik: FormikProps<Products>;
	imageFile: File | null;
	setImageFile: (file: File | null) => void;
	imageData: {url: string; publicId: string} | null;
	setImageData: (data: {url: string; publicId: string} | null) => void;
	onHide: () => void;
}

interface DynamicField {
	name: string;
	type: "text" | "number" | "select" | "boolean" | "date";
	required?: boolean;
	options?: string[];
	min?: number;
	step?: number;
}

const NewProductForm: FunctionComponent<NewProductFormProps> = ({
	formik,
	setImageData,
	setImageFile,
	onHide,
}) => {
	const {t} = useTranslation();
	const [imageKey, setImageKey] = useState(0);
	const [selectedSubcategory, setSelectedSubcategory] = useState<string>(
		formik.values.subcategory || "",
	);

	useEffect(() => {
		if (!formik.values.category) return;

		const category = formik.values.category as keyof typeof categoriesLogic;

		const subcat = selectedSubcategory || Object.keys(categoriesLogic[category])[0];

		const fields: DynamicField[] =
			categoriesLogic[category][
				subcat as keyof (typeof categoriesLogic)[typeof category]
			] || [];

		// allowed fields
		const allowedFields = new Set<string>(fields.map((f) => f.name));

		// product base fields
		[
			"product_name",
			"category",
			"subcategory",
			"type",
			"price",
			"description",
			"image",
			"sale",
			"discount",
			"in_stock",
			"location",
		].forEach((f) => allowedFields.add(f));

		// delete the unallowed fields
		Object.keys(formik.values).forEach((key) => {
			if (!allowedFields.has(key)) {
				formik.setFieldValue(key, undefined);
			}
		});

		// setting the default values for new fields
		fields.forEach((field) => {
			if (formik.values[field.name] === undefined) {
				switch (field.type) {
					case "boolean":
						formik.setFieldValue(field.name, false);
						break;
					case "number":
						formik.setFieldValue(field.name, 0);
						break;
					default:
						formik.setFieldValue(field.name, "");
				}
			}
		});
	}, [formik.values.category, selectedSubcategory]);

	useEffect(() => {
		if (formik.values.subcategory !== selectedSubcategory) {
			setSelectedSubcategory(formik.values.subcategory || "");
		}
	}, [formik.values.subcategory]);

	const getAvailableSubcategories = (): string[] => {
		const category = formik.values.category;
		if (!category || !categoriesLogic[category]) return [];
		return Object.keys(categoriesLogic[category]);
	};

	const getFieldLabel = (name: string, required?: boolean) => {
		const label = t(`fields.labels.${name}`, {defaultValue: name});
		return required ? `${label} *` : label;
	};

	const getDynamicFields = (): DynamicField[] => {
		const category = formik.values.category;
		if (!category || !categoriesLogic[category]) return [];

		const subcat = selectedSubcategory || Object.keys(categoriesLogic[category])[0];
		// نؤكد لـ TS أن subcat هو مفتاح موجود في categoriesLogic[category]
		return (
			(categoriesLogic[category] as Record<string, DynamicField[]>)[subcat] || []
		);
	};

	// handling category change
	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newCategory = e.target.value as CategoryValue;
		formik.setFieldValue("category", newCategory);

		const firstSubcat = Object.keys(categoriesLogic[newCategory] || {})[0] || "";
		formik.setFieldValue("subcategory", firstSubcat);

		// type = current subcategory
		formik.setFieldValue("type", firstSubcat);

		setSelectedSubcategory(firstSubcat);
	};

	const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newSubcategory = e.target.value;
		setSelectedSubcategory(newSubcategory);
		formik.setFieldValue("subcategory", newSubcategory);

		// the type needs to change with the subcategory.
		formik.setFieldValue("type", newSubcategory);
	};

	const availableSubcategories = useMemo(
		() => getAvailableSubcategories(),
		[formik.values.category],
	);

	const dynamicFields = useMemo(
		() => getDynamicFields(),
		[formik.values.category, selectedSubcategory],
	);

	// dynamic field display
	const renderDynamicField = (field: DynamicField) => {
		const fieldValue = formik.values[field.name] || "";
		const isRequired = field.required;
		const fieldId = `field-${field.name}`;
		const error = formik.touched[field.name] && formik.errors[field.name];

		const baseInputProps = {
			name: field.name,
			value: fieldValue,
			onChange: formik.handleChange,
			onBlur: formik.handleBlur,
			id: fieldId,
			className: `form-control ${error ? "is-invalid" : ""}`,
			required: isRequired,
		};

		const fieldLabel = getFieldLabel(field.name, isRequired);
		const placeholderText = t(`fields.placeholder.${field.name}`, {
			defaultValue: field.name,
		});
		const selectDefaultText = t(`fields.select.${field.name}`, {
			defaultValue: `اختر ${field.name}`,
		});

		switch (field.type) {
			case "text":
				return (
					<div className='form-floating'>
						<input
							type='text'
							{...baseInputProps}
							placeholder={placeholderText as string}
						/>
						<label htmlFor={fieldId}>{fieldLabel}</label>
					</div>
				);

			case "number":
				return (
					<div className='form-floating'>
						<input
							type='number'
							{...baseInputProps}
							placeholder={placeholderText as string}
							min={field.min || 0}
							step={field.step || 1}
						/>
						<label htmlFor={fieldId}>{fieldLabel}</label>
					</div>
				);

			case "select":
				return (
					<div className='form-floating'>
						<select {...baseInputProps}>
							<option value=''>{selectDefaultText}</option>
							{field.options?.map((option: string) => {
								const optionText = t(`options.${option}`, {
									defaultValue: option,
								});
								return (
									<option key={option} value={option}>
										{optionText}
									</option>
								);
							})}
						</select>
						<label htmlFor={fieldId}>{fieldLabel}</label>
					</div>
				);

			case "boolean":
				return (
					<div className='form-check form-switch'>
						<input
							className='form-check-input'
							type='checkbox'
							role='switch'
							id={fieldId}
							name={field.name}
							checked={Boolean(fieldValue)}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						<label className='form-check-label' htmlFor={fieldId}>
							{fieldLabel}
						</label>
					</div>
				);

			case "date":
				return (
					<div className='form-floating'>
						<input type='date' {...baseInputProps} />
						<label htmlFor={fieldId}>{fieldLabel}</label>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<form autoComplete='off' noValidate onSubmit={formik.handleSubmit}>
			{/* Product Name */}
			<Box className='form-floating mb-3'>
				<input
					type='text'
					name='product_name'
					value={formik.values.product_name}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					className={`form-control ${
						formik.touched.product_name && formik.errors.product_name
							? "is-invalid"
							: ""
					}`}
					id='product_name'
					placeholder={
						t("modals.addProductModal.productNamePlaceholder") as string
					}
					required
				/>
				<label htmlFor='product_name'>
					{t("modals.addProductModal.productName")} *
				</label>
				{formik.touched.product_name && formik.errors.product_name && (
					<div className='invalid-feedback'>
						{formik.errors.product_name as string}
					</div>
				)}
			</Box>

			{/* Category */}
			<div className='mb-3'>
				<label htmlFor='category' className='form-label'>
					{t("modals.addProductModal.category")} *
				</label>
				<select
					name='category'
					value={formik.values.category}
					onChange={handleCategoryChange}
					onBlur={formik.handleBlur}
					className={`form-control ${
						formik.touched.category && formik.errors.category
							? "is-invalid"
							: ""
					}`}
					id='category'
					required
				>
					<option value=''>{t("modals.addProductModal.selectCategory")}</option>
					{productsCategories
						.filter((cat) => Object.keys(categoriesLogic).includes(cat.id))
						.map((category) => {
							const categoryLabel = category.label; // label موجود بالفعل كـ string
							return (
								<option value={category.id} key={category.id}>
									{categoryLabel}
								</option>
							);
						})}
				</select>
				{formik.touched.category && formik.errors.category && (
					<div className='invalid-feedback'>
						{formik.errors.category as string}
					</div>
				)}
			</div>

			{/* Subcategory */}
			{formik.values.category && availableSubcategories.length > 0 && (
				<div className='mb-3'>
					<label htmlFor='subcategory' className='form-label'>
						{t("modals.addProductModal.subcategory")}
					</label>
					<select
						name='subcategory'
						value={selectedSubcategory}
						onChange={handleSubcategoryChange}
						onBlur={formik.handleBlur}
						className='form-control'
						id='subcategory'
					>
						<option value=''>
							{t("modals.addProductModal.selectSubcategory")}
						</option>
						{availableSubcategories.map((subcat) => {
							const subcatText = t(`subcategories.${subcat}`, {
								defaultValue: subcat,
							});
							return (
								<option value={subcat} key={subcat}>
									{subcatText}
								</option>
							);
						})}
					</select>
				</div>
			)}

			{/* Price */}
			<div className='mb-3'>
				<label htmlFor='price' className='form-label'>
					{t("modals.addProductModal.price")} *
				</label>
				<div className='input-group'>
					<span className='input-group-text'>{fontAwesomeIcon.shekel}</span>
					<input
						type='number'
						name='price'
						value={formik.values.price || ""}
						onChange={(e) => {
							const value = e.target.value;
							formik.setFieldValue(
								"price",
								value === "" ? "" : Number(value),
							);
						}}
						onBlur={formik.handleBlur}
						className={`form-control ${
							formik.touched.price && formik.errors.price
								? "is-invalid"
								: ""
						}`}
						id='price'
						min='0'
						step='0.01'
						required
					/>
				</div>
				{formik.touched.price && formik.errors.price && (
					<div className='invalid-feedback d-block'>
						{formik.errors.price as string}
					</div>
				)}
			</div>

			{/* Dynamic Fields */}
			{formik.values.category && dynamicFields.length > 0 && (
				<Box className='mt-4'>
					<h5 className='mb-3'>{t("modals.addProductModal.specifications")}</h5>
					{dynamicFields.map((field: DynamicField) => (
						<div className='mb-3' key={field.name}>
							{renderDynamicField(field)}
							{formik.touched[field.name] && formik.errors[field.name] && (
								<div className='invalid-feedback d-block'>
									{formik.errors[field.name] as string}
								</div>
							)}
						</div>
					))}
				</Box>
			)}

			{/* Color Field (خاص بالسيارات) */}
			{formik.values.category === "Cars" && (
				<div className='mb-3'>
					<label htmlFor='color' className='form-label'>
						{t("modals.addProductModal.color")}
					</label>
					<select
						name='color'
						value={formik.values.color || ""}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						className={`form-control ${
							formik.touched.color && formik.errors.color
								? "is-invalid"
								: ""
						}`}
						id='color'
					>
						<option value=''>
							{t("modals.addProductModal.selectColor")}
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
									borderRadius: "4px",
								}}
							/>
							<span>{formik.values.color}</span>
						</Box>
					)}
				</div>
			)}

			{/* Description */}
			<div className='mb-3'>
				<label htmlFor='description' className='form-label'>
					{t("modals.addProductModal.description")}
				</label>
				<textarea
					name='description'
					value={formik.values.description || ""}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					className={`form-control ${
						formik.touched.description && formik.errors.description
							? "is-invalid"
							: ""
					}`}
					id='description'
					rows={4}
					placeholder={
						t("modals.addProductModal.descriptionPlaceholder") as string
					}
				/>
				{formik.touched.description && formik.errors.description && (
					<div className='invalid-feedback'>
						{formik.errors.description as string}
					</div>
				)}
			</div>

			{/* Image Upload */}
			<div className='mb-3'>
				<label htmlFor='image' className='form-label'>
					{t("modals.addProductModal.image")}
				</label>
				<input
					key={imageKey}
					type='file'
					accept='image/*'
					onChange={async (e) => {
						try {
							if (!e.target.files?.[0]) return;
							const file = e.target.files[0];
							setImageFile(file);
							const uploaded = await uploadImage(file);
							setImageData(uploaded);
							formik.setFieldValue("image", uploaded.url);
						} catch (error) {
							console.error("Image upload error:", error);
						} finally {
							setImageKey((prev) => prev + 1);
						}
					}}
					className='form-control'
					id='image'
				/>
			</div>

			{/* Quantity in Stock */}
			<div className='form-check form-switch'>
				<input
					className='form-check-input'
					type='checkbox'
					role='switch'
					id='in_stock'
					name='in_stock'
					checked={formik.values.in_stock}
					onChange={(e) => formik.setFieldValue("in_stock", e.target.checked)}
				/>
				<label className='form-check-label' htmlFor='in_stock'>
					{formik.values.in_stock
						? t("modals.addProductModal.in_stock")
						: t("modals.addProductModal.not_in_stock")}
				</label>
			</div>

			{/* Sale and Discount */}
			<div className='mb-3'>
				<div className='form-check form-switch'>
					<input
						className='form-check-input'
						type='checkbox'
						role='switch'
						id='sale'
						name='sale'
						checked={formik.values.sale}
						onChange={formik.handleChange}
					/>
					<label className='form-check-label' htmlFor='sale'>
						{t("modals.addProductModal.sale")}
					</label>
				</div>
			</div>

			{formik.values.sale && (
				<div className='mb-3'>
					<label htmlFor='discount' className='form-label'>
						{t("modals.addProductModal.discount")} (%)
					</label>
					<input
						type='number'
						name='discount'
						value={formik.values.discount || 0}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						className='form-control'
						id='discount'
						min='0'
						max='100'
					/>
				</div>
			)}

			{/* Buttons with Loading State */}
			<Box
				sx={{
					display: "flex",
					gap: 2,
					mt: 4,
					width: "100%",
				}}
			>
				<Button
					variant='outlined'
					onClick={onHide}
					disabled={formik.isSubmitting}
					sx={{
						flex: 1,
						py: 1.5,
						borderRadius: "12px",
						fontSize: "1rem",
						fontWeight: 600,
						border: "2px solid",
						borderColor: "error.main",
						color: "error.main",
						"&:hover": {
							border: "2px solid",
							borderColor: "error.dark",
							backgroundColor: "error.lighter",
							boxShadow: "0 4px 12px rgba(244, 67, 54, 0.15)",
						},
					}}
				>
					{t("modals.addProductModal.cancel")}
				</Button>

				<LoadingButton
					variant='contained'
					type='submit'
					loading={formik.isSubmitting}
					sx={{
						flex: 1,
						py: 1.5,
						borderRadius: "12px",
						fontSize: "1rem",
						fontWeight: 600,
						background: (theme: {
							palette: {primary: {main: any; light: any}};
						}) =>
							`linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
						boxShadow: (theme: {palette: {primary: {main: any}}}) =>
							`0 4px 15px ${theme.palette.primary.main}40`,
						"&:hover": {
							background: (theme: {
								palette: {primary: {dark: any; main: any}};
							}) =>
								`linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
							boxShadow: (theme: {palette: {primary: {main: any}}}) =>
								`0 6px 20px ${theme.palette.primary.main}60`,
						},
					}}
				>
					{!formik.isSubmitting && t("modals.addProductModal.addProduct")}
				</LoadingButton>
			</Box>
		</form>
	);
};

export default NewProductForm;
