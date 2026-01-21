import {useFormik} from "formik";
import * as yup from "yup";
import {useTranslation} from "react-i18next";
import {createNewProduct} from "../services/productsServices";
import {Products} from "../interfaces/Products";
import {useState} from "react";
import {uploadImage} from "../services/uploadImage";

const useAddProductFormik = () => {
	const {t} = useTranslation();
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imageData, setImageData] = useState<{
		url: string;
		publicId: string;
	} | null>(null);

	const formik = useFormik<Products>({
		initialValues: {
			product_name: "",
			image: "",
			brand: "",
			year: "",
			fuel: "",
			mileage: 0,
			color: "",
			category: "Cars",
			price: 0,
			description: "",
			sale: false,
			discount: 0,
			in_stock: true,
			location: "",
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
			description: yup
				.string()
				.min(2, t("modals.addProductModal.validation.descriptionMin"))
				.max(500, t("modals.addProductModal.validation.descriptionMax")),

			sale: yup.boolean(),
			discount: yup.number(),
			location: yup.string(),
		}),
		onSubmit: async (values, {resetForm}) => {
			let uploadedImage = imageData;

			if (imageFile && !imageData) {
				uploadedImage = await uploadImage(imageFile);
				setImageData(uploadedImage);
			}

			await createNewProduct({
				...values,
				image: uploadedImage?.url || "",
			});

			console.log({
				...values,
				image: uploadedImage?.url,
				publicId: uploadedImage?.publicId,
			});

			resetForm();
			setImageFile(null);
			setImageData(null);
		},
	});
	return {formik, imageFile, setImageFile, imageData, setImageData};
};

export default useAddProductFormik;
