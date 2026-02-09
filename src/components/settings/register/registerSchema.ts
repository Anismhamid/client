import {useTranslation} from "react-i18next";
import * as yup from "yup";

export interface UserRegisterFormValues {
	name: {first: string; last: string};
	phone: {phone_1: string; phone_2?: string};
	address: {city: string; street: string; houseNumber?: string};
	email: string;
	password: string;
	confirmPassword: string;
	gender: string;
	slug: string;
	terms: boolean;
	image: {url?: string; alt?: string};
}

export const registerValidationSchema = () => {
	const {t} = useTranslation();
	return yup.object({
		name: yup.object({
			first: yup.string().required(t("register.validation.firstNameRequired")),
			last: yup.string().required(t("register.validation.lastNameRequired")),
		}),
		phone: yup.object({
			phone_1: yup.string().required(t("register.validation.phone1Required")),
			phone_2: yup.string().notRequired(),
		}),
		address: yup.object({
			city: yup.string().required(t("register.validation.cityRequired")),
			street: yup.string().required(t("register.validation.streetRequired")),
			houseNumber: yup.string().notRequired(),
		}),
		email: yup.string().required(t("register.validation.emailRequired")),
		password: yup.string().required(t("register.validation.passwordRequired")),
		confirmPassword: yup
			.string()
			.oneOf([yup.ref("password")], t("register.validation.confirmPasswordMatch"))
			.required(t("register.validation.confirmPasswordRequired")),
		gender: yup.string().required(t("register.validation.genderRequired")),
		slug: yup.string().required(t("register.validation.slugRequired")),
		terms: yup.boolean().oneOf([true], t("register.validation.termsRequired")),
		image: yup.object({
			url: yup.string().url(t("register.validation.imageUrlInvalid")).notRequired(),
			alt: yup.string().notRequired(),
		}),
	});
};


export const registerInitialValues: UserRegisterFormValues = {
	name: {first: "", last: ""},
	phone: {phone_1: "", phone_2: ""},
	address: {city: "", street: "", houseNumber: ""},
	email: "",
	password: "",
	confirmPassword: "",
	gender: "",
	image: {url: "", alt: ""},
	slug: "",
	terms: false,
};
