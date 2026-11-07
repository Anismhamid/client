import {
    Alert,
    Autocomplete,
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    Switch,
    TextField,
    TextFieldProps,
    Theme,
    Typography,
    alpha,
} from '@mui/material';
import { FormikHandlers, FormikHelpers, FormikProps } from 'formik';
import {
    ChangeEvent,
    FocusEvent,
    FormEvent,
    Fragment,
    FunctionComponent,
    ReactNode,
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { colors } from '../../colorsSettings/carsColors';
import { Posts } from '../../../interfaces/Posts';
import { deleteImage, uploadImage } from '../../../services/uploadImage';

import {
    categoriesLogic,
    CategoryValue,
} from '../../../interfaces/postLogicMap';
import { postsCategory } from '../../../interfaces/postsCategoeis';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CollectionsIcon from '@mui/icons-material/Collections';
import {
    ShoppingBag,
    LocalOffer,
    Inventory2,
    Percent,
    Payments,
    CheckRounded,
} from '@mui/icons-material';
import { compressImage, MAX_UPLOAD_BYTES } from './Compressimage';
import { BRAND } from '../../../components/navbar/theme/brand';

interface PostFormProps {
    formik: FormikProps<Posts>;
    imageFile: File | null;
    setImageFile: (file: File | null) => void;
    imageData: { url: string; publicId: string } | null;
    setImageData: (data: { url: string; publicId: string } | null) => void;
    onHide: () => void;
    mode?: 'add' | 'update';
    /** نشر بالخطوات (3 خطوات). بيتفعّل بوضع الإضافة بس. */
    wizard?: boolean;
}

export interface DynamicField {
    name: string;
    type: 'text' | 'number' | 'select' | 'boolean' | 'date' | 'color' | 'array';
    required?: boolean;
    options?: string[];
    min?: number;
    step?: number;
}

const LAST_STEP = 2;

// ─── ثوابت على مستوى الملف ──────────────────────────────────────────────────
// كل شي هون reference ثابت، عشان React.memo على الحقول يشتغل فعلياً
// (أي object/array جديد بكل render بيكسر الـ memo).
const EMPTY_ARRAY: string[] = [];

const WEEK_DAYS = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
];

const CATEGORY_OPTIONS = postsCategory.filter((cat) =>
    Object.keys(categoriesLogic).includes(cat.id),
);

const DESCRIPTION_INPUT_PROPS = { maxLength: 500 };
const PRICE_INPUT_PROPS = { min: 0, step: 0.01 };
const DISCOUNT_INPUT_PROPS = { min: 0, max: 100 };
const SHRINK_LABEL_PROPS = { shrink: true };

const PRICE_INPUT_ADORNMENT = {
    startAdornment: (
        <InputAdornment position='start'>
            <Typography
                component='span'
                dir='ltr'
                sx={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    fontFamily: 'Arial, sans-serif',
                    color: 'text.secondary',
                }}
            >
                ₪
            </Typography>
        </InputAdornment>
    ),
};

const DISCOUNT_INPUT_ADORNMENT = {
    endAdornment: (
        <InputAdornment position='end'>
            <Percent sx={{ fontSize: 16, color: 'text.secondary' }} />
        </InputAdornment>
    ),
};

const cancelButtonSx = {
    flex: 1,
    py: 1.25,
    borderRadius: '12px',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '0.9375rem',
    borderColor: 'divider',
    color: 'text.secondary',
    '&:hover': {
        borderColor: 'error.main',
        color: 'error.main',
        bgcolor: (th: Theme) => alpha(th.palette.error.main, 0.04),
    },
} as const;

const backButtonSx = {
    ...cancelButtonSx,
    '&:hover': {
        borderColor: BRAND.brown,
        color: BRAND.brown,
        bgcolor: BRAND.ledger(0.05),
    },
} as const;

const primaryButtonSx = {
    flex: 2,
    py: 1.25,
    borderRadius: '12px',
    fontWeight: 700,
    textTransform: 'none',
    fontSize: '0.9375rem',
    background: BRAND.gradient,
    color: '#fff',
    '&:hover': {
        background: BRAND.gradient,
        filter: 'brightness(1.08)',
    },
} as const;

const imageButtonSx = {
    borderRadius: '10px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.8125rem',
    borderColor: (th: Theme) => alpha(th.palette.primary.main, 0.4),
    flex: 1,
    py: 1,
} as const;

const wizardActionsSx = {
    mt: 1,
    py: 1.5,
    position: 'sticky',
    bottom: 0,
    zIndex: 2,
    bgcolor: 'background.paper',
    borderTop: '1px dashed',
    borderColor: 'divider',
} as const;

// error جاهز كنص: بيظهر بس إذا الحقل touched وفيه خطأ نصي
const getError = (touched: unknown, error: unknown): string | undefined =>
    touched && typeof error === 'string' ? error : undefined;

