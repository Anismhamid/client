import {FunctionComponent, useEffect, useState} from "react";
import {FormikValues, useFormik} from "formik";
import {Products} from "../interfaces/Products";
import * as yup from "yup";
import {Modal, ModalHeader} from "react-bootstrap";
import {fontAwesomeIcon} from "../FontAwesome/Icons";
import {getProductByspicificName, updateProduct} from "../services/productsServices";

interface UpdateProductModalProps {
	show: boolean;
	onHide: Function;
	product_name: string;
}

const UpdateProductModal: FunctionComponent<UpdateProductModalProps> = ({
	show,
	onHide,
	product_name,
}) => {
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
				.min(2, "שם המוצר חייב להיות באורך של לפחות 2 תווים")
				.required("שם מוצר שדה חובה"),
			category: yup.string().required(""),
			price: yup.number().required("מחיר הוא שדה חובה"),
			quantity_in_stock: yup
				.number()
				.min(1, "כמות המוצר במלאי חייב להיות 1 לפחות")
				.required("כמות המוצרים במלאי הוא שדה חובה"),
			description: yup
				.string()
				.min(2, "התיאור חייב להיות באורך 2 תווים לפחות")
				.max(500, "התיאור חייב להיות באורך של 500 תווים לכל היותר"),
			image_url: yup
				.string()
				.required("כתובת אתר תמונה היא שדה חובה")
				.url("כתובת האתר של התמונה חייבת להיות כתובת אתר חוקית"),
			sale: yup.boolean(),
			discount: yup.number(),
		}),
		onSubmit(values, {resetForm}) {
			updateProduct(product_name as string, values as Products)
				.then(() => {
					setProduct((prev) => ({...prev, ...values}));
					resetForm();
					onHide();
				})
				.catch((err) => {
					console.log(err);
				});
		},
	});

	return (
		<Modal show={show} onHide={() => onHide()} centered dir='rtl'>
			<ModalHeader closeButton>
				<h6 className='display-6  p-2 fw-bold text-center'>עידכון פרטי מוצר</h6>
			</ModalHeader>
			<Modal.Body className=' bg-dark rounded  d-flex justify-content-center align-items-center'>
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
								placeholder='שם מוצר'
							/>
							<label htmlFor='product_name'>שם מוצר (ייחודי)</label>
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
								name='category'
								value={formik.values.category}
								onChange={formik.handleChange}
								className='form-control'
								id='category'
							>
								<option value=''>בחר קטגוריה</option>
								<option value='Fruit'>פירות</option>
								<option value='Vegetable'>ירקות</option>
								<option value='Dairy'>מוצרי חלב</option>
								<option value='Meat'>בשר</option>
								<option value='Fish'>דגים</option>
								<option value='Spices'>תבלינים</option>
								<option value='Bakery'>מאפים</option>
								<option value='Beverages'>משקאות</option>
								<option value='Frozen'>מוצרים קפואים</option>
								<option value='Snacks'>חטיפים</option>
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
						<div className='form-floating mb-3 text-light fw-bold'>
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
								value={formik.values.discount || 0}
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
								placeholder='הנחה באחוזים'
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
