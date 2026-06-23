import {
    Avatar,
    Box,
    Button,
    Chip,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Switch,
    TextField,
    Typography,
    alpha,
    useTheme,
} from '@mui/material';
import { FormikProps } from 'formik';
import { FunctionComponent, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CarColor, colors } from '../../colorsSettings/carsColors';
import { Posts } from '../../../interfaces/Posts';
import { deleteImage, uploadImage } from '../../../services/uploadImage';
import {
    categoriesLogic,
    CategoryValue,
} from '../../../interfaces/postLogicMap';
import { postsCategory } from '../../../interfaces/postsCategoeis';
import { LoadingButton } from '@mui/lab';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CollectionsIcon from '@mui/icons-material/Collections';
import {
    ShoppingBag,
    LocalOffer,
    Inventory2,
    Percent,
} from '@mui/icons-material';

interface PostFormProps {
    formik: FormikProps<Posts>;
    imageFile: File | null;
    setImageFile: (file: File | null) => void;
    imageData: { url: string; publicId: string } | null;
    setImageData: (data: { url: string; publicId: string } | null) => void;
    onHide: () => void;
    mode?: 'add' | 'update';
}

export interface DynamicField {
    name: string;
    type: 'text' | 'number' | 'select' | 'boolean' | 'date' | 'color';
    required?: boolean;
    options?: string[];
    min?: number;
    step?: number;
}

