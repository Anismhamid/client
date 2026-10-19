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
    // ✅ أيقونات الفئات الجديدة
    Handyman,
    CameraAlt,
    MenuBook,
    Whatshot,
    Print,
    AttachMoney,
    AccessTime,
    Place,
    Person,
    WorkHistory,
} from '@mui/icons-material';
import type { TFunction } from 'i18next';
import { ReactNode } from 'react';

interface PostSpecificationsProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    product: Record<string, any>;
    categoryLabel?: string;
    t: TFunction;
}

interface Specification {
    key: string;
    label: string;
    value: ReactNode;
    icon?: ReactNode;
}

const isValidValue = (value: unknown): boolean => {
    if (value === undefined || value === null) {
        return false;
    }
    if (typeof value === 'string' && !value.trim()) {
        return false;
    }
    // التعامل مع المصفوفات الفارغة
    if (Array.isArray(value) && value.length === 0) {
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

// دالة مساعدة لترجمة نوع التسعير
const formatPricingType = (type: string, t: TFunction) => {
    const map: Record<string, string> = {
        hourly: t('product.pricing.hourly', 'بالساعة'),
        fixed: t('product.pricing.fixed', 'سعر ثابت'),
        daily: t('product.pricing.daily', 'يومي'),
        monthly: t('product.pricing.monthly', 'شهري'),
        negotiable: t('product.pricing.negotiable', 'قابل للتفاوض'),
    };
    return map[type] || type;
};

// دالة مساعدة لترجمة أيام العمل
const formatDays = (days: string[], t: TFunction) => {
    const map: Record<string, string> = {
        sunday: t('days.sunday', 'الأحد'),
        monday: t('days.monday', 'الاثنين'),
        tuesday: t('days.tuesday', 'الثلاثاء'),
        wednesday: t('days.wednesday', 'الأربعاء'),
        thursday: t('days.thursday', 'الخميس'),
        friday: t('days.friday', 'الجمعة'),
        saturday: t('days.saturday', 'السبت'),
    };
    return days.map((d) => map[d] || d).join(' • ');
};

export default function PostSpecifications({
    product,
    categoryLabel,
    t,
}: PostSpecificationsProps) {
    const specifications: Specification[] = [];

    /*
     * ============================
     * GENERAL (عام)
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
     * ✅ SERVICES (الخدمات)
     * ============================
     */
    if (isValidValue(product.serviceTitle)) {
        specifications.push({
            key: 'serviceTitle',
            label: t('product.serviceTitle', 'اسم الخدمة'),
            value: product.serviceTitle,
            icon: <Handyman />,
        });
    }

    if (isValidValue(product.providerName)) {
        specifications.push({
            key: 'providerName',
            label: t('product.providerName', 'مقدم الخدمة'),
            value: product.providerName,
            icon: <Person />,
        });
    }

    if (isValidValue(product.experienceYears)) {
        specifications.push({
            key: 'experienceYears',
            label: t('product.experienceYears', 'سنوات الخبرة'),
            value: `${product.experienceYears} ${t('product.years', 'سنوات')}`,
            icon: <WorkHistory />,
        });
    }

    if (isValidValue(product.priceFrom) || isValidValue(product.priceTo)) {
        const priceRange = [
            product.priceFrom ? `${formatNumber(product.priceFrom)}₪` : null,
            product.priceTo ? `${formatNumber(product.priceTo)}₪` : null,
        ]
            .filter(Boolean)
            .join(' - ');
        
        specifications.push({
            key: 'priceRange',
            label: t('product.priceRange', 'نطاق السعر'),
            value: priceRange || '—',
            icon: <AttachMoney />,
        });
    }

    if (isValidValue(product.pricingType)) {
        specifications.push({
            key: 'pricingType',
            label: t('product.pricingType', 'طريقة التسعير'),
            value: formatPricingType(product.pricingType, t),
        });
    }

    if (isValidValue(product.availableDays)) {
        specifications.push({
            key: 'availableDays',
            label: t('product.availableDays', 'أيام العمل'),
            value: formatDays(product.availableDays, t),
            icon: <CalendarMonth />,
        });
    }

    if (isValidValue(product.availableHours)) {
        specifications.push({
            key: 'availableHours',
            label: t('product.availableHours', 'ساعات العمل'),
            value: product.availableHours,
            icon: <AccessTime />,
        });
    }

    if (isValidValue(product.serviceArea)) {
        specifications.push({
            key: 'serviceArea',
            label: t('product.serviceArea', 'منطقة الخدمة'),
            value: product.serviceArea,
            icon: <Place />,
        });
    }

    if (isValidValue(product.emergencyService)) {
        specifications.push({
            key: 'emergencyService',
            label: t('product.emergencyService', 'خدمة طوارئ'),
            value: formatBoolean(product.emergencyService, t),
        });
    }

    /*
     * ============================
     * ✅ CAMERAS (الكاميرات)
     * ============================
     */
    if (isValidValue(product.cameraType)) {
        specifications.push({
            key: 'cameraType',
            label: t('product.cameraType', 'نوع الكاميرا'),
            value: product.cameraType,
            icon: <CameraAlt />,
        });
    }

    if (isValidValue(product.sensorType)) {
        specifications.push({
            key: 'sensorType',
            label: t('product.sensorType', 'نوع المستشعر'),
            value: product.sensorType,
        });
    }

    if (isValidValue(product.megapixels)) {
        specifications.push({
            key: 'megapixels',
            label: t('product.megapixels', 'الميجابكسل'),
            value: `${formatNumber(product.megapixels)} MP`,
        });
    }

    if (isValidValue(product.videoResolution)) {
        specifications.push({
            key: 'videoResolution',
            label: t('product.videoResolution', 'دقة الفيديو'),
            value: product.videoResolution,
        });
    }

    if (isValidValue(product.lensMount)) {
        specifications.push({
            key: 'lensMount',
            label: t('product.lensMount', 'حامل العدسة'),
            value: product.lensMount,
        });
    }

    if (isValidValue(product.focalLength)) {
        specifications.push({
            key: 'focalLength',
            label: t('product.focalLength', 'البعد البؤري'),
            value: product.focalLength,
        });
    }

    /*
     * ============================
     * ✅ BOOKS (الكتب)
     * ============================
     */
    if (isValidValue(product.title)) {
        specifications.push({
            key: 'title',
            label: t('product.title', 'العنوان'),
            value: product.title,
            icon: <MenuBook />,
        });
    }

    if (isValidValue(product.author)) {
        specifications.push({
            key: 'author',
            label: t('product.author', 'المؤلف'),
            value: product.author,
        });
    }

    if (isValidValue(product.publisher)) {
        specifications.push({
            key: 'publisher',
            label: t('product.publisher', 'الناشر'),
            value: product.publisher,
        });
    }

    if (isValidValue(product.publicationYear)) {
        specifications.push({
            key: 'publicationYear',
            label: t('product.publicationYear', 'سنة النشر'),
            value: product.publicationYear,
            icon: <CalendarMonth />,
        });
    }

    if (isValidValue(product.language)) {
        specifications.push({
            key: 'language',
            label: t('product.language', 'اللغة'),
            value: product.language,
        });
    }

    if (isValidValue(product.isbn)) {
        specifications.push({
            key: 'isbn',
            label: t('product.isbn', 'ISBN'),
            value: product.isbn,
        });
    }

    /*
     * ============================
     * ✅ MUSICAL INSTRUMENTS (الآلات الموسيقية)
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

    if (isValidValue(product.electric)) {
        specifications.push({
            key: 'electric',
            label: t('product.electric', 'كهربائي'),
            value: formatBoolean(product.electric, t),
            icon: <BatteryChargingFull />,
        });
    }

    /*
     * ============================
     * ✅ EQUIPMENT (المعدات - إنشائية، صناعية، لحام، مكتبية)
     * ============================
     */
    if (isValidValue(product.year)) {
        specifications.push({
            key: 'year',
            label: t('product.year', 'سنة الصنع'),
            value: product.year,
            icon: <CalendarMonth />,
        });
    }

    if (isValidValue(product.operatingHours)) {
        specifications.push({
            key: 'operatingHours',
            label: t('product.operatingHours', 'ساعات التشغيل'),
            value: `${formatNumber(product.operatingHours)} ${t('product.hours', 'ساعة')}`,
            icon: <AccessTime />,
        });
    }

    if (isValidValue(product.enginePower)) {
        specifications.push({
            key: 'enginePower',
            label: t('product.enginePower', 'قوة المحرك'),
            value: `${formatNumber(product.enginePower)} HP`,
        });
    }

    if (isValidValue(product.fuelType)) {
        specifications.push({
            key: 'fuelType',
            label: t('product.fuelType', 'نوع الوقود'),
            value: product.fuelType,
            icon: <LocalGasStation />,
        });
    }

    if (isValidValue(product.weight)) {
        specifications.push({
            key: 'weight',
            label: t('product.weight', 'الوزن'),
            value: `${formatNumber(product.weight)} ${t('product.kg', 'كجم')}`,
        });
    }

    if (isValidValue(product.power)) {
        specifications.push({
            key: 'power',
            label: t('product.power', 'القدرة'),
            value: `${formatNumber(product.power)} W`,
            icon: <BatteryChargingFull />,
        });
    }

    if (isValidValue(product.voltage)) {
        specifications.push({
            key: 'voltage',
            label: t('product.voltage', 'الجهد'),
            value: `${formatNumber(product.voltage)} V`,
        });
    }

    if (isValidValue(product.capacity)) {
        specifications.push({
            key: 'capacity',
            label: t('product.capacity', 'السعة'),
            value: product.capacity,
        });
    }

    if (isValidValue(product.weldingType)) {
        specifications.push({
            key: 'weldingType',
            label: t('product.weldingType', 'نوع اللحام'),
            value: product.weldingType,
            icon: <Whatshot />,
        });
    }

    if (isValidValue(product.amperage)) {
        specifications.push({
            key: 'amperage',
            label: t('product.amperage', 'الأمبير'),
            value: `${formatNumber(product.amperage)} A`,
        });
    }

    if (isValidValue(product.connectivity)) {
        specifications.push({
            key: 'connectivity',
            label: t('product.connectivity', 'الاتصال'),
            value: product.connectivity,
        });
    }

    if (isValidValue(product.printTechnology)) {
        specifications.push({
            key: 'printTechnology',
            label: t('product.printTechnology', 'تقنية الطباعة'),
            value: product.printTechnology,
            icon: <Print />,
        });
    }

    if (isValidValue(product.colorPrinting)) {
        specifications.push({
            key: 'colorPrinting',
            label: t('product.colorPrinting', 'طباعة ملونة'),
            value: formatBoolean(product.colorPrinting, t),
        });
    }

    if (isValidValue(product.warranty)) {
        specifications.push({
            key: 'warranty',
            label: t('product.warranty', 'الضمان'),
            value: product.warranty,
        });
    }

    if (isValidValue(product.includedAccessories)) {
        specifications.push({
            key: 'includedAccessories',
            label: t('product.includedAccessories', 'الملحقات المضمنة'),
            value: Array.isArray(product.includedAccessories)
                ? product.includedAccessories.join(' • ')
                : product.includedAccessories,
        });
    }

    /*
     * ============================
     * VEHICLES (المركبات - قديم)
     * ============================
     */
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
     * CLOTHES / BAGS (الملابس)
     * ============================
     */
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
     * HOUSE / GARDEN (المنزل)
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
     * ELECTRONICS (الإلكترونيات)
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
     * REAL ESTATE (العقارات)
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
     * PETS (الحيوانات)
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

    if (isValidValue(product.temperament)) {
        specifications.push({
            key: 'temperament',
            label: t('product.temperament', 'الطبع'),
            value: product.temperament,
        });
    }

    /*
     * ============================
     * ART (الفنون)
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
     * GAMING (الألعاب)
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
     * OTHER (متنوع)
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
                p: { xs: 2.25, md: 3 },
                borderRadius: 3,
            }}
        >
            <Stack spacing={2.5}>
                <Box>
                    <Typography variant='h6' sx={{ fontWeight: 800 }}>
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
                            size={{ xs: 6, sm: 4, md: 3 }}
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
                                        sx={{ fontWeight: 600 }}
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