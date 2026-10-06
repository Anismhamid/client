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
}

const FloatingToggle = ({
    open,
    setOpen,
    SIDEBAR_WIDTH,
    BUTTON_SIZE,
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
                top: '40%',
                insetInlineEnd: open ? SIDEBAR_WIDTH : 0,
                zIndex: theme.zIndex.drawer + 1,
                width: BUTTON_SIZE,
                height: 42,
                borderRadius: 0,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 2,
                transition: 'inset-inline-end 200ms ease-in-out',
                overflow: 'visible', // يسمح للحلقة تطلع برا الزر
                '&:hover': { bgcolor: 'background.paper' },

                // ─── حلقة نبض ذهبية ───
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 'inherit',
                    borderRight: `2px solid ${BRAND.gold}`,
                    pointerEvents: 'none',
                    animation: 'safqa-toggle-ring 1.8s ease-out infinite',
                },

                '@media (prefers-reduced-motion: reduce)': {
                    '&::after': { animation: 'none', opacity: 0 },
                },

                '@keyframes safqa-toggle-ring': {
                    '0%': { transform: 'scale(1)', opacity: 0.7 },
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