import { IconButton, useTheme } from '@mui/material';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import { useTranslation } from 'react-i18next';
import handleRTL from '../../locales/handleRTL';
import { BRAND } from './theme/brand';

interface FloatingToggleProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    SIDEBAR_WIDTH: number;
    BUTTON_SIZE: number;
    COLLAPSED_WIDTH: number;
}

const FloatingToggle = ({
    open,
    setOpen,
    SIDEBAR_WIDTH,
    BUTTON_SIZE,
    COLLAPSED_WIDTH,
}: FloatingToggleProps) => {
    const { t } = useTranslation();
    const direction = handleRTL();
    const theme = useTheme();

    // السايدبار على inline-end: LTR = يمين، RTL = يسار
    // مسكّر → السهم لجوّا (يفتح) | مفتوح → السهم لبرّا (يسكّر)
    const isRtl = direction === 'rtl';
    const showRightArrow = isRtl ? !open : open;

    return (
        <IconButton
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? t('common.close') : t('categories.title')}
            aria-expanded={open}
            sx={{
                position: 'fixed',
                top: '8%',
                insetInlineEnd: open ? SIDEBAR_WIDTH : COLLAPSED_WIDTH - 72,
                zIndex: theme.zIndex.drawer - 1,
                width: BUTTON_SIZE + 77,
                height: 42,
                borderRadius: '0 50% 50% 0',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderLeftWidth: 0,
                borderColor: 'divider',
                boxShadow: 5,
                transition: 'inset-inline-end 200ms ease-in-out',
                overflow: 'visible', // يسمح للحلقة تطلع برا الزر
                '&:hover': { bgcolor: 'background.paper' },

                // ─── حلقة نبض ذهبية ───
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 2,
                    borderRadius: '50%',
                    borderWidth: '0 5px 0 0',
                    borderStyle: 'solid',
                    borderColor: BRAND.gold,
                    pointerEvents: 'none',
                    animation: 'safqa-toggle-ring 5s ease-out infinite',
                },

                '@media (prefers-reduced-motion: reduce)': {
                    '&::after': { animation: 'none', opacity: 0 },
                },

                '@keyframes safqa-toggle-ring': {
                    '0%': { transform: 'scale(1)', opacity: 1 },
                    '6%': { transform: 'scale(1.2)', opacity: 0 },
                },
            }}
        >
            {showRightArrow ? (
                <ChevronRightRoundedIcon fontSize='small' />
            ) : (
                <ChevronLeftRoundedIcon fontSize='small' />
            )}
        </IconButton>
    );
};

export default FloatingToggle;