// ─── Section wrapper ────────────────────────────────────────────────────────
const Section = ({
    icon,
    label,
    children,
}: {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
}) => {
    const theme = useTheme();
    return (
        <Box sx={{ mb: 3.5 }}>
            <Stack direction='row' alignItems='center' gap={1} sx={{ mb: 2 }}>
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '10px',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
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
};

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

const PostForm: FunctionComponent<PostFormProps> = ({
    formik,
    setImageData,
    setImageFile,
    onHide,
    imageData,
    mode,
}) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const selectedSubcategory = formik.values.subcategory;

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];
        setImageFile(file);

        if (mode === 'update' && imageData?.publicId) {
            try {
                await deleteImage(imageData.publicId);
                setImageData(null);
            } catch (err) {
                console.error('Failed to delete old image:', err);
            }
        }

        try {
            const { url, publicId } = await uploadImage(file);
            const newImageData = { url, publicId };
            setImageData(newImageData);
            formik.setFieldValue('image', newImageData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!formik.values.category) return;
        const category = formik.values.category as keyof typeof categoriesLogic;
        const subcategories = Object.keys(categoriesLogic[category] || []);
        if (mode === 'add' && !formik.values.subcategory) {
            const firstSubcat = subcategories[0] || '';
            formik.setFieldValue('subcategory', firstSubcat);
            formik.setFieldValue('type', firstSubcat);
        }
    }, [formik.values.category, formik, mode]);

    const availableSubcategories = useMemo((): string[] => {
        const category = formik.values.category as CategoryValue;
        if (!category) return [];
        return Object.keys(categoriesLogic[category]);
    }, [formik.values.category]);

    const getFieldLabel = useCallback(
        (name: string, required?: boolean) => {
            const label = t(`fields.labels.${name}`, { defaultValue: name });
            return required ? `${label} *` : label;
        },
        [t],
    );

    const handleCategoryChange = (e: { target: { value: string } }) => {
        const newCategory = e.target.value as CategoryValue;
        formik.setFieldValue('category', newCategory);
        const firstSubcat = Object.keys(categoriesLogic[newCategory])[0] || '';
        formik.setFieldValue('subcategory', firstSubcat);
        formik.setFieldValue('type', firstSubcat);
    };

    const handleSubcategoryChange = (e: { target: { value: string } }) => {
        const newSubcat = e.target.value;
        const category = formik.values.category as CategoryValue;
        const oldSubcat = formik.values.subcategory;
        if (oldSubcat && categoriesLogic[category][oldSubcat]) {
            categoriesLogic[category][oldSubcat].forEach((field) => {
                formik.setFieldValue(field.name, undefined);
            });
        }
        formik.setFieldValue('subcategory', newSubcat);
        formik.setFieldValue('type', newSubcat);
    };

    const dynamicFields = useMemo((): DynamicField[] => {
        const category = formik.values.category as CategoryValue;
        if (!category) return [];
        const subcat = formik.values
            .subcategory as keyof (typeof categoriesLogic)[CategoryValue];
        if (!subcat) return [];
        return categoriesLogic[category][subcat] || [];
    }, [formik.values.category, formik.values.subcategory]);

    const renderDynamicField = (field: DynamicField) => {
        const fieldName = field.name as keyof Posts;
        const rawValue = formik.values[fieldName];
        let fieldValue: string | number = '';

        if (typeof rawValue === 'string' || typeof rawValue === 'number') {
            fieldValue = rawValue;
        } else if (typeof rawValue === 'boolean') {
            fieldValue = rawValue ? 'true' : 'false';
        }

        const isRequired = field.required;
        const error = formik.touched[fieldName] && formik.errors[fieldName];
        const fieldLabel = getFieldLabel(field.name, isRequired);

        switch (field.type) {
            case 'text':
                return (
                    <TextField
                        fullWidth
                        size='small'
                        name={field.name}
                        label={fieldLabel}
                        value={fieldValue}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(error)}
                        helperText={error as string}
                        required={isRequired}
                        placeholder={
                            t(`fields.placeholder.${field.name}`, {
                                defaultValue: field.name,
                            }) as string
                        }
                    />
                );

            case 'number':
                return (
                    <TextField
                        fullWidth
                        size='small'
                        type='number'
                        name={field.name}
                        label={fieldLabel}
                        value={fieldValue}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(error)}
                        helperText={error as string}
                        required={isRequired}
                        inputProps={{
                            min: field.min || 0,
                            step: field.step || 1,
                        }}
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
                                formik.setFieldValue(field.name, e.target.value)
                            }
                            onBlur={formik.handleBlur}
                        >
                            <MenuItem value=''>
                                {t(`fields.select.${field.name}`, {
                                    defaultValue: `اختر ${field.name}`,
                                })}
                            </MenuItem>
                            {field.options?.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {t(`options.${option}`, {
                                        defaultValue: option,
                                    })}
                                </MenuItem>
                            ))}
                        </Select>
                        {error && (
                            <FormHelperText>{error as string}</FormHelperText>
                        )}
                    </FormControl>
                );

            case 'color':
                return (
                    <Stack gap={1}>
                        <FormControl fullWidth size='small'>
                            <InputLabel>
                                {t('modals.addProductModal.color')}
                            </InputLabel>
                            <Select
                                name='color'
                                value={formik.values.color || ''}
                                label={t('modals.addProductModal.color')}
                                onChange={(e) =>
                                    formik.setFieldValue(
                                        'color',
                                        e.target.value,
                                    )
                                }
                                onBlur={formik.handleBlur}
                            >
                                <MenuItem value=''>
                                    {t('modals.addProductModal.selectColor')}
                                </MenuItem>
                                {colors.map((color: CarColor) => (
                                    <MenuItem key={color.hex} value={color.hex}>
                                        <Stack
                                            direction='row'
                                            alignItems='center'
                                            gap={1}
                                        >
                                            <Box
                                                sx={{
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: '4px',
                                                    bgcolor: color.hex,
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                }}
                                            />
                                            {color.key}
                                        </Stack>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {formik.values.color && (
                            <Stack direction='row' alignItems='center' gap={1}>
                                <Box
                                    sx={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: '6px',
                                        bgcolor: formik.values.color,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                />
                                <Typography
                                    variant='caption'
                                    color='text.secondary'
                                >
                                    {formik.values.color}
                                </Typography>
                            </Stack>
                        )}
                    </Stack>
                );

            case 'boolean':
                return (
                    <FormControlLabel
                        control={
                            <Switch
                                name={field.name}
                                checked={Boolean(fieldValue === 'true')}
                                onChange={(e) =>
                                    formik.setFieldValue(
                                        field.name,
                                        e.target.checked,
                                    )
                                }
                                onBlur={formik.handleBlur}
                                size='small'
                            />
                        }
                        label={
                            <Typography variant='body2'>
                                {fieldLabel}
                            </Typography>
                        }
                    />
                );

            case 'date':
                return (
                    <TextField
                        fullWidth
                        size='small'
                        type='date'
                        name={field.name}
                        label={fieldLabel}
                        value={fieldValue}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(error)}
                        helperText={error as string}
                        InputLabelProps={{ shrink: true }}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <Box
            component='form'
            autoComplete='off'
            noValidate
            onSubmit={formik.handleSubmit}
        >
            {/* ── Basic Info ── */}
            <Section
                icon={<ShoppingBag sx={{ fontSize: 16 }} />}
                label={t('modals.addProductModal.productName')}
            >
                <TextField
                    fullWidth
                    size='small'
                    name='product_name'
                    label={`${t('modals.addProductModal.productName')} *`}
                    value={formik.values.product_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                        Boolean(formik.touched.product_name) &&
                        Boolean(formik.errors.product_name)
                    }
                    helperText={
                        formik.touched.product_name &&
                        (formik.errors.product_name as string)
                    }
                    placeholder={
                        t(
                            'modals.addProductModal.productNamePlaceholder',
                        ) as string
                    }
                />

                {/* Price */}
                <TextField
                    fullWidth
                    size='small'
                    type='number'
                    name='price'
                    label={`${t('modals.addProductModal.price')} *`}
                    value={formik.values.price || ''}
                    onChange={(e) => {
                        const v = e.target.value;
                        formik.setFieldValue(
                            'price',
                            v === '' ? '' : Number(v),
                        );
                    }}
                    onBlur={formik.handleBlur}
                    error={
                        Boolean(formik.touched.price) &&
                        Boolean(formik.errors.price)
                    }
                    helperText={
                        formik.touched.price && (formik.errors.price as string)
                    }
                    inputProps={{ min: 0, step: 0.01 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <Typography
                                    sx={{
                                        fontSize: '1rem',
                                        color: 'text.secondary',
                                    }}
                                >
                                    ₪
                                </Typography>
                            </InputAdornment>
                        ),
                    }}
                />
            </Section>

            <SectionDivider />

            {/* ── Category ── */}
            <Section
                icon={<Inventory2 sx={{ fontSize: 16 }} />}
                label={t('modals.addProductModal.category')}
            >
                <FormControl
                    fullWidth
                    size='small'
                    error={
                        Boolean(formik.touched.category) &&
                        Boolean(formik.errors.category)
                    }
                    required
                >
                    <InputLabel>
                        {t('modals.addProductModal.category')}
                    </InputLabel>
                    <Select
                        name='category'
                        value={formik.values.category}
                        label={t('modals.addProductModal.category')}
                        onChange={handleCategoryChange}
                        onBlur={formik.handleBlur}
                    >
                        <MenuItem value=''>
                            {t('modals.addProductModal.selectCategory')}
                        </MenuItem>
                        {postsCategory
                            .filter((cat) =>
                                Object.keys(categoriesLogic).includes(cat.id),
                            )
                            .map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {t(`categories.${category.id}.label`)}
                                </MenuItem>
                            ))}
                    </Select>
                    {formik.touched.category && formik.errors.category && (
                        <FormHelperText>
                            {formik.errors.category as string}
                        </FormHelperText>
                    )}
                </FormControl>

                {formik.values.category &&
                    availableSubcategories.length > 0 && (
                        <FormControl fullWidth size='small'>
                            <InputLabel>
                                {t('modals.addProductModal.subcategory')}
                            </InputLabel>
                            <Select
                                name='subcategory'
                                value={selectedSubcategory}
                                label={t('modals.addProductModal.subcategory')}
                                onChange={handleSubcategoryChange}
                                onBlur={formik.handleBlur}
                            >
                                <MenuItem value=''>
                                    {t(
                                        'modals.addProductModal.selectSubcategory',
                                    )}
                                </MenuItem>
                                {availableSubcategories.map((subcat) => (
                                    <MenuItem key={subcat} value={subcat}>
                                        {t(
                                            `categories.${formik.values.category.toLowerCase()}.subCategories.${subcat}`,
                                            { defaultValue: subcat },
                                        )}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                {/* Dynamic Fields */}
                {formik.values.category && dynamicFields.length > 0 && (
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: '12px',
                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                            border: '1px solid',
                            borderColor: alpha(
                                theme.palette.primary.main,
                                0.12,
                            ),
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
                            {dynamicFields.map((field: DynamicField) => (
                                <Box key={field.name}>
                                    {renderDynamicField(field)}
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                )}
            </Section>

            <SectionDivider />

            {/* ── Description ── */}
            <Section
                icon={
                    <Typography sx={{ fontSize: 14, lineHeight: 1 }}>
                        ✏️
                    </Typography>
                }
                label={t('modals.addProductModal.description')}
            >
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    size='small'
                    name='description'
                    label={t('modals.addProductModal.description')}
                    value={formik.values.description || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                        Boolean(formik.touched.description) &&
                        Boolean(formik.errors.description)
                    }
                    helperText={
                        formik.touched.description &&
                        (formik.errors.description as string)
                    }
                    placeholder={
                        t(
                            'modals.addProductModal.descriptionPlaceholder',
                        ) as string
                    }
                    inputProps={{ maxLength: 500 }}
                />
                <Typography
                    variant='caption'
                    color='text.disabled'
                    sx={{ textAlign: 'left', display: 'block', mt: -1 }}
                >
                    {(formik.values.description || '').length} / 500
                </Typography>
            </Section>

            <SectionDivider />

            {/* ── Image ── */}
            <Section
                icon={
                    <Typography sx={{ fontSize: 14, lineHeight: 1 }}>
                        🖼️
                    </Typography>
                }
                label={t('modals.addProductModal.image')}
            >
                <Stack direction='row' gap={1.5} flexWrap='wrap'>
                    <Button
                        variant='outlined'
                        component='label'
                        startIcon={<PhotoCameraIcon sx={{ fontSize: 16 }} />}
                        size='small'
                        sx={{
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                            borderColor: alpha(theme.palette.primary.main, 0.4),
                            flex: 1,
                            py: 1,
                        }}
                    >
                        {t('modals.addProductModal.openCamera')}
                        <input
                            type='file'
                            accept='image/*'
                            capture='environment'
                            onChange={handleImageChange}
                            hidden
                        />
                    </Button>

                    <Button
                        variant='outlined'
                        component='label'
                        startIcon={<CollectionsIcon sx={{ fontSize: 16 }} />}
                        size='small'
                        sx={{
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                            borderColor: alpha(theme.palette.primary.main, 0.4),
                            flex: 1,
                            py: 1,
                        }}
                    >
                        {t('modals.addProductModal.chooseFromGallery')}
                        <input
                            type='file'
                            accept='image/*'
                            onChange={handleImageChange}
                            hidden
                        />
                    </Button>
                </Stack>

                {formik.values.image?.url && (
                    <Box
                        sx={{
                            position: 'relative',
                            borderRadius: '14px',
                            overflow: 'hidden',
                            border: '2px solid',
                            borderColor: 'primary.main',
                            bgcolor: 'action.hover',
                        }}
                    >
                        <Avatar
                            src={formik.values.image.url}
                            variant='rounded'
                            sx={{
                                width: '100%',
                                height: 180,
                                borderRadius: 0,
                                '& img': { objectFit: 'cover' },
                            }}
                        />
                        <Chip
                            label='✓ تم رفع الصورة'
                            size='small'
                            color='success'
                            sx={{
                                position: 'absolute',
                                bottom: 8,
                                left: 8,
                                fontWeight: 600,
                                fontSize: '0.75rem',
                            }}
                        />
                    </Box>
                )}
            </Section>

            <SectionDivider />

            {/* ── Toggles ── */}
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
                        bgcolor: alpha(theme.palette.background.paper, 0.6),
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
                                    {formik.values.in_stock
                                        ? t('modals.addProductModal.in_stock')
                                        : t(
                                              'modals.addProductModal.not_in_stock',
                                          )}
                                </Typography>
                                <Typography
                                    variant='caption'
                                    color='text.secondary'
                                >
                                    {formik.values.in_stock
                                        ? 'المنتج متوفر للبيع'
                                        : 'المنتج غير متوفر حالياً'}
                                </Typography>
                            </Box>
                            <Switch
                                checked={formik.values.in_stock}
                                onChange={(e) =>
                                    formik.setFieldValue(
                                        'in_stock',
                                        e.target.checked,
                                    )
                                }
                                size='small'
                                color={
                                    formik.values.in_stock
                                        ? 'success'
                                        : 'default'
                                }
                            />
                        </Stack>

                        <Box
                            sx={{
                                height: '1px',
                                bgcolor: 'divider',
                                opacity: 0.5,
                            }}
                        />

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
                                <Typography
                                    variant='caption'
                                    color='text.secondary'
                                >
                                    تفعيل خصم على المنتج
                                </Typography>
                            </Box>
                            <Switch
                                name='sale'
                                checked={formik.values.sale}
                                onChange={formik.handleChange}
                                size='small'
                                color='warning'
                            />
                        </Stack>

                        {/* Discount */}
                        {formik.values.sale && (
                            <TextField
                                fullWidth
                                size='small'
                                type='number'
                                name='discount'
                                label={t('modals.addProductModal.discount')}
                                value={formik.values.discount || 0}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                inputProps={{ min: 0, max: 100 }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <Percent
                                                sx={{
                                                    fontSize: 16,
                                                    color: 'text.secondary',
                                                }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ mt: 0.5 }}
                            />
                        )}
                    </Stack>
                </Box>
            </Section>

            {/* ── Actions ── */}
            <Stack direction='row' gap={1.5} sx={{ mt: 1 }}>
                <Button
                    variant='outlined'
                    onClick={onHide}
                    disabled={formik.isSubmitting}
                    sx={{
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
                            bgcolor: alpha(theme.palette.error.main, 0.04),
                        },
                    }}
                >
                    {t('modals.addProductModal.cancel')}
                </Button>

                <LoadingButton
                    variant='contained'
                    type='submit'
                    loading={formik.isSubmitting}
                    disableElevation
                    sx={{
                        flex: 2,
                        py: 1.25,
                        borderRadius: '12px',
                        fontWeight: 700,
                        textTransform: 'none',
                        fontSize: '0.9375rem',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                        '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                        },
                    }}
                >
                    {mode === 'add'
                        ? t('modals.addProductModal.addProduct')
                        : t('modals.updateProductModal.updateButton')}
                </LoadingButton>
            </Stack>
        </Box>
    );
};

export default PostForm;
