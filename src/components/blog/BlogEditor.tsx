import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Container,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import {
    BlogPayload,
    createBlogPost,
    deleteBlogPost,
    fetchBlogPostForEdit,
    updateBlogPost,
} from '../../services/blog';

const empty: BlogPayload = {
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    tags: [],
    status: 'published',
};

const BlogEditor: FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState<BlogPayload>(empty);
    const [tagsText, setTagsText] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        fetchBlogPostForEdit(id)
            .then((p) => {
                setForm({
                    title: p.title,
                    excerpt: p.excerpt,
                    content: p.content ?? '',
                    coverImage: p.coverImage ?? '',
                    tags: p.tags,
                    status: p.status,
                });
                setTagsText(p.tags.join(', '));
            })
            .catch(() => setError('تعذر تحميل المقال'));
    }, [id]);

    const set = <K extends keyof BlogPayload>(k: K, v: BlogPayload[K]) =>
        setForm((f) => ({ ...f, [k]: v }));

    const preview = useMemo(
        () =>
            DOMPurify.sanitize(
                marked.parse(form.content || '', { async: false }) as string,
            ),
        [form.content],
    );

    const save = async () => {
        if (!form.title.trim() || !form.content.trim()) {
            setError('العنوان والمحتوى مطلوبين');
            return;
        }
        setSaving(true);
        setError('');
        const payload = {
            ...form,
            tags: tagsText
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean),
        };
        try {
            if (id) await updateBlogPost(id, payload);
            else await createBlogPost(payload);
            navigate('/blog');
        } catch {
            setError('فشل الحفظ');
        } finally {
            setSaving(false);
        }
    };

    const remove = async () => {
        if (!id || !window.confirm('حذف المقال نهائياً؟')) return;
        try {
            await deleteBlogPost(id);
            navigate('/blog');
        } catch {
            setError('فشل الحذف');
        }
    };

    return (
        <Container maxWidth='lg' sx={{ py: 4 }}>
            <Typography variant='h5' fontWeight={800} mb={3}>
                {id ? 'تعديل المقال' : 'مقال جديد'}
            </Typography>

            {error && (
                <Alert severity='error' sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box
                sx={{
                    display: 'grid',
                    gap: 3,
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                }}
            >
                <Stack spacing={2}>
                    <TextField
                        label='العنوان'
                        value={form.title}
                        onChange={(e) => set('title', e.target.value)}
                        inputProps={{ maxLength: 150 }}
                        fullWidth
                    />
                    <TextField
                        label='ملخص قصير'
                        value={form.excerpt}
                        onChange={(e) => set('excerpt', e.target.value)}
                        inputProps={{ maxLength: 300 }}
                        multiline
                        minRows={2}
                        fullWidth
                    />
                    <TextField
                        label='رابط صورة الغلاف'
                        value={form.coverImage}
                        onChange={(e) => set('coverImage', e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label='وسوم (مفصولة بفاصلة)'
                        value={tagsText}
                        onChange={(e) => setTagsText(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        select
                        label='الحالة'
                        value={form.status}
                        onChange={(e) =>
                            set(
                                'status',
                                e.target.value as BlogPayload['status'],
                            )
                        }
                        fullWidth
                    >
                        <MenuItem value='draft'>مسودة</MenuItem>
                        <MenuItem value='published'>منشور</MenuItem>
                    </TextField>
                    <TextField
                        label='المحتوى (Markdown)'
                        value={form.content}
                        onChange={(e) => set('content', e.target.value)}
                        multiline
                        minRows={14}
                        fullWidth
                        helperText='## عنوان فرعي · **غامق** · [رابط](https://...) · ![صورة](https://...)'
                    />
                </Stack>

                <Box
                    sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        p: 2,
                        overflow: 'auto',
                        maxHeight: 700,
                    }}
                >
                    <Typography variant='overline' color='text.secondary'>
                        معاينة
                    </Typography>
                    {form.coverImage && (
                        <Box
                            component='img'
                            src={form.coverImage}
                            alt=''
                            sx={{ width: '100%', borderRadius: 1, my: 1 }}
                        />
                    )}
                    <Typography variant='h4' fontWeight={800}>
                        {form.title}
                    </Typography>
                    <Box
                        sx={{
                            lineHeight: 2,
                            '& img': { maxWidth: '100%' },
                            '& h2, & h3': { mt: 3, mb: 1, fontWeight: 700 },
                        }}
                        dangerouslySetInnerHTML={{ __html: preview }}
                    />
                </Box>
            </Box>

            <Stack direction='row' spacing={2} mt={3}>
                <Button variant='contained' onClick={save} disabled={saving}>
                    {saving ? '...' : 'حفظ'}
                </Button>
                <Button onClick={() => navigate(-1)}>إلغاء</Button>
                {id && (
                    <Button
                        color='error'
                        onClick={remove}
                        sx={{ marginInlineStart: 'auto' }}
                    >
                        حذف
                    </Button>
                )}
            </Stack>
        </Container>
    );
};

export default BlogEditor;
