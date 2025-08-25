import {Box, IconButton, Menu, MenuItem} from "@mui/material";
import {FunctionComponent, useState} from "react";
import MenuIcon from "@mui/icons-material/Menu";
import {useTranslation} from "react-i18next";
import ReactCountryFlag from "react-country-flag";

interface LanguageSwitcherProps {}

const LanguageSwitcher: FunctionComponent<LanguageSwitcherProps> = () => {
	const {i18n} = useTranslation();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const open = Boolean(anchorEl);
	
	// const changeLanguage = (selectedLang: string) => {
	// 	i18n.changeLanguage(selectedLang);
	// 	localStorage.setItem("lang", selectedLang);
	// };

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = (lang?: string) => {
		if (lang) {
			i18n.changeLanguage(lang);
			localStorage.setItem("lang", lang);
		}
		setAnchorEl(null);
	};

	return (
		<Box>
			<IconButton color='error' onClick={handleClick} size='large'>
				<MenuIcon />
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
