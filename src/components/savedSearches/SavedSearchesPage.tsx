import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@mui/material';

import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SavedSearchOutlinedIcon from '@mui/icons-material/SavedSearchOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/Refresh';

import {
    createSavedSearch,
    deleteSavedSearch,
    getSavedSearches,
    updateSavedSearch,
    type SavedSearch,
    type SavedSearchInput,
} from '../../services/savedSearchService';
// عدّل المسار لاسم ملف خدمة المدن عندك

import { categoriesLogic, type CategoryValue } from '../../interfaces/postLogicMap';
import { postsCategory } from '../../interfaces/postsCategoeis';
import { getCities } from '../../services/cities';

interface Notice {
    message: string;
    severity: 'success' | 'error' | 'info';
}

const initialForm: SavedSearchInput = {
    name: '',
    keyword: '',
    category: '',
    subCategory: '',
    minPrice: undefined,
    maxPrice: undefined,
    location: '',
    notificationsEnabled: true,
};

const getErrorMessage = (error: unknown): string => {
    const apiError = error as {
        response?: {
            data?: {
                message?: string;
            };
        };
        message?: string;
    };

    return (
        apiError.response?.data?.message ||
        apiError.message ||
        'حدث خطأ غير متوقع. حاول مرة أخرى.'
    );
};

const formatPrice = (value?: number) =>
    value == null ? '' : `${value.toLocaleString('en-US')} ₪`;

