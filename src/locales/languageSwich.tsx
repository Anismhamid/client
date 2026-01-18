import {Box, IconButton, Menu, MenuItem} from "@mui/material";
import {FunctionComponent, useState, useEffect} from "react";
import {Language} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import ReactCountryFlag from "react-country-flag";

interface LanguageSwitcherProps {}

const LanguageSwitcher: FunctionComponent<LanguageSwitcherProps> = () => {
	const {i18n} = useTranslation();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [language, setLanguage] = useState<string>(i18n.language || "en");

	const open = Boolean(anchorEl);

	useEffect(() => {
		// عند تحميل الصفحة، نقرأ اللغة من localStorage
		const savedLang = localStorage.getItem("lang");
		if (savedLang && savedLang !== language) {
			i18n.changeLanguage(savedLang);
			setLanguage(savedLang);
		}
	}, []);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = (lang?: string) => {
		if (lang) {
			i18n.changeLanguage(lang);
			localStorage.setItem("lang", lang);
			setLanguage(lang);
		}
		setAnchorEl(null);
	};

	const getFlag = () => {
		switch (language) {
			case "ar":
				return <ReactCountryFlag countryCode='SA' svg style={{marginRight: 8}} />;
			case "he":
				return <ReactCountryFlag countryCode='IL' svg style={{marginRight: 8}} />;
			case "en":
			default:
				return <ReactCountryFlag countryCode='GB' svg style={{marginRight: 8}} />;
		}
	};

	return (
		<Box>
			<IconButton color='primary' onClick={handleClick} size='large'>
				<Language />
				{getFlag()}
			</IconButton>
			<Menu anchorEl={anchorEl} open={open} onClose={() => handleClose()}>
				<MenuItem onClick={() => handleClose("ar")}>
					<ReactCountryFlag countryCode='SA' svg style={{marginRight: 8}} />
					العربية
				</MenuItem>
				<MenuItem onClick={() => handleClose("he")}>
					<ReactCountryFlag countryCode='IL' svg style={{marginRight: 8}} />
					עברית
				</MenuItem>
				<MenuItem onClick={() => handleClose("en")}>
					<ReactCountryFlag countryCode='GB' svg style={{marginRight: 8}} />
					English
				</MenuItem>
			</Menu>
		</Box>
	);
};

export default LanguageSwitcher;
