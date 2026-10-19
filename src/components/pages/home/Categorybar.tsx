
import { memo, useMemo } from 'react';
import {
    Box,
    ButtonBase,
    Container,
    Typography,
    useTheme,
} from '@mui/material';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import { useTranslation } from 'react-i18next';

import SealBadge from './SealBadge';
import { BRAND } from '../../navbar/theme/brand';

export interface CategoryItem {
    name: string;
    count: number;
}

interface CategoryBarProps {
    categories: CategoryItem[];
    selected: string | null;
    onSelect: (name: string | null) => void;
    total: number;
}

interface CategoryChip {
    key: string | null;
    label: string;
    count: number;
}

const CategoryBar = ({
    categories,
    selected,
    onSelect,
    total,
}: CategoryBarProps) => {
    const { t, i18n } = useTranslation();
    const theme = useTheme();

    const isRTL = theme.direction === 'rtl';

    const numberFormatter = useMemo(
        () =>
            new Intl.NumberFormat(i18n.resolvedLanguage || i18n.language, {
                notation: 'standard',
                maximumFractionDigits: 0,
            }),
        [i18n.language, i18n.resolvedLanguage],
    );

    const chips = useMemo<CategoryChip[]>(
        () => [
            {
                key: null,
                label: t('categories.all', {
                    defaultValue: 'الكل',
                }),
                count: total,
            },
            ...categories.map((category) => ({
                key: category.name,
                // Keep the original category name as a safe fallback.
                label: t(`categories.${category.name}.label`, {
                    defaultValue: category.name,
                }),
                count: category.count,
            })),
        ],
        [categories, total, t],
    );

    const eyebrow = t('categories.eyebrow', {
        defaultValue: 'تصفح حسب الفئة',
    });

    const sectionLabel = t('categories.filterBy', {
        defaultValue: 'تصفية الإعلانات حسب الفئة',
    });

    return (
        <Container
            maxWidth="lg"
            sx={{
                px: { xs: 1.5, sm: 3, md: 4 },
                pt: { xs: 2.5, md: 3.5 },
                pb: 0.5,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    mb: 1.75,
                }}
            >
                <SealBadge size={30} rotate={-6} tone="outline">
                    <CategoryOutlinedIcon
                        sx={{
                            fontSize: 16,
                            color: BRAND.brown,
                        }}
                    />
                </SealBadge>

                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        variant="overline"
                        sx={{
                            display: 'block',
                            fontWeight: 800,
                            fontSize: '0.76rem',
                            lineHeight: 1.7,
                            letterSpacing: isRTL ? 0 : 0.7,
                            color: 'text.secondary',
                        }}
                    >
                        {eyebrow}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: 'text.primary',
                            fontWeight: 700,
                            fontSize: { xs: '0.9rem', sm: '0.95rem' },
                        }}
                    >
                        {sectionLabel}
                    </Typography>
                </Box>
            </Box>

            <Box
                role="group"
                aria-label={sectionLabel}
                sx={{
                    position: 'relative',
                    width: '100%',
                    minWidth: 0,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: { xs: 0.85, sm: 1.1 },
                        overflowX: 'auto',
                        overflowY: 'hidden',
                        py: 0.75,
                        px: 0.25,
                        scrollBehavior: 'smooth',
                        scrollSnapType: 'x proximity',
                        WebkitOverflowScrolling: 'touch',
                        overscrollBehaviorX: 'contain',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                    }}
                >
                    {chips.map(({ key, label, count }) => {
                        const active = selected === key;

                        return (
                            <ButtonBase
                                key={key ?? '__all'}
                                type="button"
                                aria-pressed={active}
                                aria-label={`${label} (${numberFormatter.format(count)})`}
                                onClick={() => {
                                    if (!active) {
                                        onSelect(key);
                                    }
                                }}
                                sx={{
                                    flex: '0 0 auto',
                                    scrollSnapAlign: 'start',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 1,
                                    minHeight: 42,
                                    px: { xs: 1.5, sm: 1.9 },
                                    py: 0.9,
                                    borderRadius: '999px',
                                    border: '1px solid',
                                    borderColor: active
                                        ? BRAND.brown
                                        : 'divider',
                                    color: active
                                        ? '#fff'
                                        : 'text.primary',
                                    background: active
                                        ? BRAND.gradient
                                        : 'background.paper',
                                    boxShadow: active
                                        ? `0 3px 12px ${BRAND.ledger(0.15)}`
                                        : 'none',
                                    fontSize: '0.84rem',
                                    fontWeight: active ? 800 : 600,
                                    whiteSpace: 'nowrap',
                                    lineHeight: 1.5,
                                    transition:
                                        'background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease',
                                    '&:hover': {
                                        borderColor: BRAND.brown,
                                        background: active
                                            ? BRAND.gradient
                                            : BRAND.ledger(0.06),
                                        boxShadow: `0 2px 8px ${BRAND.ledger(0.1)}`,
                                    },
                                    '&:active': {
                                        transform: 'scale(0.97)',
                                    },
                                    '&.Mui-focusVisible': {
                                        outline: `3px solid ${BRAND.brown}`,
                                        outlineOffset: 3,
                                    },
                                    '@media (prefers-reduced-motion: reduce)': {
                                        transition: 'none',
                                        '&:active': {
                                            transform: 'none',
                                        },
                                    },
                                }}
                            >
                                <Box
                                    component="span"
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        minWidth: 0,
                                    }}
                                >
                                    {label}
                                </Box>

                                <Box
                                    component="span"
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minWidth: 23,
                                        height: 23,
                                        px: 0.65,
                                        borderRadius: '999px',
                                        fontSize: '0.7rem',
                                        fontWeight: 800,
                                        fontVariantNumeric: 'tabular-nums',
                                        color: active
                                            ? '#fff'
                                            : 'text.secondary',
                                        backgroundColor: active
                                            ? 'rgba(255,255,255,0.18)'
                                            : 'action.hover',
                                    }}
                                >
                                    {numberFormatter.format(
                                        Number.isFinite(count) ? count : 0,
                                    )}
                                </Box>
                            </ButtonBase>
                        );
                    })}
                </Box>
            </Box>
        </Container>
    );
};

export default memo(CategoryBar);
