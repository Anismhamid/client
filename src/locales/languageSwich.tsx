import { Button } from "@mui/material";
import {FunctionComponent} from "react";
import {useTranslation} from "react-i18next";

interface LanguageSwitcherProps {}

const LanguageSwitcher: FunctionComponent<LanguageSwitcherProps> = () => {
	const {i18n} = useTranslation();

	const changeLanguage = (selectedLang: string) => {
		i18n.changeLanguage(selectedLang);
		localStorage.setItem("lang", selectedLang);
	};

	return (
		<div>
			<Button color="error" onClick={() => changeLanguage("ar")}>عربي</Button>
			<Button centerRipple color="error" onClick={() => changeLanguage("he")}>עברית</Button>
			<Button color="error" onClick={() => changeLanguage("en")}>English</Button>
		</div>
	);
};

export default LanguageSwitcher;
