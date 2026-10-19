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

const Flag = ({ country, label }: { country: string; label?: string }) => (
    <ReactCountryFlag
        countryCode={country}
        svg
        aria-hidden='true'
        title={label}
        style={{ marginInlineEnd: 8 }}
    />
);

const LanguageSwitcher: FunctionComponent = () => {
    const { i18n, t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const current =
        LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[2];

    const handleSelect = async (lang?: Lang) => {
        setAnchorEl(null);

        if (!lang || lang === i18n.language) return;

        try {
            await loadLanguage(lang);
            localStorage.setItem('lang', lang);
        } catch (error) {
            console.error('Failed to change language:', error);
        }
    };

    return (
        <Box>
            <IconButton
                color='primary'
                onClick={(e) => setAnchorEl(e.currentTarget)}
                size='large'
                aria-label={`${t('changeLanguage', 'تغيير اللغة')}: ${current.label}`}
                aria-controls={open ? 'language-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
            >
                <Language aria-hidden='true' />
                <Flag country={current.country} />
            </IconButton>

            <Menu
                id='language-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleSelect()}
            >
                {LANGUAGES.map(({ code, country, label }) => (
                    <MenuItem
                        key={code}
                        selected={code === current.code}
                        onClick={() => handleSelect(code)}
                        lang={code}
                    >
                        <Flag country={country} />
                        {label}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

export default LanguageSwitcher;