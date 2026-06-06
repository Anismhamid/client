import BoltIcon from '@mui/icons-material/Bolt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import { alpha, useTheme } from '@mui/material';

export const usePlans = () => {
    const theme = useTheme();

    return [
        {
            id: 'highlight',
            title: 'Highlight',
            description: 'تمييز الإعلان داخل القوائم',
            days: 7,
            price: 10,
            icon: <BoltIcon fontSize='medium' />,
            color: theme.palette.warning.main,
            bgColor: alpha(theme.palette.warning.main, 0.1),
            btnColor: 'warning' as const,
        },
        {
            id: 'top',
            title: 'Top Search',
            description: 'الظهور أعلى نتائج البحث',
            days: 7,
            price: 25,
            icon: <TrendingUpIcon fontSize='medium' />,
            color: theme.palette.primary.main,
            bgColor: alpha(theme.palette.primary.main, 0.1),
            btnColor: 'primary' as const,
        },
        {
            id: 'homepage',
            title: 'Homepage',
            description: 'ظهور في الصفحة الرئيسية',
            days: 7,
            price: 50,
            icon: <StarIcon fontSize='medium' />,
            color: theme.palette.success.main,
            bgColor: alpha(theme.palette.success.main, 0.1),
            btnColor: 'success' as const,
            featured: true,
        },
    ];
};
