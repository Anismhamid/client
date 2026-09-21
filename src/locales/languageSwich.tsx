import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { FunctionComponent, useState } from 'react';
import { Language } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag';
import { Lang, loadLanguage } from './i18n';

const LANGUAGES: { code: Lang; country: string; label: string }[] = [
    { code: 'ar', country: 'SA', label: 'العربية' },
    { code: 'he', country: 'IL', label: 'עברית' },
    { code: 'en', country: 'GB', label: 'English' },
];

const Flag = ({ country }: { country: string }) => (
    <ReactCountryFlag
        countryCode={country}
        svg
        style={{ marginInlineEnd: 8 }}
    />
);

const LanguageSwitcher: FunctionComponent = () => {
    const { i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const current =
        LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[2];

    const handleSelect = async (lang?: Lang) => {
        setAnchorEl(null);

        if (!lang || lang === i18n.language) return;

        await loadLanguage(lang);
        localStorage.setItem('lang', lang);
    };

    return (
        <Box>
            <IconButton
                color='primary'
                onClick={(e) => setAnchorEl(e.currentTarget)}
                size='large'
            >
                <Language />
                <Flag country={current.country} />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => handleSelect()}
            >
                {LANGUAGES.map(({ code, country, label }) => (
                    <MenuItem key={code} onClick={() => handleSelect(code)}>
                        <Flag country={country} />
                        {label}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

export default LanguageSwitcher;