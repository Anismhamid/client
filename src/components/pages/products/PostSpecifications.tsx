
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ReactNode } from 'react';
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

interface PostSpecificationsProps {
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

type IconType = ReactNode;

const ICONS: Record<string, IconType> = {
    brand: <LocalOffer />,
    model: <LocalOffer />,
    color: <Palette />,
    material: <Category />,
    category: <Category />,
    subcategory: <Category />,

    serviceTitle: <Handyman />,
    providerName: <Person />,
    experienceYears: <WorkHistory />,
    priceRange: <AttachMoney />,
    pricingType: <AttachMoney />,
    availableDays: <CalendarMonth />,
    availableHours: <AccessTime />,
    serviceArea: <Place />,
    emergencyService: <Whatshot />,

    cameraType: <CameraAlt />,
    title: <MenuBook />,
    publicationYear: <CalendarMonth />,
    size: <Straighten />,
    electric: <BatteryChargingFull />,

    year: <CalendarMonth />,
    operatingHours: <AccessTime />,
    fuelType: <LocalGasStation />,
    fuel: <LocalGasStation />,
    power: <BatteryChargingFull />,
    powerWatts: <BatteryChargingFull />,
    weldingType: <Whatshot />,
    printTechnology: <Print />,
    mileage: <Speed />,
    engineCapacity: <DirectionsCar />,
    batteryCapacity: <BatteryChargingFull />,
    rangeKm: <DirectionsCar />,

    length: <Straighten />,
    heelHeight: <Straighten />,
    dimensions: <Straighten />,
    hoseLength: <Straighten />,

    processor: <Memory />,
    ram: <Memory />,
    storage: <Storage />,
    screenSize: <Smartphone />,
    resolution: <Smartphone />,

    area: <Home />,
    rooms: <Bed />,
    bathrooms: <Bathtub />,

    breed: <Pets />,
    artist: <Brush />,
    creationYear: <CalendarMonth />,
    platform: <SportsEsports />,
    releaseYear: <CalendarMonth />,
    waterResistant: <Watch />,
    expiryDate: <CalendarMonth />,
};

const isValidValue = (value: unknown): boolean => {
    if (value === undefined || value === null) return false;

    if (typeof value === 'string' && !value.trim()) return false;

    if (Array.isArray(value) && value.length === 0) return false;

    return true;
};

const formatNumber = (value: unknown, locale: string): string => {
    const number = Number(value);

    if (!Number.isFinite(number)) return String(value);

    return new Intl.NumberFormat(locale).format(number);
};

const translateOrFallback = (
    t: TFunction,
    key: string,
    fallback: string,
): string => {
    const result = t(key, { defaultValue: '' });

    return result && result !== key ? result : fallback;
};

/**
 * Resolves labels from the correct translation namespace.
 */
const getSpecificationLabel = (
    category: string,
    key: string,
    t: TFunction,
    fallback: string,
): string => {
    if (category.toLowerCase() === 'services') {
        const serviceLabelKeys: Record<string, string> = {
            serviceTitle: 'categories.services.serviceName',
            serviceName: 'categories.services.serviceName',
            providerName: 'categories.services.providerName',
            experienceYears: 'categories.services.experienceYears',
            priceRange: 'categories.services.priceRange',
            priceFrom: 'categories.services.priceFrom',
            priceTo: 'categories.services.priceTo',
            pricingType: 'categories.services.pricingType',
            availableDays: 'categories.services.availableDays',
            availableHours: 'categories.services.availableHours',
            serviceArea: 'categories.services.serviceArea',
            emergencyService: 'categories.services.emergencyService',
            category: 'categories.services.category',
            subcategory: 'categories.services.subcategory',
        };

        const translationKey = serviceLabelKeys[key];

        if (translationKey) {
            return translateOrFallback(t, translationKey, fallback);
        }
    }

    return translateOrFallback(
        t,
        `product.${key}`,
        fallback,
    );
};

/**
 * Translates category option values.
 */
const translateOption = (
    value: unknown,
    fieldKey: string,
    category: string,
    t: TFunction,
): ReactNode => {
    if (!isValidValue(value)) return '';

    if (typeof value === 'boolean') {
        return value
            ? t('common.yes', { defaultValue: 'نعم' })
            : t('common.no', { defaultValue: 'لا' });
    }

    if (Array.isArray(value)) {
        return value
            .map((item) => translateOption(item, fieldKey, category, t))
            .join(' • ');
    }

    if (typeof value !== 'string') return String(value);

    const normalizedValue = value.trim();

    if (!category) return normalizedValue;

    const optionKey =
        `categories.${category}.fields.${fieldKey}Options.${normalizedValue}`;

    return translateOrFallback(t, optionKey, normalizedValue);
};

/**
 * Translates service availability days.
 */
const formatDays = (days: unknown, t: TFunction): string => {
    if (!Array.isArray(days)) return String(days);

    return days
        .map((day: unknown) => {
            const normalizedDay = String(day).trim().toLowerCase();

            return translateOrFallback(
                t,
                `categories.services.days.${normalizedDay}`,
                normalizedDay,
            );
        })
        .join(' • ');
};

/**
 * Translates service pricing types.
 * Keeps camelCase values such as perProject intact.
 */
const formatPricingType = (value: unknown, t: TFunction): string => {
    const normalizedValue = String(value).trim();

    const exactKey =
        `categories.services.pricingTypes.${normalizedValue}`;

    const translated = t(exactKey, { defaultValue: '' });

    if (translated && translated !== exactKey) {
        return translated;
    }

    // Supports databases that store enum values in lowercase.
    const lowerCaseKey =
        `categories.services.pricingTypes.${normalizedValue.toLowerCase()}`;

    return translateOrFallback(t, lowerCaseKey, normalizedValue);
};

/**
 * Formats Arabic experience years.
 */
const formatExperience = (
    value: unknown,
    locale: string,
    t: TFunction,
): string => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return String(value);
    }

    const formattedNumber = formatNumber(number, locale);

    if (locale.startsWith('ar')) {
        if (number === 1) return 'سنة واحدة';
        if (number === 2) return 'سنتان';

        if (number >= 3 && number <= 10) {
            return `${formattedNumber} سنوات`;
        }

        return `${formattedNumber} سنة`;
    }

    const unit =
        number === 1
            ? t('categories.services.year', { defaultValue: 'year' })
            : t('categories.services.years', { defaultValue: 'years' });

    return `${formattedNumber} ${unit}`;
};

