import {useFormik} from "formik";
import * as yup from "yup";
import {useTranslation} from "react-i18next";
import {createNewProduct} from "../services/productsServices";
import {Products} from "../interfaces/Products";

const useAddProductFormik = () => {
	const {t} = useTranslation();
	const formik = useFormik<Products>({
		initialValues: {
			product_name: "",
			brand: "",
			year: "",
			fuel: "",
			mileage: 0,
			color: "",
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
			brand: yup.string(),
			year: yup.string(),
			fuel: yup.string(),
			mileage: yup.number(),
			color: yup.string(),
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
		},
	});
	return formik;
};

export default useAddProductFormik;
