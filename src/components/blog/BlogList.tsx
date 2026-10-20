import { FC, useEffect, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Container,
    Pagination,
    Skeleton,
    Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { fetchBlogList } from '../../services/blog';
import { BlogPostItem } from '../../interfaces/blog';
import { useUser } from '../../hooks/useUSer';
// import { BlogPostItem, fetchBlogList } from "./blogApi";

const BlogList: FC = () => {
    const { t, i18n } = useTranslation();
    const [params, setParams] = useSearchParams();
    const page = Number(params.get('page')) || 1;
    const tag = params.get('tag') || undefined;

    const [items, setItems] = useState<BlogPostItem[]>([]);
    const [pages, setPages] = useState<number>(1);

    const [loading, setLoading] = useState<boolean>(true);

    const { auth } = useUser(); // عدّل حسب مشروعك
    const isStaff = auth?.role === 'Admin' || auth?.role === 'Moderator';

    useEffect(() => {
        document.title = `${t('blog.title', 'المدونة')} | صفقة`;
    }, [t]);

    useEffect(() => {
        let alive = true;

        fetchBlogList(page, tag)
            .then((d) => alive && (setItems(d.items), setPages(d.pages)))
            .catch(() => alive && setItems([]))
            .finally(() => alive && setLoading(false));
        return () => {
            alive = false;
        };
    }, [page, tag]);

    return (
        <Container maxWidth='lg' sx={{ py: 4 }}>
            {tag && (
                <Chip
                    label={`#${tag}`}
                    onDelete={() => setParams({})}
                    sx={{ mb: 2 }}
                />
            )}
            <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                mb={3}
            >
                <Typography variant='h4' fontWeight={800}>
                    {t('blog.title', 'المدونة')}
                </Typography>

                {isStaff && (
                    <Box display='flex' gap={1}>
                        <Button component={RouterLink} to='/blog/manage'>
                            إدارة
                        </Button>
                        <Button
                            component={RouterLink}
                            to='/blog/new'
                            variant='contained'
                        >
                            مقال جديد
                        </Button>
                    </Box>
                )}
            </Box>
            <Box
                sx={{
                    display: 'grid',
                    gap: 3,
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                    },
                }}
            >
                {loading
                    ? Array.from({ length: 6 }).map((_, i) => (
                          <Skeleton key={i} variant='rounded' height={320} />
                      ))
                    : items.map((p) => (
                          <Card
                              key={p._id}
                              component={RouterLink}
                              to={`/blog/${encodeURIComponent(p.slug)}`}
                              sx={{
                                  textDecoration: 'none',
                                  display: 'flex',
                                  flexDirection: 'column',
                              }}
                          >
                              {p.coverImage && (
                                  <CardMedia
                                      component='img'
                                      height='160'
                                      image={p.coverImage}
                                      alt={p.title}
                                      loading='lazy'
                                  />
                              )}
                              <CardContent>
                                  <Typography
                                      variant='h6'
                                      fontWeight={700}
                                      gutterBottom
                                  >
                                      {p.title}
                                  </Typography>
                                  <Typography
                                      variant='body2'
                                      color='text.secondary'
                                      mb={1}
                                  >
                                      {p.excerpt}
                                  </Typography>
                                  <Typography
                                      variant='caption'
                                      color='text.secondary'
                                  >
                                      {p.publishedAt &&
                                          new Date(
                                              p.publishedAt,
                                          ).toLocaleDateString(i18n.language)}
                                  </Typography>
                              </CardContent>
                          </Card>
                      ))}
            </Box>
            {!loading && items.length === 0 && (
                <Typography color='text.secondary' textAlign='center' py={6}>
                    {t('blog.empty', 'لا توجد مقالات بعد')}
                </Typography>
            )}
            {pages > 1 && (
                <Box display='flex' justifyContent='center' mt={4}>
                    <Pagination
                        count={pages}
                        page={page}
                        onChange={(_, v) =>
                            setParams({
                                ...(tag ? { tag } : {}),
                                page: String(v),
                            })
                        }
                    />
                </Box>
            )}
        </Container>
    );
};

export default BlogList;
