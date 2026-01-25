import {Avatar, Box, Button, Typography} from "@mui/material";
import {FormikProps} from "formik";
import {FunctionComponent, useEffect, useMemo} from "react";
import {useTranslation} from "react-i18next";
import {fontAwesomeIcon} from "../../../FontAwesome/Icons";
import {CarColor, colors} from "../../colorsSettings/carsColors";
import {Products} from "../../../interfaces/Products";
import {deleteImage, uploadImage} from "../../../services/uploadImage";
import {categoriesLogic, CategoryValue} from "../productLogicMap";
import {productsCategories} from "../../../interfaces/productsCategoeis";
import {LoadingButton} from "@mui/lab";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CollectionsIcon from "@mui/icons-material/Collections";
import { updateProduct } from "../../../services/productsServices";

interface ProductFormProps {
	formik: FormikProps<Products>;
	imageFile: File | null;
	setImageFile: (file: File | null) => void;
	imageData: {url: string; publicId: string} | null;
	setImageData: (data: {url: string; publicId: string} | null) => void;
	onHide: () => void;
	mode?: "add" | "update";
}

export interface DynamicField {
	name: string;
	type: "text" | "number" | "select" | "boolean" | "date";
	required?: boolean;
	options?: string[];
	min?: number;
	step?: number;
}

const ProductForm: FunctionComponent<ProductFormProps> = ({
	formik,
	setImageData,
	setImageFile,
	onHide,
	imageData,
	imageFile,
	mode,
}) => {
	const {t} = useTranslation();
	// const [imageKey, setImageKey] = useState(0);
	const selectedSubcategory = formik.values.subcategory;
	// const [selectedSubcategory, setSelectedSubcategory] = useState(...)

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.[0]) return;

		const file = e.target.files[0];
		setImageFile(file);

		// 🗑️ حذف الصورة القديمة إذا موجودة
		if (mode === "update" && imageData?.publicId) {
			try {
				await deleteImage(imageData.publicId);
				setImageData(null);
				// await updateProduct(productId,product);
			} catch (err) {
				console.error("Failed to delete old image:", err);
			}
		}

		// رفع الصورة الجديدة
		const {url, publicId} = await uploadImage(file);
		const newImageData = {url: url, publicId: publicId};
		setImageData(newImageData);

		formik.setFieldValue("image", newImageData);
	};

	useEffect(() => {
		if (!formik.values.category) return;

		const category = formik.values.category as keyof typeof categoriesLogic;
		const subcategories = Object.keys(categoriesLogic[category] || []);

		// ADD → auto select
		if (mode === "add" && !formik.values.subcategory) {
			const firstSubcat = subcategories[0] || "";
			formik.setFieldValue("subcategory", firstSubcat);
			formik.setFieldValue("type", firstSubcat);
		}
	}, [formik.values.category, mode]);

	const getAvailableSubcategories = (): string[] => {
		const category = formik.values.category as CategoryValue;
		if (!category) return [];

		return Object.keys(categoriesLogic[category]);
	};

	const getFieldLabel = (name: string, required?: boolean) => {
		const label = t(`fields.labels.${name}`, {defaultValue: name});
		return required ? `${label} *` : label;
	};

	const getDynamicFields = (): DynamicField[] => {
		const category = formik.values.category as CategoryValue;
		if (!category) return [];

		const subcat = formik.values
			.subcategory as keyof (typeof categoriesLogic)[CategoryValue];

		if (!subcat) return [];

		return categoriesLogic[category][subcat] || [];
	};

	// handling category change
	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newCategory = e.target.value as CategoryValue;
		formik.setFieldValue("category", newCategory);

		const firstSubcat = Object.keys(categoriesLogic[newCategory])[0] || "";
		formik.setFieldValue("subcategory", firstSubcat);
		formik.setFieldValue("type", firstSubcat);
	};

	const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newSubcat = e.target.value;
		formik.setFieldValue("subcategory", newSubcat);
		formik.setFieldValue("type", newSubcat);
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
			<div className='mb-3 p-1'>
				<Typography variant='body1' sx={{mb: 1.5, fontWeight: "medium"}}>
					{t("modals.addProductModal.image")}
				</Typography>

				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 2,
						flexWrap: "wrap",
					}}
				>
					{/* زر الكاميرا */}
					<Button
						variant='outlined'
						component='label'
						startIcon={<PhotoCameraIcon />}
						sx={{
							borderRadius: "20px",
							textTransform: "none",
							borderColor: "rgba(0, 89, 255, 0.637)",
							color: "#003561",
							gap: 1,
							m: "auto",
							"&:hover": {borderColor: "#003561"},
						}}
					>
						فتح الكاميرا
						<input
							type='file'
							accept='image/*'
							capture='environment'
							onChange={handleImageChange}
							hidden
						/>
					</Button>

					{/* زر المعرض */}
					<Button
						variant='outlined'
						component='label'
						startIcon={<CollectionsIcon />}
						sx={{
							borderRadius: "20px",
							textTransform: "none",
							borderColor: "rgba(0, 89, 255, 0.637)",
							color: "#003561",
							gap: 1,
							m: "auto",
							"&:hover": {borderColor: "#003561"},
						}}
					>
						اختيار من المعرض
						<input
							type='file'
							accept='image/*'
							onChange={handleImageChange}
							hidden
						/>
					</Button>

					{/* اختيار إضافي: معاينة الصورة إذا وجدت */}
					{formik.values.image?.url && (
						<Avatar
							src={formik.values.image.url}
							sx={{
								width: "70%",
								m: "auto",
								height: "",
								border: "2px solid #216cf8",
								borderRadius: "50px", // شكل مربع بزوايا منحنية يعطي مظهراً عصرياً
							}}
							variant='rounded'
						/>
					)}
				</Box>
			</div>

			{/*in Stock */}
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
					{mode === "add" && !formik.isSubmitting
						? t("modals.addProductModal.addProduct")
						: t("modals.updateProductModal.updateButton")}
				</LoadingButton>
			</Box>
		</form>
	);
};

export default ProductForm;
