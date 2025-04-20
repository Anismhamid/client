import i18n from "i18next";
import {initReactI18next} from "react-i18next";

import translationEN from "./en.json";
import translationHE from "./he.json";
import translationAR from "./ar.json";

const savedLanguage = localStorage.getItem("lang") || "he";

i18n.use(initReactI18next).init({
	resources: {
		en: {translation: translationEN},
		he: {translation: translationHE},
		ar: {translation: translationAR},
	},
	lng: savedLanguage,
	fallbackLng: ["ar", "en"],

	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
