import {
	FormControl,
	FormControlLabel,
	PaletteMode,
	Radio,
	RadioGroup,
} from "@mui/material";
import {FunctionComponent} from "react";
import LanguageSwitcher from "../../locales/languageSwich";

interface ThemeProps {
	mode: PaletteMode;
	setMode: (mode: PaletteMode) => void;
}

const Theme: FunctionComponent<ThemeProps> = ({mode, setMode}) => {
	const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newMode = event.target.value as PaletteMode;
		setMode(newMode);
		localStorage.setItem("theme", newMode);
	};

	return (
		<FormControl sx={{width: "100%", display: "flex"}}>
			<RadioGroup
				aria-labelledby='demo-theme-toggle'
				name='theme-toggle'
				row
				value={mode}
				onChange={handleThemeChange}
			>
				<FormControlLabel value='light' control={<Radio />} label='Light' />
				<FormControlLabel value='dark' control={<Radio />} label='Dark' />
				<LanguageSwitcher />
			</RadioGroup>
		</FormControl>
	);
};

export default Theme;