const SavedSearchesPage = () => {
    const { t } = useTranslation();

    const [searches, setSearches] = useState<SavedSearch[]>([]);
    const [form, setForm] = useState<SavedSearchInput>(initialForm);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    const [cities, setCities] = useState<string[]>([]);
    const [citiesLoading, setCitiesLoading] = useState(true);

    const [notice, setNotice] = useState<Notice | null>(null);
    const [noticeOpen, setNoticeOpen] = useState(false);

    const categoryIds = useMemo(
        () =>
            postsCategory
                .filter((cat) => Object.keys(categoriesLogic).includes(cat.id))
                .map((cat) => cat.id as CategoryValue),
        [],
    );

    const subCategoryIds = useMemo(
        () =>
            form.category
                ? Object.keys(categoriesLogic[form.category as CategoryValue] ?? {})
                : [],
        [form.category],
    );

    const categoryLabel = useCallback(
        (id: string) => t(`categories.${id}.label`, { defaultValue: id }),
        [t],
    );

    const subCategoryLabel = useCallback(
        (category: string, sub: string) =>
            t(`categories.${category}.subCategories.${sub}`, { defaultValue: sub }),
        [t],
    );

    const handleCategoryChange = (category: string) => {
        setForm((current) => ({
            ...current,
            category,
            subCategory: '',
        }));
    };

    const showNotice = useCallback((next: Notice) => {
        setNotice(next);
        setNoticeOpen(true);
    }, []);

    const loadSearches = useCallback(
        async (silent = false) => {
            if (!silent) setLoading(true);

            try {
                const data = await getSavedSearches();
                setSearches(data);
            } catch (error) {
                showNotice({
                    message: getErrorMessage(error),
                    severity: 'error',
                });
            } finally {
                if (!silent) setLoading(false);
            }
        },
        [showNotice],
    );

    useEffect(() => {
        void loadSearches();
    }, [loadSearches]);

    useEffect(() => {
        let active = true;

        getCities()
            .then((data) => {
                if (active) setCities(data);
            })
            .finally(() => {
                if (active) setCitiesLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const name = form.name?.trim();
        const keyword = form.keyword?.trim();
        const category = form.category?.trim();
        const subCategory = form.subCategory?.trim();
        const location = form.location?.trim();

        if (!name) {
            showNotice({
                message: 'يرجى إدخال اسم للبحث.',
                severity: 'error',
            });
            return;
        }

        if (
            !keyword &&
            !category &&
            !subCategory &&
            !location &&
            form.minPrice == null &&
            form.maxPrice == null
        ) {
            showNotice({
                message: 'أضف معيار بحث واحد على الأقل (كلمة، فئة، سعر أو موقع).',
                severity: 'error',
            });
            return;
        }

        if (
            form.minPrice != null &&
            form.maxPrice != null &&
            form.minPrice > form.maxPrice
        ) {
            showNotice({
                message: 'السعر الأدنى يجب ألا يتجاوز السعر الأعلى.',
                severity: 'error',
            });
            return;
        }

        const payload: SavedSearchInput = {
            name,
            notificationsEnabled: form.notificationsEnabled ?? true,
        };

        if (keyword) payload.keyword = keyword;
        if (category) payload.category = category;
        if (subCategory) payload.subCategory = subCategory;
        if (location) payload.location = location;
        if (form.minPrice != null) payload.minPrice = form.minPrice;
        if (form.maxPrice != null) payload.maxPrice = form.maxPrice;

        setSaving(true);

        try {
            await createSavedSearch(payload);

            setForm(initialForm);
            setShowForm(false);

            await loadSearches(true);

            showNotice({
                message: 'تم حفظ البحث بنجاح! ستصلك الإشعارات عند تطابق إعلان جديد.',
                severity: 'success',
            });
        } catch (error) {
            showNotice({
                message: getErrorMessage(error),
                severity: 'error',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleToggleNotifications = async (search: SavedSearch) => {
        setBusyId(search._id);

        const enabled = !(search.notificationsEnabled ?? true);

        try {
            await updateSavedSearch(search._id, {
                notificationsEnabled: enabled,
            });

            setSearches((current) =>
                current.map((item) =>
                    item._id === search._id
                        ? { ...item, notificationsEnabled: enabled }
                        : item,
                ),
            );

            showNotice({
                message: enabled
                    ? 'تم تفعيل إشعارات هذا البحث.'
                    : 'تم إيقاف إشعارات هذا البحث.',
                severity: 'success',
            });
        } catch (error) {
            showNotice({
                message: getErrorMessage(error),
                severity: 'error',
            });
        } finally {
            setBusyId(null);
        }
    };

    const handleDelete = async (search: SavedSearch) => {
        const confirmed = window.confirm(
            `هل تريد حذف البحث "${search.name}"؟`,
        );

        if (!confirmed) return;

        setBusyId(search._id);

        try {
            await deleteSavedSearch(search._id);

            setSearches((current) =>
                current.filter((item) => item._id !== search._id),
            );

            showNotice({
                message: 'تم حذف البحث المحفوظ.',
                severity: 'success',
            });
        } catch (error) {
            showNotice({
                message: getErrorMessage(error),
                severity: 'error',
            });
        } finally {
            setBusyId(null);
        }
    };

    const updateField = <K extends keyof SavedSearchInput>(
        key: K,
        value: SavedSearchInput[K],
    ) => {
        setForm((current) => ({
            ...current,
            [key]: value,
        }));
    };

    return (
        <Container maxWidth="md" sx={{ py: { xs: 2, md: 5 }, direction: 'rtl' }}>
            <Stack spacing={3}>
                <Box>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        sx={{ mb: 1 }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 52,
                                height: 52,
                                borderRadius: 3,
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                            }}
                        >
                            <SavedSearchOutlinedIcon fontSize="large" />
                        </Box>

                        <Box>
                            <Typography variant="h4" fontWeight={800}>
                                صفقتي الذكية
                            </Typography>

                            <Typography color="text.secondary">
                                احفظ ما تبحث عنه ودع صفقة ينبهك عند العثور على
                                إعلان مناسب.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>

                <Card variant="outlined" sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            alignItems={{ xs: 'stretch', sm: 'center' }}
                            justifyContent="space-between"
                        >
                            <Box>
                                <Typography variant="h6" fontWeight={700}>
                                    عمليات البحث المحفوظة
                                </Typography>

                                <Typography color="text.secondary" variant="body2">
                                    لديك {searches.length} عملية بحث محفوظة.
                                </Typography>
                            </Box>

                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="outlined"
                                    startIcon={<RefreshOutlinedIcon />}
                                    onClick={() => void loadSearches()}
                                    disabled={loading}
                                >
                                    تحديث
                                </Button>

                                <Button
                                    variant="contained"
                                    startIcon={<AddOutlinedIcon />}
                                    onClick={() => setShowForm((value) => !value)}
                                >
                                    بحث جديد
                                </Button>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                {showForm && (
                    <Card
                        component="form"
                        onSubmit={handleCreate}
                        variant="outlined"
                        sx={{ borderRadius: 3 }}
                    >
                        <CardContent>
                            <Stack spacing={2.5}>
                                <Typography variant="h6" fontWeight={700}>
                                    إنشاء بحث ذكي جديد
                                </Typography>

                                <FormControl fullWidth>
                                    <InputLabel>الفئة</InputLabel>
                                    <Select
                                        label="الفئة"
                                        value={form.category ?? ''}
                                        onChange={(event) =>
                                            handleCategoryChange(event.target.value)
                                        }
                                    >
                                        <MenuItem value="">كل الفئات</MenuItem>
                                        {categoryIds.map((id) => (
                                            <MenuItem key={id} value={id}>
                                                {categoryLabel(id)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {form.category && subCategoryIds.length > 0 && (
                                    <FormControl fullWidth>
                                        <InputLabel>الفئة الفرعية</InputLabel>
                                        <Select
                                            label="الفئة الفرعية"
                                            value={form.subCategory ?? ''}
                                            onChange={(event) =>
                                                updateField(
                                                    'subCategory',
                                                    event.target.value,
                                                )
                                            }
                                        >
                                            <MenuItem value="">كل الفرعيات</MenuItem>
                                            {subCategoryIds.map((sub) => (
                                                <MenuItem key={sub} value={sub}>
                                                    {subCategoryLabel(
                                                        form.category as string,
                                                        sub,
                                                    )}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}

                                <TextField
                                    label="الكلمة المفتاحية"
                                    placeholder="مثال: iPhone 15"
                                    value={form.keyword ?? ''}
                                    onChange={(event) =>
                                        updateField('keyword', event.target.value)
                                    }
                                    fullWidth
                                />

                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={2}
                                >
                                    <TextField
                                        label="السعر من"
                                        type="number"
                                        value={form.minPrice ?? ''}
                                        onChange={(event) =>
                                            updateField(
                                                'minPrice',
                                                event.target.value === ''
                                                    ? undefined
                                                    : Number(event.target.value),
                                            )
                                        }
                                        inputProps={{ min: 0 }}
                                        fullWidth
                                    />

                                    <TextField
                                        label="السعر إلى"
                                        type="number"
                                        value={form.maxPrice ?? ''}
                                        onChange={(event) =>
                                            updateField(
                                                'maxPrice',
                                                event.target.value === ''
                                                    ? undefined
                                                    : Number(event.target.value),
                                            )
                                        }
                                        inputProps={{ min: 0 }}
                                        fullWidth
                                    />
                                </Stack>

                                <Autocomplete
                                    options={cities}
                                    value={form.location || null}
                                    onChange={(_, city) =>
                                        updateField('location', city ?? '')
                                    }
                                    loading={citiesLoading}
                                    loadingText="جاري تحميل المدن..."
                                    noOptionsText="لا توجد مدن مطابقة"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="المدينة"
                                            placeholder="كل المدن"
                                            helperText="اتركه فارغاً للبحث في كل المدن."
                                        />
                                    )}
                                    fullWidth
                                />

                                <TextField
                                    label="اسم البحث"
                                    placeholder="مثال: بحث عن آيفون"
                                    value={form.name}
                                    onChange={(event) =>
                                        updateField('name', event.target.value)
                                    }
                                    required
                                    fullWidth
                                />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={
                                                form.notificationsEnabled ?? true
                                            }
                                            onChange={(event) =>
                                                updateField(
                                                    'notificationsEnabled',
                                                    event.target.checked,
                                                )
                                            }
                                        />
                                    }
                                    label="إرسال إشعارات عند العثور على إعلان مطابق"
                                />

                                <Divider />

                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={1}
                                >
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<SearchOutlinedIcon />}
                                        disabled={saving}
                                        fullWidth
                                    >
                                        {saving ? (
                                            <CircularProgress size={22} color="inherit" />
                                        ) : (
                                            'حفظ البحث'
                                        )}
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        onClick={() => setShowForm(false)}
                                        disabled={saving}
                                        fullWidth
                                    >
                                        إلغاء
                                    </Button>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <CircularProgress />
                    </Box>
                ) : searches.length === 0 ? (
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ py: 6, textAlign: 'center' }}>
                            <SearchOutlinedIcon
                                sx={{ fontSize: 56, color: 'text.secondary' }}
                            />

                            <Typography variant="h6" fontWeight={700} sx={{ mt: 1 }}>
                                لم تحفظ أي بحث بعد
                            </Typography>

                            <Typography color="text.secondary" sx={{ my: 2 }}>
                                أنشئ بحثك الأول لتصلك تنبيهات عند الموافقة على
                                إعلانات تناسبك.
                            </Typography>

                            <Button
                                variant="contained"
                                startIcon={<AddOutlinedIcon />}
                                onClick={() => setShowForm(true)}
                            >
                                إنشاء أول بحث
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Stack spacing={2}>
                        {searches.map((search) => {
                            const notificationsOn =
                                search.notificationsEnabled ?? true;

                            return (
                                <Card
                                    key={search._id}
                                    variant="outlined"
                                    sx={{ borderRadius: 3 }}
                                >
                                    <CardContent>
                                        <Stack spacing={2}>
                                            <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                                alignItems="flex-start"
                                                spacing={1}
                                            >
                                                <Box>
                                                    <Typography
                                                        variant="h6"
                                                        fontWeight={700}
                                                    >
                                                        {search.name}
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {search.keyword ||
                                                            'بدون كلمة مفتاحية'}
                                                    </Typography>
                                                </Box>

                                                <Chip
                                                    size="small"
                                                    color={
                                                        notificationsOn
                                                            ? 'success'
                                                            : 'default'
                                                    }
                                                    label={
                                                        notificationsOn
                                                            ? 'الإشعارات مفعّلة'
                                                            : 'الإشعارات متوقفة'
                                                    }
                                                />
                                            </Stack>

                                            <Stack
                                                direction="row"
                                                flexWrap="wrap"
                                                gap={1}
                                            >
                                                {search.category && (
                                                    <Chip
                                                        label={
                                                            search.subCategory
                                                                ? `${categoryLabel(search.category)} › ${subCategoryLabel(search.category, search.subCategory)}`
                                                                : categoryLabel(search.category)
                                                        }
                                                        variant="outlined"
                                                    />
                                                )}

                                                {(search.minPrice != null ||
                                                    search.maxPrice != null) && (
                                                    <Chip
                                                        label={[
                                                            formatPrice(
                                                                search.minPrice,
                                                            ) || 'دون حد أدنى',
                                                            formatPrice(
                                                                search.maxPrice,
                                                            ) || 'دون حد أعلى',
                                                        ].join(' – ')}
                                                        variant="outlined"
                                                    />
                                                )}

                                                {search.location && (
                                                    <Chip
                                                        label={`الموقع: ${search.location}`}
                                                        variant="outlined"
                                                    />
                                                )}
                                            </Stack>

                                            <Divider />

                                            <Stack
                                                direction={{
                                                    xs: 'column',
                                                    sm: 'row',
                                                }}
                                                alignItems={{
                                                    xs: 'stretch',
                                                    sm: 'center',
                                                }}
                                                justifyContent="space-between"
                                                spacing={1}
                                            >
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={notificationsOn}
                                                            disabled={
                                                                busyId === search._id
                                                            }
                                                            onChange={() =>
                                                                void handleToggleNotifications(
                                                                    search,
                                                                )
                                                            }
                                                        />
                                                    }
                                                    label={
                                                        <Stack
                                                            direction="row"
                                                            alignItems="center"
                                                            spacing={0.5}
                                                        >
                                                            <NotificationsActiveOutlinedIcon fontSize="small" />
                                                            <Typography variant="body2">
                                                                إشعارات البحث
                                                            </Typography>
                                                        </Stack>
                                                    }
                                                />

                                                <Button
                                                    color="error"
                                                    variant="text"
                                                    startIcon={
                                                        <DeleteOutlineOutlinedIcon />
                                                    }
                                                    disabled={busyId === search._id}
                                                    onClick={() =>
                                                        void handleDelete(search)
                                                    }
                                                >
                                                    حذف البحث
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Stack>
                )}
            </Stack>

            <Snackbar
                open={noticeOpen}
                autoHideDuration={5000}
                onClose={(_, reason) => {
                    if (reason === 'clickaway') return;
                    setNoticeOpen(false);
                }}
                TransitionProps={{ onExited: () => setNotice(null) }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                {notice ? (
                    <Alert
                        severity={notice.severity}
                        variant="filled"
                        onClose={() => setNoticeOpen(false)}
                        sx={{ direction: 'rtl' }}
                    >
                        {notice.message}
                    </Alert>
                ) : undefined}
            </Snackbar>
        </Container>
    );
};

export default SavedSearchesPage;