export default function PostSpecifications({
    product,
    categoryLabel,
    t,
}: PostSpecificationsProps) {
    const specifications: Specification[] = [];

    const language = String(
        (t as any).i18n?.resolvedLanguage ??
            (t as any).i18n?.language ??
            'ar',
    );

    const locale = language.startsWith('he')
        ? 'he-IL'
        : language.startsWith('en')
          ? 'en-US'
          : 'ar';

    const category = String(product.category ?? '').trim();

    const isServicesCategory =
        category.toLowerCase() === 'services';

    const add = (
        key: string,
        fallback: string,
        value: unknown,
        options?: {
            icon?: IconType;
            unit?: string;
            translateValue?: boolean;
            boolean?: boolean;
            days?: boolean;
            pricing?: boolean;
            number?: boolean;
            experience?: boolean;
        },
    ) => {
        if (!isValidValue(value)) return;

        let displayValue: ReactNode;

        if (options?.experience) {
            displayValue = formatExperience(value, locale, t);
        } else if (options?.boolean || typeof value === 'boolean') {
            if (isServicesCategory && key === 'emergencyService') {
                displayValue = value
                    ? translateOrFallback(
                          t,
                          'categories.services.emergencyServiceYes',
                          'نعم',
                      )
                    : translateOrFallback(
                          t,
                          'categories.services.emergencyServiceNo',
                          'لا',
                      );
            } else {
                displayValue = value
                    ? t('common.yes', { defaultValue: 'نعم' })
                    : t('common.no', { defaultValue: 'لا' });
            }
        } else if (options?.days) {
            displayValue = formatDays(value, t);
        } else if (options?.pricing) {
            displayValue = formatPricingType(value, t);
        } else if (options?.number) {
            displayValue = formatNumber(value, locale);
        } else if (options?.translateValue) {
            displayValue = translateOption(value, key, category, t);
        } else if (Array.isArray(value)) {
            displayValue = value.join(' • ');
        } else {
            displayValue = String(value);
        }

        if (options?.unit) {
            displayValue = `${displayValue} ${options.unit}`;
        }

        specifications.push({
            key,
            label: getSpecificationLabel(
                category,
                key,
                t,
                fallback,
            ),
            value: displayValue,
            icon: options?.icon ?? ICONS[key],
        });
    };

    // GENERAL
    if (categoryLabel || category) {
        const translatedCategory = isServicesCategory
            ? translateOrFallback(
                  t,
                  'categories.services.title',
                  categoryLabel || category,
              )
            : translateOrFallback(
                  t,
                  `categories.${category}.label`,
                  translateOrFallback(
                      t,
                      `categories.${category}.title`,
                      categoryLabel || category,
                  ),
              );

        specifications.push({
            key: 'category',
            label: isServicesCategory
                ? translateOrFallback(
                      t,
                      'categories.services.category',
                      'الفئة',
                  )
                : t('categories.title', {
                      defaultValue: 'الفئة',
                  }),
            value: translatedCategory,
            icon: ICONS.category,
        });
    }

    // SUBCATEGORY
    if (isValidValue(product.subcategory)) {
        const subcategory = String(product.subcategory).trim();

        const translatedSubcategory = isServicesCategory
            ? translateOrFallback(
                  t,
                  `categories.services.subCategories.${subcategory}`,
                  translateOrFallback(
                      t,
                      `categories.services.subcategories.${subcategory}`,
                      translateOrFallback(
                          t,
                          `categories.${category}.subCategories.${subcategory}`,
                          subcategory,
                      ),
                  ),
              )
            : translateOrFallback(
                  t,
                  `categories.${category}.subCategories.${subcategory}`,
                  subcategory,
              );

        specifications.push({
            key: 'subcategory',
            label: isServicesCategory
                ? translateOrFallback(
                      t,
                      'categories.services.subcategory',
                      'الفئة الفرعية',
                  )
                : t('product.subcategory', {
                      defaultValue: 'الفئة الفرعية',
                  }),
            value: translatedSubcategory,
            icon: ICONS.subcategory,
        });
    }

    // GENERAL PRODUCT FIELDS
    add('brand', 'العلامة التجارية', product.brand);
    add('model', 'الموديل', product.model);
    add('color', 'اللون', product.color, {
        translateValue: true,
    });
    add('material', 'الخامة', product.material, {
        translateValue: true,
    });

    // SERVICES
    if (isServicesCategory) {
        add(
            'serviceTitle',
            'اسم الخدمة',
            product.serviceTitle ?? product.serviceName,
        );

        add('providerName', 'اسم مقدم الخدمة', product.providerName);

        add(
            'experienceYears',
            'سنوات الخبرة',
            product.experienceYears,
            { experience: true },
        );

        if (
            isValidValue(product.priceFrom) ||
            isValidValue(product.priceTo)
        ) {
            const from = isValidValue(product.priceFrom)
                ? `${formatNumber(product.priceFrom, locale)}₪`
                : '';

            const to = isValidValue(product.priceTo)
                ? `${formatNumber(product.priceTo, locale)}₪`
                : '';

            specifications.push({
                key: 'priceRange',
                label: getSpecificationLabel(
                    category,
                    'priceRange',
                    t,
                    'نطاق السعر',
                ),
                value: from && to ? `${from} - ${to}` : from || to,
                icon: ICONS.priceRange,
            });
        }

        add(
            'pricingType',
            'نوع التسعير',
            product.pricingType,
            { pricing: true },
        );

        add(
            'availableDays',
            'أيام التوفر',
            product.availableDays,
            { days: true },
        );

        add(
            'availableHours',
            'ساعات التوفر',
            product.availableHours,
        );

        add(
            'serviceArea',
            'منطقة تقديم الخدمة',
            product.serviceArea,
        );

        add(
            'emergencyService',
            'خدمة طوارئ',
            product.emergencyService,
            { boolean: true },
        );
    }

    // CAMERAS
    add('cameraType', 'نوع الكاميرا', product.cameraType, {
        translateValue: true,
    });
    add('sensorType', 'نوع المستشعر', product.sensorType, {
        translateValue: true,
    });
    add('megapixels', 'الميجابكسل', product.megapixels, {
        unit: 'MP',
        number: true,
    });
    add('videoResolution', 'دقة الفيديو', product.videoResolution, {
        translateValue: true,
    });
    add('lensMount', 'حامل العدسة', product.lensMount, {
        translateValue: true,
    });
    add('focalLength', 'البعد البؤري', product.focalLength);

    // BOOKS
    add('title', 'العنوان', product.title);
    add('author', 'المؤلف', product.author);
    add('publisher', 'الناشر', product.publisher);
    add('publicationYear', 'سنة النشر', product.publicationYear, {
        number: true,
    });
    add('language', 'اللغة', product.language, {
        translateValue: true,
    });
    add('isbn', 'ISBN', product.isbn);

    // MUSICAL INSTRUMENTS
    add('size', 'الحجم', product.size);
    add('electric', 'كهربائي', product.electric, {
        boolean: true,
    });

    // EQUIPMENT
    add('year', 'سنة الصنع', product.year, {
        number: true,
    });
    add('operatingHours', 'ساعات التشغيل', product.operatingHours, {
        unit: t('product.hours', { defaultValue: 'ساعة' }),
        number: true,
    });
    add('enginePower', 'قوة المحرك', product.enginePower, {
        unit: 'HP',
        number: true,
    });
    add('fuelType', 'نوع الوقود', product.fuelType, {
        translateValue: true,
    });
    add('weight', 'الوزن', product.weight, {
        unit: t('product.kg', { defaultValue: 'كجم' }),
        number: true,
    });
    add('power', 'القدرة', product.power, {
        unit: 'W',
        number: true,
    });
    add('voltage', 'الجهد', product.voltage, {
        unit: 'V',
        number: true,
    });
    add('capacity', 'السعة', product.capacity);
    add('weldingType', 'نوع اللحام', product.weldingType, {
        translateValue: true,
    });
    add('amperage', 'الأمبير', product.amperage, {
        unit: 'A',
        number: true,
    });
    add('connectivity', 'الاتصال', product.connectivity, {
        translateValue: true,
    });
    add('printTechnology', 'تقنية الطباعة', product.printTechnology, {
        translateValue: true,
    });
    add('colorPrinting', 'طباعة ملونة', product.colorPrinting, {
        boolean: true,
    });
    add('warranty', 'الضمان', product.warranty);
    add(
        'includedAccessories',
        'الملحقات المضمنة',
        product.includedAccessories,
        { translateValue: true },
    );

    // VEHICLES
    add('fuel', 'نوع الوقود', product.fuel, {
        translateValue: true,
    });
    add('mileage', 'الممشى', product.mileage, {
        unit: 'كم',
        number: true,
    });
    add('engineCapacity', 'سعة المحرك', product.engineCapacity, {
        unit: 'CC',
        number: true,
    });
    add('batteryCapacity', 'سعة البطارية', product.batteryCapacity);
    add('rangeKm', 'مدى القيادة', product.rangeKm, {
        unit: 'كم',
        number: true,
    });

    // CLOTHES / BAGS
    add('length', 'الطول', product.length);
    add('heelHeight', 'ارتفاع الكعب', product.heelHeight, {
        unit: 'سم',
    });

    // HOUSE / GARDEN
    add('dimensions', 'الأبعاد', product.dimensions);
    add('powerWatts', 'القدرة الكهربائية', product.powerWatts, {
        unit: 'W',
        number: true,
    });
    add('hoseLength', 'طول الخرطوم', product.hoseLength);
    add('automatic', 'تلقائي', product.automatic, {
        boolean: true,
    });
    add(
        'weatherResistant',
        'مقاوم للعوامل الجوية',
        product.weatherResistant,
        { boolean: true },
    );

    // ELECTRONICS
    add('processor', 'المعالج', product.processor);
    add('ram', 'الذاكرة RAM', product.ram, {
        unit: 'GB',
    });
    add('storage', 'التخزين', product.storage, {
        unit: 'GB',
    });
    add('screenSize', 'حجم الشاشة', product.screenSize, {
        unit: '"',
    });
    add('resolution', 'دقة الشاشة', product.resolution);
    add('operatingSystem', 'نظام التشغيل', product.operatingSystem, {
        translateValue: true,
    });
    add('condition', 'الحالة', product.condition, {
        translateValue: true,
    });
    add('networkType', 'نوع الشبكة', product.networkType, {
        translateValue: true,
    });

    // REAL ESTATE
    add('area', 'المساحة', product.area, {
        unit: 'م²',
        number: true,
    });
    add('rooms', 'عدد الغرف', product.rooms, {
        number: true,
    });
    add('bathrooms', 'عدد الحمامات', product.bathrooms, {
        number: true,
    });
    add('floors', 'عدد الطوابق', product.floors, {
        number: true,
    });
    add('hasParking', 'موقف سيارات', product.hasParking, {
        boolean: true,
    });
    add('hasElevator', 'مصعد', product.hasElevator, {
        boolean: true,
    });
    add('furnished', 'مفروشة', product.furnished, {
        boolean: true,
    });
    add('rentalType', 'نوع المعاملة', product.rentalType, {
        translateValue: true,
    });
    add('propertyAge', 'عمر العقار', product.propertyAge, {
        unit: t('product.years', { defaultValue: 'سنوات' }),
        number: true,
    });

    // PETS
    add('breed', 'السلالة', product.breed);
    add('age', 'العمر', product.age, {
        unit: t('product.months', { defaultValue: 'شهر' }),
        number: true,
    });
    add('gender', 'الجنس', product.gender, {
        translateValue: true,
    });
    add('vaccinated', 'مطعّم', product.vaccinated, {
        boolean: true,
    });
    add('neutered', 'مُعقّم', product.neutered, {
        boolean: true,
    });
    add('microchipped', 'مزود بشريحة', product.microchipped, {
        boolean: true,
    });
    add('temperament', 'الطبع', product.temperament, {
        translateValue: true,
    });

    // ART
    add('artist', 'الفنان', product.artist);
    add('creationYear', 'سنة الإنشاء', product.creationYear, {
        number: true,
    });
    add('technique', 'التقنية', product.technique, {
        translateValue: true,
    });
    add('certificate', 'شهادة الأصالة', product.certificate, {
        boolean: true,
    });
    add('framed', 'مؤطرة', product.framed, {
        boolean: true,
    });

    // GAMING
    add('platform', 'المنصة', product.platform, {
        translateValue: true,
    });
    add('genre', 'النوع', product.genre, {
        translateValue: true,
    });
    add('edition', 'الإصدار', product.edition, {
        translateValue: true,
    });
    add('multiplayer', 'متعدد اللاعبين', product.multiplayer, {
        boolean: true,
    });
    add('releaseYear', 'سنة الإصدار', product.releaseYear, {
        number: true,
    });

    // OTHER
    add('waterResistant', 'مقاوم للماء', product.waterResistant, {
        boolean: true,
    });
    add('safeMaterial', 'مواد آمنة', product.safeMaterial, {
        boolean: true,
    });
    add('expiryDate', 'تاريخ انتهاء الصلاحية', product.expiryDate);
    add('volume', 'الحجم', product.volume);
    add('assemblyRequired', 'يحتاج إلى تركيب', product.assemblyRequired, {
        boolean: true,
    });
    add('style', 'الطراز', product.style, {
        translateValue: true,
    });
    add('includesAccessories', 'يشمل ملحقات', product.includesAccessories, {
        boolean: true,
    });

    if (specifications.length === 0) return null;

    return (
        <Card
            sx={{
                p: { xs: 2.25, md: 3 },
                borderRadius: 3,
            }}
        >
            <Stack spacing={2.5}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {t('product.specifications', {
                            defaultValue: 'مواصفات المنتج',
                        })}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        {t('product.specificationsSubtitle', {
                            defaultValue: 'تفاصيل ومواصفات المنتج',
                        })}
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
                                    minWidth: 0,
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
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ fontWeight: 600 }}
                                    >
                                        {specification.label}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: '0.9rem',
                                            wordBreak: 'break-word',
                                            overflowWrap: 'anywhere',
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
