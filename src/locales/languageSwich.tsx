import {Box, Button} from "@mui/material";
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
		<Box>
			<Button color='error' onClick={() => changeLanguage("ar")}>
				ar |
			</Button>
			<Button centerRipple color='error' onClick={() => changeLanguage("he")}>
				he |
			</Button>
			<Button color='error' onClick={() => changeLanguage("en")}>
				En |
			</Button>
		</Box>
	);
};

export default LanguageSwitcher;
