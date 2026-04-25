import { productsPathes } from '../routes/routes';
import { Category } from './categories';

export const postsCategory = [
    { id: 'House' },
    { id: 'Garden' },
    { id: 'Electronics' },
    { id: 'Kids' },
    { id: 'Baby' },
    { id: 'Beauty' },
    { id: 'Cleaning' },
    { id: 'Health' },
    { id: 'Watches' },
    { id: 'MenClothes' },
    { id: 'WomenClothes' },
    { id: 'WomenBags' },
    { id: 'Cars' },
    { id: 'Motorcycles' },
    { id: 'Trucks' },
    { id: 'Bikes' },
    { id: 'ElectricVehicles' },
];

// ----- Category Labels -----
export const categoryLabels: Record<Category, string> = {
    House: 'مستلزمات البيت',
    Garden: 'الحديقة',
    Electronics: 'إلكترونيات',
    Kids: 'ألعاب الأطفال',
    Baby: 'مستلزمات الأطفال',
    Beauty: 'مستحضرات التجميل',
    Cleaning: 'مواد التنظيف',
    Health: 'الصحة والعناية',
    Watches: 'ساعات',
    MenClothes: 'ملابس رجالية',
    WomenClothes: 'ملابس نسائية',
    WomenBags: 'حقائب نسائية',
    Cars: 'سيارات',
    Motorcycles: 'دراجات نارية',
    Trucks: 'شاحنات',
    Bikes: 'دراجات هوائية',
    ElectricVehicles: 'مركبات كهربائية',
};

export const categoryPathMap: Record<Category, string> = {
    House: productsPathes.house,
    Garden: productsPathes.garden,
    Electronics: productsPathes.electronics,
    Kids: productsPathes.kids,
    Baby: productsPathes.baby,
    Beauty: productsPathes.beauty,
    Cleaning: productsPathes.cleaning,
    Health: productsPathes.health,
    Watches: productsPathes.watches,
    MenClothes: productsPathes.menClothes,
    WomenClothes: productsPathes.womenClothes,
    WomenBags: productsPathes.womenBags,
    Cars: productsPathes.cars,
    Motorcycles: productsPathes.motorcycles,
    Trucks: productsPathes.trucks,
    Bikes: productsPathes.bikes,
    ElectricVehicles: productsPathes.electricVehicles,
} as const;
