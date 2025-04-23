import i18n from "./i18n";

export default function handleRTL() {
	// changing the direction by language
	const currentLanguage = i18n.language;
	const direction =
		currentLanguage === "he" || currentLanguage === "ar" ? "rtl" : "ltr";
	return direction;
}
