import { Box, Card, Grid, Stack, Typography } from '@mui/material';

import {
    DirectionsCar,
    Category,
    LocalOffer,
    CalendarMonth,
    LocalGasStation,
    Speed,
    Palette,
    Straighten,
    BatteryChargingFull,
    Home,
    Bed,
    Bathtub,
    Pets,
    Memory,
    Storage,
    Smartphone,
    Watch,
    SportsEsports,
    Brush,
} from '@mui/icons-material';
import type { TFunction } from 'i18next';

interface PostSpecificationsProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    product: Record<string, any>;
    categoryLabel?: string;
    t: TFunction;
}

interface Specification {
    key: string;
    label: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
}

const isValidValue = (value: unknown): boolean => {
    if (value === undefined || value === null) {
        return false;
    }

    if (typeof value === 'string' && !value.trim()) {
        return false;
    }

    return true;
};

const formatBoolean = (value: boolean, t: TFunction) => {
    return value ? t('common.yes', 'نعم') : t('common.no', 'لا');
};

const formatNumber = (value: unknown) => {
    if (typeof value !== 'number') {
        return String(value);
    }

    return new Intl.NumberFormat().format(value);
};

export default function PostSpecifications({
    product,
    categoryLabel,
    t,
}: PostSpecificationsProps) {
    const specifications: Specification[] = [];

    /*
     * ============================
     * GENERAL
     * ============================
     */

    if (categoryLabel) {
        specifications.push({
            key: 'category',
            label: t('product.category', 'التصنيف'),
            value: categoryLabel,
            icon: <Category />,
        });
    }

    if (isValidValue(product.subcategory)) {
        specifications.push({
            key: 'subcategory',
            label: t('product.subcategory', 'الفئة الفرعية'),
            value: product.subcategory,
            icon: <Category />,
        });
    }

    if (isValidValue(product.brand)) {
        specifications.push({
            key: 'brand',
            label: t('product.brand', 'العلامة التجارية'),
            value: product.brand,
            icon: <LocalOffer />,
        });
    }

    if (isValidValue(product.model)) {
        specifications.push({
            key: 'model',
            label: t('product.model', 'الموديل'),
            value: product.model,
            icon: <LocalOffer />,
        });
    }

    if (isValidValue(product.color)) {
        specifications.push({
            key: 'color',
            label: t('product.color', 'اللون'),
            value: product.color,
            icon: <Palette />,
        });
    }

    if (isValidValue(product.material)) {
        specifications.push({
            key: 'material',
            label: t('product.material', 'الخامة'),
            value: product.material,
            icon: <Category />,
        });
    }

    /*
     * ============================
     * VEHICLES
     * ============================
     */

    if (isValidValue(product.year)) {
        specifications.push({
            key: 'year',
            label: t('product.year', 'السنة'),
            value: product.year,
            icon: <CalendarMonth />,
        });
    }

    if (isValidValue(product.fuel)) {
        specifications.push({
            key: 'fuel',
            label: t('product.fuel', 'نوع الوقود'),
            value: product.fuel,
            icon: <LocalGasStation />,
        });
    }

    if (isValidValue(product.mileage)) {
        specifications.push({
            key: 'mileage',
            label: t('product.mileage', 'الممشى'),
            value: `${formatNumber(product.mileage)} كم`,
            icon: <Speed />,
        });
    }

    if (isValidValue(product.engineCapacity)) {
        specifications.push({
            key: 'engineCapacity',
            label: t('product.engineCapacity', 'سعة المحرك'),
            value: `${formatNumber(product.engineCapacity)} CC`,
            icon: <DirectionsCar />,
        });
    }

    if (isValidValue(product.batteryCapacity)) {
        specifications.push({
            key: 'batteryCapacity',
            label: t('product.batteryCapacity', 'سعة البطارية'),
            value: `${formatNumber(product.batteryCapacity)}`,
            icon: <BatteryChargingFull />,
        });
    }

    if (isValidValue(product.rangeKm)) {
        specifications.push({
            key: 'rangeKm',
            label: t('product.rangeKm', 'مدى القيادة'),
            value: `${formatNumber(product.rangeKm)} كم`,
            icon: <DirectionsCar />,
        });
    }

    /*
     * ============================
     * CLOTHES / BAGS
     * ============================
     */

    if (isValidValue(product.size)) {
        specifications.push({
            key: 'size',
            label: t('product.size', 'الحجم'),
            value: product.size,
            icon: <Straighten />,
        });
    }

    if (isValidValue(product.length)) {
        specifications.push({
            key: 'length',
            label: t('product.length', 'الطول'),
            value: product.length,
            icon: <Straighten />,
        });
    }

    if (isValidValue(product.heelHeight)) {
        specifications.push({
            key: 'heelHeight',
            label: t('product.heelHeight', 'ارتفاع الكعب'),
            value: `${product.heelHeight} سم`,
            icon: <Straighten />,
        });
    }

    /*
     * ============================
     * HOUSE / GARDEN
     * ============================
     */

    if (isValidValue(product.dimensions)) {
        specifications.push({
            key: 'dimensions',
            label: t('product.dimensions', 'الأبعاد'),
            value: product.dimensions,
            icon: <Straighten />,
        });
    }

    if (isValidValue(product.capacity)) {
        specifications.push({
            key: 'capacity',
            label: t('product.capacity', 'السعة'),
            value: product.capacity,
            icon: <Straighten />,
        });
    }

    if (isValidValue(product.powerWatts)) {
        specifications.push({
            key: 'powerWatts',
            label: t('product.powerWatts', 'القدرة الكهربائية'),
            value: `${formatNumber(product.powerWatts)} W`,
            icon: <BatteryChargingFull />,
        });
    }

    if (isValidValue(product.hoseLength)) {
        specifications.push({
            key: 'hoseLength',
            label: t('product.hoseLength', 'طول الخرطوم'),
            value: `${product.hoseLength}`,
            icon: <Straighten />,
        });
    }

    if (isValidValue(product.automatic)) {
        specifications.push({
            key: 'automatic',
            label: t('product.automatic', 'تلقائي'),
            value: formatBoolean(product.automatic, t),
        });
    }

    if (isValidValue(product.weatherResistant)) {
        specifications.push({
            key: 'weatherResistant',
            label: t('product.weatherResistant', 'مقاوم للعوامل الجوية'),
            value: formatBoolean(product.weatherResistant, t),
        });
    }

    /*
     * ============================
     * ELECTRONICS
     * ============================
     */

    if (isValidValue(product.processor)) {
        specifications.push({
            key: 'processor',
            label: t('product.processor', 'المعالج'),
            value: product.processor,
            icon: <Memory />,
        });
    }

    if (isValidValue(product.ram)) {
        specifications.push({
            key: 'ram',
            label: t('product.ram', 'الذاكرة RAM'),
            value: `${product.ram} GB`,
            icon: <Memory />,
        });
    }

    if (isValidValue(product.storage)) {
        specifications.push({
            key: 'storage',
            label: t('product.storage', 'التخزين'),
            value: `${product.storage} GB`,
            icon: <Storage />,
        });
    }

    if (isValidValue(product.screenSize)) {
        specifications.push({
            key: 'screenSize',
            label: t('product.screenSize', 'حجم الشاشة'),
            value: `${product.screenSize}"`,
            icon: <Smartphone />,
        });
    }

    if (isValidValue(product.resolution)) {
        specifications.push({
            key: 'resolution',
            label: t('product.resolution', 'دقة الشاشة'),
            value: product.resolution,
            icon: <Smartphone />,
        });
    }

    if (isValidValue(product.operatingSystem)) {
        specifications.push({
            key: 'operatingSystem',
            label: t('product.operatingSystem', 'نظام التشغيل'),
            value: product.operatingSystem,
        });
    }

    if (isValidValue(product.condition)) {
        specifications.push({
            key: 'condition',
            label: t('product.condition', 'الحالة'),
            value: product.condition,
        });
    }

    if (isValidValue(product.networkType)) {
        specifications.push({
            key: 'networkType',
            label: t('product.networkType', 'نوع الشبكة'),
            value: product.networkType,
        });
    }

    /*
     * ============================
     * REAL ESTATE
     * ============================
     */

    if (isValidValue(product.area)) {
        specifications.push({
            key: 'area',
            label: t('product.area', 'المساحة'),
            value: `${formatNumber(product.area)} م²`,
            icon: <Home />,
        });
    }

    if (isValidValue(product.rooms)) {
        specifications.push({
            key: 'rooms',
            label: t('product.rooms', 'عدد الغرف'),
            value: product.rooms,
            icon: <Bed />,
        });
    }

    if (isValidValue(product.bathrooms)) {
        specifications.push({
            key: 'bathrooms',
            label: t('product.bathrooms', 'عدد الحمامات'),
            value: product.bathrooms,
            icon: <Bathtub />,
        });
    }

    if (isValidValue(product.floors)) {
        specifications.push({
            key: 'floors',
            label: t('product.floors', 'عدد الطوابق'),
            value: product.floors,
        });
    }

    if (isValidValue(product.hasParking)) {
        specifications.push({
            key: 'hasParking',
            label: t('product.hasParking', 'موقف سيارات'),
            value: formatBoolean(product.hasParking, t),
        });
    }

    if (isValidValue(product.hasElevator)) {
        specifications.push({
            key: 'hasElevator',
            label: t('product.hasElevator', 'مصعد'),
            value: formatBoolean(product.hasElevator, t),
        });
    }

    if (isValidValue(product.furnished)) {
        specifications.push({
            key: 'furnished',
            label: t('product.furnished', 'مفروشة'),
            value: formatBoolean(product.furnished, t),
        });
    }

    if (isValidValue(product.rentalType)) {
        specifications.push({
            key: 'rentalType',
            label: t('product.rentalType', 'نوع المعاملة'),
            value: product.rentalType,
        });
    }

    if (isValidValue(product.propertyAge)) {
        specifications.push({
            key: 'propertyAge',
            label: t('product.propertyAge', 'عمر العقار'),
            value: `${product.propertyAge} ${t('product.years', 'سنوات')}`,
        });
    }

    /*
     * ============================
     * PETS
     * ============================
     */

    if (isValidValue(product.breed)) {
        specifications.push({
            key: 'breed',
            label: t('product.breed', 'السلالة'),
            value: product.breed,
            icon: <Pets />,
        });
    }

    if (isValidValue(product.age)) {
        specifications.push({
            key: 'age',
            label: t('product.age', 'العمر'),
            value: `${product.age} ${t('product.months', 'شهر')}`,
        });
    }

    if (isValidValue(product.gender)) {
        specifications.push({
            key: 'gender',
            label: t('product.gender', 'الجنس'),
            value: product.gender,
        });
    }

    if (isValidValue(product.vaccinated)) {
        specifications.push({
            key: 'vaccinated',
            label: t('product.vaccinated', 'مطعّم'),
            value: formatBoolean(product.vaccinated, t),
        });
    }

    if (isValidValue(product.neutered)) {
        specifications.push({
            key: 'neutered',
            label: t('product.neutered', 'مُعقّم'),
            value: formatBoolean(product.neutered, t),
        });
    }

    if (isValidValue(product.microchipped)) {
        specifications.push({
            key: 'microchipped',
            label: t('product.microchipped', 'مزود بشريحة'),
            value: formatBoolean(product.microchipped, t),
        });
    }

    if (isValidValue(product.weight)) {
        specifications.push({
            key: 'weight',
            label: t('product.weight', 'الوزن'),
            value: `${product.weight} كجم`,
        });
    }

    if (isValidValue(product.temperament)) {
        specifications.push({
            key: 'temperament',
            label: t('product.temperament', 'الطبع'),
            value: product.temperament,
        });
    }

    /*
     * ============================
     * ART
     * ============================
     */

    if (isValidValue(product.artist)) {
        specifications.push({
            key: 'artist',
            label: t('product.artist', 'الفنان'),
            value: product.artist,
            icon: <Brush />,
        });
    }

    if (isValidValue(product.creationYear)) {
        specifications.push({
            key: 'creationYear',
            label: t('product.creationYear', 'سنة الإنشاء'),
            value: product.creationYear,
            icon: <CalendarMonth />,
        });
    }

    if (isValidValue(product.technique)) {
        specifications.push({
            key: 'technique',
            label: t('product.technique', 'التقنية'),
            value: product.technique,
        });
    }

    if (isValidValue(product.certificate)) {
        specifications.push({
            key: 'certificate',
            label: t('product.certificate', 'شهادة الأصالة'),
            value: formatBoolean(product.certificate, t),
        });
    }

    if (isValidValue(product.framed)) {
        specifications.push({
            key: 'framed',
            label: t('product.framed', 'مؤطرة'),
            value: formatBoolean(product.framed, t),
        });
    }

    /*
     * ============================
     * GAMING
     * ============================
     */

    if (isValidValue(product.platform)) {
        specifications.push({
            key: 'platform',
            label: t('product.platform', 'المنصة'),
            value: product.platform,
            icon: <SportsEsports />,
        });
    }

    if (isValidValue(product.genre)) {
        specifications.push({
            key: 'genre',
            label: t('product.genre', 'النوع'),
            value: product.genre,
        });
    }

    if (isValidValue(product.edition)) {
        specifications.push({
            key: 'edition',
            label: t('product.edition', 'الإصدار'),
            value: product.edition,
        });
    }

    if (isValidValue(product.multiplayer)) {
        specifications.push({
            key: 'multiplayer',
            label: t('product.multiplayer', 'متعدد اللاعبين'),
            value: formatBoolean(product.multiplayer, t),
        });
    }

    if (isValidValue(product.releaseYear)) {
        specifications.push({
            key: 'releaseYear',
            label: t('product.releaseYear', 'سنة الإصدار'),
            value: product.releaseYear,
            icon: <CalendarMonth />,
        });
    }

    /*
     * ============================
     * OTHER
     * ============================
     */

    if (isValidValue(product.waterResistant)) {
        specifications.push({
            key: 'waterResistant',
            label: t('product.waterResistant', 'مقاوم للماء'),
            value: formatBoolean(product.waterResistant, t),
            icon: <Watch />,
        });
    }

    if (isValidValue(product.safeMaterial)) {
        specifications.push({
            key: 'safeMaterial',
            label: t('product.safeMaterial', 'مواد آمنة'),
            value: formatBoolean(product.safeMaterial, t),
        });
    }

    if (isValidValue(product.expiryDate)) {
        specifications.push({
            key: 'expiryDate',
            label: t('product.expiryDate', 'تاريخ انتهاء الصلاحية'),
            value: product.expiryDate,
            icon: <CalendarMonth />,
        });
    }

    if (isValidValue(product.volume)) {
        specifications.push({
            key: 'volume',
            label: t('product.volume', 'الحجم'),
            value: product.volume,
        });
    }

    if (isValidValue(product.assemblyRequired)) {
        specifications.push({
            key: 'assemblyRequired',
            label: t('product.assemblyRequired', 'يحتاج إلى تركيب'),
            value: formatBoolean(product.assemblyRequired, t),
        });
    }

    if (isValidValue(product.style)) {
        specifications.push({
            key: 'style',
            label: t('product.style', 'الطراز'),
            value: product.style,
        });
    }

    if (isValidValue(product.includesAccessories)) {
        specifications.push({
            key: 'includesAccessories',
            label: t('product.includesAccessories', 'يشمل ملحقات'),
            value: formatBoolean(product.includesAccessories, t),
        });
    }

    /*
     * ============================
     * EMPTY STATE
     * ============================
     */

    if (specifications.length === 0) {
        return null;
    }

    return (
        <Card
            sx={{
                p: {
                    xs: 2.25,
                    md: 3,
                },
                borderRadius: 3,
            }}
        >
            <Stack spacing={2.5}>
                <Box>
                    <Typography
                        variant='h6'
                        sx={{
                            fontWeight: 800,
                        }}
                    >
                        {t('product.specifications', 'مواصفات المنتج')}
                    </Typography>

                    <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mt: 0.5 }}
                    >
                        {t(
                            'product.specificationsSubtitle',
                            'تفاصيل ومواصفات المنتج',
                        )}
                    </Typography>
                </Box>

                <Grid container spacing={1.5}>
                    {specifications.map((specification) => (
                        <Grid
                            key={specification.key}
                            size={{
                                xs: 6,
                                sm: 4,
                                md: 3,
                            }}
                        >
                            <Box
                                sx={{
                                    height: '100%',
                                    p: 1.75,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    bgcolor: 'background.default',
                                    transition: 'all 0.2s ease',

                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                            >
                                <Stack spacing={0.75}>
                                    {specification.icon && (
                                        <Box
                                            sx={{
                                                color: 'primary.main',
                                                display: 'flex',
                                            }}
                                        >
                                            {specification.icon}
                                        </Box>
                                    )}

                                    <Typography
                                        variant='caption'
                                        color='text.secondary'
                                        sx={{
                                            fontWeight: 600,
                                        }}
                                    >
                                        {specification.label}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: '0.9rem',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {specification.value}
                                    </Typography>
                                </Stack>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        </Card>
    );
}