// ─── Section wrapper ────────────────────────────────────────────────────────
const Section = ({
    icon,
    label,
    children,
}: {
    icon: ReactNode;
    label: string;
    children: ReactNode;
}) => (
    <Box sx={{ mb: 3.5 }}>
        <Stack direction='row' alignItems='center' gap={1} sx={{ mb: 2 }}>
            <Box
                sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '10px',
                    bgcolor: (th: Theme) => alpha(th.palette.primary.main, 0.1),
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {icon}
            </Box>
            <Typography
                variant='subtitle2'
                fontWeight={700}
                color='text.primary'
                sx={{ fontSize: '0.875rem', letterSpacing: 0.3 }}
            >
                {label}
            </Typography>
        </Stack>
        <Stack gap={2}>{children}</Stack>
    </Box>
);

// ─── Divider ────────────────────────────────────────────────────────────────
const SectionDivider = () => (
    <Box
        sx={{
            height: '1px',
            bgcolor: 'divider',
            mb: 3.5,
            opacity: 0.6,
        }}
    />
);

// ─── Wizard progress ────────────────────────────────────────────────────────
const WizardProgress = memo(function WizardProgress({
    step,
    labels,
}: {
    step: number;
    labels: string[];
}) {
    return (
        <Stack direction='row' alignItems='flex-start' sx={{ mb: 3.5 }}>
            {labels.map((label, i) => {
                const done = i < step;
                const active = i === step;
                const reached = done || active;

                return (
                    <Fragment key={label}>
                        <Stack
                            alignItems='center'
                            gap={0.5}
                            sx={{ minWidth: 64 }}
                        >
                            <Box
                                sx={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    fontSize: '0.8rem',
                                    color: reached ? '#fff' : 'text.secondary',
                                    background: reached
                                        ? BRAND.gradient
                                        : 'transparent',
                                    border: reached ? 'none' : '1.5px dashed',
                                    borderColor: 'divider',
                                    boxShadow: active
                                        ? `0 0 0 4px ${BRAND.ledger(0.15)}`
                                        : 'none',
                                    transition: 'all 0.25s ease',
                                }}
                            >
                                {done ? (
                                    <CheckRounded sx={{ fontSize: 18 }} />
                                ) : (
                                    i + 1
                                )}
                            </Box>
                            <Typography
                                variant='caption'
                                sx={{
                                    fontWeight: active ? 700 : 500,
                                    color: active
                                        ? 'text.primary'
                                        : 'text.secondary',
                                    textAlign: 'center',
                                    lineHeight: 1.3,
                                }}
                            >
                                {label}
                            </Typography>
                        </Stack>
                        {i < labels.length - 1 && (
                            <Box
                                sx={{
                                    flex: 1,
                                    mt: '15px',
                                    mx: 0.5,
                                    borderTop: '2px dashed',
                                    borderColor: done ? BRAND.brown : 'divider',
                                    opacity: done ? 0.6 : 1,
                                    transition: 'all 0.25s ease',
                                }}
                            />
                        )}
                    </Fragment>
                );
            })}
        </Stack>
    );
});

// ─── Memoized text field ────────────────────────────────────────────────────
// الفكرة: كل ضغطة حرف بتغيّر formik.values → PostForm كله بيعمل re-render،
// لكن الحقول اللي props تبعها ما تغيّرت (value/error/handlers) بتتخطى الـ render.
interface FormTextFieldProps {
    name: string;
    label: string;
    value: string | number;
    error?: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    multiline?: boolean;
    rows?: number;
    inputProps?: TextFieldProps['inputProps'];
    InputProps?: TextFieldProps['InputProps'];
    InputLabelProps?: TextFieldProps['InputLabelProps'];
}

const FormTextField = memo(function FormTextField({
    error,
    ...props
}: FormTextFieldProps) {
    return (
        <TextField
            fullWidth
            size='small'
            error={Boolean(error)}
            helperText={error}
            {...props}
        />
    );
});

// ─── Dynamic field (حسب الفئة/الفئة الفرعية) ────────────────────────────────
interface DynamicFieldInputProps {
    field: DynamicField;
    category: CategoryValue;
    value: unknown;
    error?: string;
    setFieldValue: FormikHelpers<Posts>['setFieldValue'];
    handleChange: FormikHandlers['handleChange'];
    handleBlur: FormikHandlers['handleBlur'];
}

