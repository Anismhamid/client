// components/home/CategoryBar.tsx
import { Box, ButtonBase, Container, Typography } from '@mui/material';
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

const CategoryBar = ({ categories, selected, onSelect, total }: CategoryBarProps) => {
    const { t } = useTranslation();

    if (categories.length === 0) return null;

    const chips: { key: string | null; label: string; count: number }[] = [
        { key: null, label: t('categories.all', 'الكل'), count: total },
        ...categories.map((c) => ({ key: c.name, label: c.name, count: c.count })),
    ];

    return (
        <Container maxWidth='lg' sx={{ px: { xs: 1.5, sm: 3, md: 4 }, pt: { xs: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <SealBadge size={26} rotate={-6} tone='outline'>
                    <CategoryOutlinedIcon sx={{ fontSize: 14 }} />
                </SealBadge>
                <Typography
                    variant='overline'
                    sx={{ fontWeight: 700, letterSpacing: 0.6, color: 'text.secondary' }}
                >
                    {t('categories.eyebrow', 'تصفح حسب الفئة')}
                </Typography>
            </Box>

            <Box
                role='tablist'
                sx={{
                    display: 'flex',
                    gap: 1,
                    overflowX: 'auto',
                    pb: 1,
                    scrollSnapType: 'x proximity',
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                }}
            >
                {chips.map(({ key, label, count }) => {
                    const active = selected === key;
                    return (
                        <ButtonBase
                            key={key ?? '__all'}
                            role='tab'
                            aria-selected={active}
                            onClick={() => onSelect(key)}
                            sx={{
                                flexShrink: 0,
                                scrollSnapAlign: 'start',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.75,
                                px: 1.75,
                                py: 0.9,
                                borderRadius: '999px',
                                border: '1px',
                                borderStyle: active ? 'solid' : 'dashed',
                                borderColor: active ? BRAND.brown : 'divider',
                                color: active ? '#fff' : 'text.primary',
                                background: active ? BRAND.gradient : 'transparent',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    borderColor: BRAND.brown,
                                    bgcolor: active ? undefined : BRAND.ledger(0.05),
                                },
                            }}
                        >
                            {label}
                            <Box
                                component='span'
                                sx={{
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    opacity: active ? 0.85 : 0.6,
                                    fontVariantNumeric: 'tabular-nums',
                                }}
                            >
                                {count}
                            </Box>
                        </ButtonBase>
                    );
                })}
            </Box>
        </Container>
    );
};

export default CategoryBar;