const DynamicFieldInput = memo(function DynamicFieldInput({
    field,
    category,
    value: rawValue,
    error,
    setFieldValue,
    handleChange,
    handleBlur,
}: DynamicFieldInputProps) {
    const { t } = useTranslation();

    const numberInputProps = useMemo(
        () => ({ min: field.min ?? 0, step: field.step ?? 1 }),
        [field.min, field.step],
    );

    let fieldValue: string | number = '';
    if (typeof rawValue === 'string' || typeof rawValue === 'number') {
        fieldValue = rawValue;
    } else if (typeof rawValue === 'boolean') {
        fieldValue = rawValue ? 'true' : 'false';
    }

    const isRequired = field.required;
    const baseLabel = t(`categories.${category}.fields.${field.name}`, {
        defaultValue: field.name,
    });
    const fieldLabel = isRequired ? `${baseLabel} *` : baseLabel;

    switch (field.type) {
        case 'text':
            return (
                <FormTextField
                    name={field.name}
                    label={fieldLabel}
                    value={fieldValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={error}
                    required={isRequired}
                    placeholder={
                        t(`categories.${category}.fields.${field.name}`, {
                            defaultValue: field.name,
                        }) as string
                    }
                />
            );

        case 'number':
            return (
                <FormTextField
                    type='number'
                    name={field.name}
                    label={fieldLabel}
                    value={fieldValue}
                    onChange={(e) => {
                        const value = e.target.value;
                        setFieldValue(
                            field.name,
                            value === '' ? '' : Number(value),
                        );
                    }}
                    onBlur={handleBlur}
                    error={error}
                    required={isRequired}
                    inputProps={numberInputProps}
                />
            );

        case 'select':
            return (
                <FormControl
                    fullWidth
                    size='small'
                    error={Boolean(error)}
                    required={isRequired}
                >
                    <InputLabel>{fieldLabel}</InputLabel>
                    <Select
                        name={field.name}
                        value={fieldValue}
                        label={fieldLabel}
                        onChange={(e) =>
                            setFieldValue(field.name, e.target.value)
                        }
                        onBlur={handleBlur}
                    >
                        <MenuItem value=''>
                            {t(`categories.${category}.fields.${field.name}`, {
                                defaultValue: `Select ${field.name}`,
                            })}
                        </MenuItem>
                        {field.options?.map((option) => (
                            <MenuItem key={option} value={option}>
                                {t(
                                    `categories.${category}.fields.${field.name}Options.${option}`,
                                    { defaultValue: option },
                                )}
                            </MenuItem>
                        ))}
                    </Select>
                    {error && <FormHelperText>{error}</FormHelperText>}
                </FormControl>
            );

        case 'color':
            // ملاحظة: الـ Select أصلاً بيعرض المربع الملوّن + الاسم جوّا الحقل،
            // فشلت المعاينة اللي كانت تحته (كانت بتكرّر اللون مرتين).
            return (
                <FormControl
                    fullWidth
                    size='small'
                    error={Boolean(error)}
                    required={isRequired}
                >
                    <InputLabel>{fieldLabel}</InputLabel>
                    <Select
                        name={field.name}
                        value={fieldValue}
                        label={fieldLabel}
                        onChange={(e) =>
                            setFieldValue(field.name, e.target.value)
                        }
                        onBlur={handleBlur}
                    >
                        <MenuItem value=''>
                            {t(`categories.${category}.fields.${field.name}`, {
                                defaultValue: 'Select color',
                            })}
                        </MenuItem>

                        {colors.map((color) => (
                            <MenuItem key={color.key} value={color.key}>
                                <Stack
                                    direction='row'
                                    alignItems='center'
                                    gap={1}
                                >
                                    <Box
                                        sx={{
                                            width: 18,
                                            height: 18,
                                            borderRadius: '5px',
                                            bgcolor: color.hex,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            flexShrink: 0,
                                        }}
                                    />
                                    <Typography variant='body2'>
                                        {t(`colors.${color.key}`, {
                                            defaultValue: color.key,
                                        })}
                                    </Typography>
                                </Stack>
                            </MenuItem>
                        ))}
                    </Select>
                    {error && <FormHelperText>{error}</FormHelperText>}
                </FormControl>
            );

        case 'array': {
            const arrayValue = Array.isArray(rawValue)
                ? (rawValue as string[])
                : EMPTY_ARRAY;

            const options = field.options?.length
                ? field.options
                : field.name === 'availableDays'
                  ? WEEK_DAYS
                  : undefined;

            // حقل array بدون options (accessories, includedAccessories...):
            // قبل كان Select فاضي. هلأ المستخدم بيكتب القيمة وبيضغط Enter.
            if (!options) {
                return (
                    <Autocomplete
                        multiple
                        freeSolo
                        size='small'
                        options={EMPTY_ARRAY}
                        value={arrayValue}
                        onChange={(_, newValue) =>
                            setFieldValue(
                                field.name,
                                newValue
                                    .map((v) => String(v).trim())
                                    .filter(Boolean),
                            )
                        }
                        onBlur={handleBlur}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                name={field.name}
                                label={fieldLabel}
                                required={isRequired}
                                error={Boolean(error)}
                                helperText={
                                    error ??
                                    t(
                                        'wizard.arrayHint',
                                        'اكتب القيمة واضغط Enter للإضافة',
                                    )
                                }
                            />
                        )}
                    />
                );
            }

            return (
                <FormControl
                    fullWidth
                    size='small'
                    error={Boolean(error)}
                    required={isRequired}
                >
                    <InputLabel>{fieldLabel}</InputLabel>
                    <Select
                        multiple
                        name={field.name}
                        value={arrayValue}
                        label={fieldLabel}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFieldValue(
                                field.name,
                                typeof value === 'string'
                                    ? value.split(',')
                                    : value,
                            );
                        }}
                        onBlur={handleBlur}
                        renderValue={(selected) => (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 0.5,
                                }}
                            >
                                {(selected as string[]).map((value) => (
                                    <Chip
                                        key={value}
                                        label={t(
                                            `categories.${category}.fields.${field.name}Options.${value}`,
                                            { defaultValue: value },
                                        )}
                                        size='small'
                                    />
                                ))}
                            </Box>
                        )}
                    >
                        {options.map((option) => (
                            <MenuItem key={option} value={option}>
                                {t(
                                    `categories.${category}.fields.${field.name}Options.${option}`,
                                    { defaultValue: option },
                                )}
                            </MenuItem>
                        ))}
                    </Select>
                    {error && <FormHelperText>{error}</FormHelperText>}
                </FormControl>
            );
        }

        case 'boolean':
            return (
                <FormControlLabel
                    control={
                        <Switch
                            name={field.name}
                            checked={fieldValue === 'true'}
                            onChange={(e) =>
                                setFieldValue(field.name, e.target.checked)
                            }
                            onBlur={handleBlur}
                            size='small'
                        />
                    }
                    label={<Typography variant='body2'>{fieldLabel}</Typography>}
                />
            );

        case 'date':
            return (
                <FormTextField
                    type='date'
                    name={field.name}
                    label={fieldLabel}
                    value={fieldValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={error}
                    InputLabelProps={SHRINK_LABEL_PROPS}
                />
            );

        default:
            return null;
    }
});

// ─── Category / Subcategory ─────────────────────────────────────────────────
const CategoryField = memo(function CategoryField({
    value,
    error,
    onChange,
    onBlur,
}: {
    value: string;
    error?: string;
    onChange: (e: SelectChangeEvent<string>) => void;
    onBlur: FormikHandlers['handleBlur'];
}) {
    const { t } = useTranslation();
    const label = t('modals.addProductModal.category');

    return (
        <FormControl fullWidth size='small' error={Boolean(error)} required>
            <InputLabel>{label}</InputLabel>
            <Select
                name='category'
                value={value}
                label={label}
                onChange={onChange}
                onBlur={onBlur}
            >
                <MenuItem value=''>
                    {t('modals.addProductModal.selectCategory')}
                </MenuItem>
                {CATEGORY_OPTIONS.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                        {t(`categories.${category.id}.label`)}
                    </MenuItem>
                ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    );
});

const SubcategoryField = memo(function SubcategoryField({
    category,
    value,
    subcategories,
    onChange,
    onBlur,
}: {
    category: string;
    value: string;
    subcategories: string[];
    onChange: (e: SelectChangeEvent<string>) => void;
    onBlur: FormikHandlers['handleBlur'];
}) {
    const { t } = useTranslation();
    const label = t('modals.addProductModal.subcategory');

    return (
        <FormControl fullWidth size='small'>
            <InputLabel>{label}</InputLabel>
            <Select
                name='subcategory'
                value={value}
                label={label}
                onChange={onChange}
                onBlur={onBlur}
            >
                <MenuItem value=''>
                    {t('modals.addProductModal.selectSubcategory')}
                </MenuItem>
                {subcategories.map((subcat) => (
                    <MenuItem key={subcat} value={subcat}>
                        {t(`categories.${category}.subCategories.${subcat}`, {
                            defaultValue: subcat,
                        })}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
});

// ─── Image section ──────────────────────────────────────────────────────────
const ImageSection = memo(function ImageSection({
    imageUrl,
    uploading,
    uploadError,
    imageErrorText,
    showTip,
    onChange,
}: {
    imageUrl: string;
    uploading: boolean;
    uploadError: string;
    imageErrorText: string;
    showTip: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
    const { t } = useTranslation();

    return (
        <Section
            icon={<Typography sx={{ fontSize: 14, lineHeight: 1 }}>🖼️</Typography>}
            label={t('modals.addProductModal.image')}
        >
            <Stack direction='row' gap={1.5} flexWrap='wrap'>
                <Button
                    variant='outlined'
                    component='label'
                    disabled={uploading}
                    startIcon={<PhotoCameraIcon sx={{ fontSize: 16 }} />}
                    size='small'
                    sx={imageButtonSx}
                >
                    {t('modals.addProductModal.openCamera')}
                    <input
                        type='file'
                        accept='image/*'
                        capture='environment'
                        onChange={onChange}
                        hidden
                    />
                </Button>

                <Button
                    variant='outlined'
                    component='label'
                    disabled={uploading}
                    startIcon={<CollectionsIcon sx={{ fontSize: 16 }} />}
                    size='small'
                    sx={imageButtonSx}
                >
                    {t('modals.addProductModal.chooseFromGallery')}
                    <input
                        type='file'
                        accept='image/*'
                        onChange={onChange}
                        hidden
                    />
                </Button>
            </Stack>

            {uploadError && (
                <Alert severity='error' sx={{ borderRadius: '10px' }}>
                    {uploadError}
                </Alert>
            )}

            {!uploadError && imageErrorText && !imageUrl && (
                <FormHelperText error>{imageErrorText}</FormHelperText>
            )}

            {(imageUrl || uploading) && (
                <Box
                    sx={{
                        position: 'relative',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        border: '2px solid',
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover',
                        minHeight: 180,
                    }}
                >
                    {imageUrl && (
                        <Avatar
                            src={imageUrl}
                            variant='rounded'
                            sx={{
                                width: '100%',
                                height: 180,
                                borderRadius: 0,
                                opacity: uploading ? 0.4 : 1,
                                '& img': { objectFit: 'cover' },
                            }}
                        />
                    )}
                    {uploading && (
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                gap: 1,
                            }}
                        >
                            <CircularProgress
                                size={28}
                                sx={{ color: BRAND.gold }}
                            />
                            <Typography variant='caption' fontWeight={600}>
                                {t('wizard.uploading', 'عم نرفع الصورة...')}
                            </Typography>
                        </Box>
                    )}
                    {!uploading && imageUrl && (
                        <Chip
                            label='✓ تم رفع الصورة'
                            size='small'
                            color='success'
                            sx={{
                                position: 'absolute',
                                bottom: 8,
                                insetInlineStart: 8,
                                fontWeight: 600,
                                fontSize: '0.75rem',
                            }}
                        />
                    )}
                </Box>
            )}

            {showTip && !imageUrl && !uploading && (
                <Typography variant='caption' color='text.secondary'>
                    {t(
                        'wizard.imageTip',
                        'صورة واضحة بإضاءة جيدة بتفرق كتير بجذب المشترين.',
                    )}
                </Typography>
            )}
        </Section>
    );
});

// ─── Sales section ──────────────────────────────────────────────────────────
const SalesSection = memo(function SalesSection({
    inStock,
    sale,
    discount,
    setFieldValue,
    handleChange,
    handleBlur,
}: {
    inStock: boolean;
    sale: boolean;
    discount: number;
    setFieldValue: FormikHelpers<Posts>['setFieldValue'];
    handleChange: FormikHandlers['handleChange'];
    handleBlur: FormikHandlers['handleBlur'];
}) {
    const { t } = useTranslation();

    return (
        <Section
            icon={<LocalOffer sx={{ fontSize: 16 }} />}
            label={t('modals.addProductModal.sale')}
        >
            <Box
                sx={{
                    p: 2,
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: (th: Theme) =>
                        alpha(th.palette.background.paper, 0.6),
                }}
            >
                <Stack gap={1.5}>
                    {/* In stock */}
                    <Stack
                        direction='row'
                        alignItems='center'
                        justifyContent='space-between'
                    >
                        <Box>
                            <Typography variant='body2' fontWeight={600}>
                                {inStock
                                    ? t('modals.addProductModal.in_stock')
                                    : t('modals.addProductModal.not_in_stock')}
                            </Typography>
                            <Typography variant='caption' color='text.secondary'>
                                {inStock
                                    ? 'المنتج متوفر للبيع'
                                    : 'المنتج غير متوفر حالياً'}
                            </Typography>
                        </Box>
                        <Switch
                            checked={inStock}
                            onChange={(e) =>
                                setFieldValue('in_stock', e.target.checked)
                            }
                            size='small'
                            color={inStock ? 'success' : 'default'}
                        />
                    </Stack>

                    <Box sx={{ height: '1px', bgcolor: 'divider', opacity: 0.5 }} />

                    {/* Sale */}
                    <Stack
                        direction='row'
                        alignItems='center'
                        justifyContent='space-between'
                    >
                        <Box>
                            <Typography variant='body2' fontWeight={600}>
                                {t('modals.addProductModal.sale')}
                            </Typography>
                            <Typography variant='caption' color='text.secondary'>
                                تفعيل خصم على المنتج
                            </Typography>
                        </Box>
                        <Switch
                            name='sale'
                            checked={sale}
                            onChange={handleChange}
                            size='small'
                            color='warning'
                        />
                    </Stack>

                    {/* Discount */}
                    {sale && (
                        <Box sx={{ mt: 0.5 }}>
                            <FormTextField
                                type='number'
                                name='discount'
                                label={t('modals.addProductModal.discount')}
                                value={discount || 0}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                inputProps={DISCOUNT_INPUT_PROPS}
                                InputProps={DISCOUNT_INPUT_ADORNMENT}
                            />
                        </Box>
                    )}
                </Stack>
            </Box>
        </Section>
    );
});

// ═══════════════════════════════════════════════════════════════════════════
const PostForm: FunctionComponent<PostFormProps> = ({
    formik,
    setImageData,
    setImageFile,
    onHide,
    imageData,
    mode,
    wizard = false,
}) => {
    const { t } = useTranslation();
    const formRef = useRef<HTMLFormElement>(null);
    // هدول stable بـ Formik 2.x (useEventCallback) — أساس الـ memo تحت
    const { setFieldValue, handleChange, handleBlur } = formik;

    const [step, setStep] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const selectedSubcategory = formik.values.subcategory;
    const selectedCategory = formik.values.category as CategoryValue;

    const isService = selectedCategory === 'Services';
    const showGeneralPrice = !isService;

    const previousImageId = imageData?.publicId;

    const handleImageChange = useCallback(
        async (e: ChangeEvent<HTMLInputElement>) => {
            const input = e.target;
            const original = input.files?.[0];
            // خلّي اختيار نفس الملف مرة ثانية يشتغل
            input.value = '';
            if (!original) return;

            if (!original.type.startsWith('image/')) {
                setUploadError(t('wizard.notImage', 'الملف لازم يكون صورة'));
                return;
            }
            if (original.size > MAX_UPLOAD_BYTES) {
                setUploadError(
                    t('wizard.imageTooLarge', 'حجم الصورة كبير (الحد 15MB)'),
                );
                return;
            }

            setUploadError('');
            setUploading(true);

            try {
                const file = await compressImage(original);
                setImageFile(file);

                // ارفع الجديدة أول، وبعدين احذف القديمة — عشان ما نخسر الصورة لو فشل الرفع
                const { url, publicId } = await uploadImage(file);
                const newImageData = { url, publicId };

                setImageData(newImageData);
                setFieldValue('image', newImageData);

                if (previousImageId) {
                    deleteImage(previousImageId).catch((err) =>
                        console.error('Failed to delete old image:', err),
                    );
                }
            } catch (error) {
                console.error(error);
                setUploadError(
                    t('wizard.uploadFailed', 'فشل رفع الصورة، جرّب مرة ثانية'),
                );
            } finally {
                setUploading(false);
            }
        },
        [previousImageId, setFieldValue, setImageData, setImageFile, t],
    );

    useEffect(() => {
        if (!formik.values.category) return;
        const category = formik.values.category as keyof typeof categoriesLogic;
        const subcategories = Object.keys(categoriesLogic[category] || []);
        if (mode === 'add' && !formik.values.subcategory) {
            const firstSubcat = subcategories[0] || '';
            setFieldValue('subcategory', firstSubcat);
            setFieldValue('type', firstSubcat);
        }
    }, [
        formik.values.category,
        formik.values.subcategory,
        mode,
        setFieldValue,
    ]);

    const availableSubcategories = useMemo((): string[] => {
        const category = formik.values.category as CategoryValue;
        if (!category) return [];
        return Object.keys(categoriesLogic[category] || {});
    }, [formik.values.category]);

    // أول setFieldValue بدون validation، والأخير بس بيعمل validation — بدل 3-4 مرات
    const handleCategoryChange = useCallback(
        (e: SelectChangeEvent<string>) => {
            const newCategory = e.target.value as CategoryValue;
            const firstSubcat =
                Object.keys(categoriesLogic[newCategory] || {})[0] || '';
            setFieldValue('category', newCategory, false);
            setFieldValue('subcategory', firstSubcat, false);
            setFieldValue('type', firstSubcat);
        },
        [setFieldValue],
    );

    const handleSubcategoryChange = useCallback(
        (e: SelectChangeEvent<string>) => {
            const newSubcat = e.target.value;
            const category = selectedCategory;
            const oldSubcat = selectedSubcategory;

            if (oldSubcat && categoriesLogic[category]?.[oldSubcat]) {
                categoriesLogic[category][oldSubcat].forEach((field) => {
                    let defaultValue: unknown = '';
                    if (field.type === 'boolean') defaultValue = false;
                    if (field.type === 'array') defaultValue = [];
                    setFieldValue(field.name, defaultValue, false);
                });
            }
            setFieldValue('subcategory', newSubcat, false);
            setFieldValue('type', newSubcat);
        },
        [selectedCategory, selectedSubcategory, setFieldValue],
    );

    const handlePriceChange = useCallback(
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value = e.target.value;
            setFieldValue('price', value === '' ? '' : Number(value));
        },
        [setFieldValue],
    );

    const dynamicFields = useMemo((): DynamicField[] => {
        const category = formik.values.category as CategoryValue;
        if (!category) return [];
        const subcat = formik.values
            .subcategory as keyof (typeof categoriesLogic)[CategoryValue];
        if (!subcat) return [];
        return categoriesLogic[category]?.[subcat] || [];
    }, [formik.values.category, formik.values.subcategory]);

    // ─── Wizard logic ───────────────────────────────────────────────────────
    const stepFields = useMemo<string[][]>(
        () => [
            ['product_name', 'image'],
            ['category', 'subcategory', ...dynamicFields.map((f) => f.name)],
            ['price', 'description', 'discount'],
        ],
        [dynamicFields],
    );

    const touchStep = (target: number) => {
        const touched = Object.fromEntries(
            stepFields[target].map((key) => [key, true]),
        );
        formik.setTouched({ ...formik.touched, ...touched } as never, false);
    };

    const stepHasErrors = (target: number, errors: Record<string, unknown>) =>
        stepFields[target].some((key) => Boolean(errors[key]));

    const scrollFormToTop = () =>
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const handleNext = async () => {
        const errors = (await formik.validateForm()) as Record<string, unknown>;
        touchStep(step);
        if (stepHasErrors(step, errors)) return;
        setStep((s) => Math.min(s + 1, LAST_STEP));
        scrollFormToTop();
    };

    const handleBack = () => {
        setStep((s) => Math.max(s - 1, 0));
        scrollFormToTop();
    };

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!wizard) {
            formik.handleSubmit(e);
            return;
        }

        // Enter داخل حقل نصي بخطوة غير أخيرة = "التالي" مو إرسال
        if (step < LAST_STEP) {
            await handleNext();
            return;
        }

        // بالخطوة الأخيرة: لو في خطأ بخطوة سابقة، رجّع المستخدم لأول خطوة فيها خطأ
        const errors = (await formik.validateForm()) as Record<string, unknown>;
        const badStep = [0, 1, 2].find((s) => stepHasErrors(s, errors));
        if (badStep !== undefined) {
            touchStep(badStep);
            if (badStep !== step) {
                setStep(badStep);
                scrollFormToTop();
            }
            return;
        }

        formik.handleSubmit(e);
    };

    // ─── Fields / sections ──────────────────────────────────────────────────
    const nameField = (
        <FormTextField
            name='product_name'
            label={`${t('modals.addProductModal.productName')} *`}
            value={formik.values.product_name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getError(
                formik.touched.product_name,
                formik.errors.product_name,
            )}
            placeholder={
                t('modals.addProductModal.productNamePlaceholder') as string
            }
        />
    );

    const priceField = showGeneralPrice ? (
        <FormTextField
            type='number'
            name='price'
            label={t('modals.addProductModal.price')}
            value={formik.values.price ?? ''}
            onChange={handlePriceChange}
            onBlur={handleBlur}
            error={getError(formik.touched.price, formik.errors.price)}
            inputProps={PRICE_INPUT_PROPS}
            InputProps={PRICE_INPUT_ADORNMENT}
        />
    ) : null;

    const basicSection = (
        <Section
            icon={<ShoppingBag sx={{ fontSize: 16 }} />}
            label={t('modals.addProductModal.productName')}
        >
            {nameField}
            {!wizard && priceField}
        </Section>
    );

    const priceSection = priceField ? (
        <>
            <Section
                icon={<Payments sx={{ fontSize: 16 }} />}
                label={t('modals.addProductModal.price')}
            >
                {priceField}
            </Section>
            <SectionDivider />
        </>
    ) : null;

    const categorySection = (
        <Section
            icon={<Inventory2 sx={{ fontSize: 16 }} />}
            label={t('modals.addProductModal.category')}
        >
            <CategoryField
                value={formik.values.category}
                error={getError(formik.touched.category, formik.errors.category)}
                onChange={handleCategoryChange}
                onBlur={handleBlur}
            />

            {formik.values.category && availableSubcategories.length > 0 && (
                <SubcategoryField
                    category={formik.values.category}
                    value={selectedSubcategory as string}
                    subcategories={availableSubcategories}
                    onChange={handleSubcategoryChange}
                    onBlur={handleBlur}
                />
            )}

            {/* Dynamic Fields */}
            {formik.values.category && dynamicFields.length > 0 && (
                <Box
                    sx={{
                        p: 2,
                        borderRadius: '12px',
                        bgcolor: (th: Theme) =>
                            alpha(th.palette.primary.main, 0.04),
                        border: '1px solid',
                        borderColor: (th: Theme) =>
                            alpha(th.palette.primary.main, 0.12),
                    }}
                >
                    <Typography
                        variant='caption'
                        fontWeight={600}
                        color='primary.main'
                        sx={{ mb: 1.5, display: 'block' }}
                    >
                        {t('modals.addProductModal.specifications')}
                    </Typography>
                    <Stack gap={2}>
                        {dynamicFields.map((field) => {
                            const key = field.name as keyof Posts;
                            return (
                                <Box key={field.name}>
                                    <DynamicFieldInput
                                        field={field}
                                        category={selectedCategory}
                                        value={formik.values[key]}
                                        error={getError(
                                            formik.touched[key],
                                            formik.errors[key],
                                        )}
                                        setFieldValue={setFieldValue}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                    />
                                </Box>
                            );
                        })}
                    </Stack>
                </Box>
            )}
        </Section>
    );

    const descriptionValue = formik.values.description || '';

    const descriptionSection = (
        <Section
            icon={<Typography sx={{ fontSize: 14, lineHeight: 1 }}>✏️</Typography>}
            label={t('modals.addProductModal.description')}
        >
            <FormTextField
                multiline
                rows={3}
                name='description'
                label={t('modals.addProductModal.description')}
                value={descriptionValue}
                onChange={handleChange}
                onBlur={handleBlur}
                error={getError(
                    formik.touched.description,
                    formik.errors.description,
                )}
                placeholder={
                    t('modals.addProductModal.descriptionPlaceholder') as string
                }
                inputProps={DESCRIPTION_INPUT_PROPS}
            />
            <Typography
                variant='caption'
                color='text.disabled'
                sx={{ textAlign: 'end', display: 'block', mt: -1 }}
            >
                {descriptionValue.length} / 500
            </Typography>
        </Section>
    );

    const imageErrorText =
        formik.touched.image && formik.errors.image
            ? typeof formik.errors.image === 'string'
                ? formik.errors.image
                : t('wizard.imageRequired', 'أضف صورة للمنتج')
            : '';

    const imageSection = (
        <ImageSection
            imageUrl={formik.values.image?.url || ''}
            uploading={uploading}
            uploadError={uploadError}
            imageErrorText={imageErrorText}
            showTip={wizard}
            onChange={handleImageChange}
        />
    );

    const salesSection = (
        <SalesSection
            inStock={Boolean(formik.values.in_stock)}
            sale={Boolean(formik.values.sale)}
            discount={Number(formik.values.discount) || 0}
            setFieldValue={setFieldValue}
            handleChange={handleChange}
            handleBlur={handleBlur}
        />
    );

    const wizardLabels = useMemo(
        () => [
            t('wizard.step1', 'الصورة والاسم'),
            t('wizard.step2', 'التصنيف'),
            t('wizard.step3', 'السعر والوصف'),
        ],
        [t],
    );

    return (
        <Box
            ref={formRef}
            component='form'
            autoComplete='off'
            noValidate
            onSubmit={handleFormSubmit}
        >
            {wizard ? (
                <>
                    <WizardProgress step={step} labels={wizardLabels} />

                    {step === 0 && (
                        <>
                            {imageSection}
                            <SectionDivider />
                            {basicSection}
                        </>
                    )}

                    {step === 1 && categorySection}

                    {step === 2 && (
                        <>
                            {priceSection}
                            {descriptionSection}
                            <SectionDivider />
                            {salesSection}
                        </>
                    )}

                    {/* Wizard actions — لاصقة تحت عشان تضل ظاهرة عالموبايل */}
                    <Stack direction='row' gap={1.5} sx={wizardActionsSx}>
                        {step === 0 ? (
                            <Button
                                key='cancel'
                                variant='outlined'
                                onClick={onHide}
                                disabled={formik.isSubmitting}
                                sx={cancelButtonSx}
                            >
                                {t('modals.addProductModal.cancel')}
                            </Button>
                        ) : (
                            <Button
                                key='back'
                                variant='outlined'
                                onClick={handleBack}
                                disabled={formik.isSubmitting}
                                sx={backButtonSx}
                            >
                                {t('wizard.back', 'رجوع')}
                            </Button>
                        )}

                        {/* key مختلف: بدونه React بيحوّل نفس الزر من button لـ submit وبيرسل الفورم بنفس الضغطة */}
                        {step < LAST_STEP ? (
                            <Button
                                key='next'
                                type='button'
                                variant='contained'
                                onClick={handleNext}
                                disabled={uploading}
                                disableElevation
                                sx={primaryButtonSx}
                            >
                                {t('wizard.next', 'التالي')}
                            </Button>
                        ) : (
                            <Button
                                key='submit'
                                type='submit'
                                variant='contained'
                                loading={formik.isSubmitting}
                                disabled={uploading}
                                disableElevation
                                sx={primaryButtonSx}
                            >
                                {t('modals.addProductModal.addProduct')}
                            </Button>
                        )}
                    </Stack>
                </>
            ) : (
                <>
                    {basicSection}
                    <SectionDivider />
                    {categorySection}
                    <SectionDivider />
                    {descriptionSection}
                    <SectionDivider />
                    {imageSection}
                    <SectionDivider />
                    {salesSection}

                    <Stack direction='row' gap={1.5} sx={{ mt: 1 }}>
                        <Button
                            variant='outlined'
                            onClick={onHide}
                            disabled={formik.isSubmitting}
                            sx={cancelButtonSx}
                        >
                            {t('modals.addProductModal.cancel')}
                        </Button>

                        <Button
                            variant='contained'
                            type='submit'
                            loading={formik.isSubmitting}
                            disabled={uploading}
                            disableElevation
                            sx={primaryButtonSx}
                        >
                            {mode === 'add'
                                ? t('modals.addProductModal.addProduct')
                                : t('modals.updateProductModal.updateButton')}
                        </Button>
                    </Stack>
                </>
            )}
        </Box>
    );
};

export default PostForm;