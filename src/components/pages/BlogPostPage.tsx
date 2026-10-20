import { FC, useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Button, Chip, Container, Skeleton, Typography } from '@mui/material';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { BlogPostItem } from '../../interfaces/blog';
import { fetchBlogPost } from '../../services/blog';

const BlogPostPage: FC = () => {
    const { slug = '' } = useParams();
    const [post, setPost] = useState<BlogPostItem | null>(null);
    const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');

    useEffect(() => {
        let alive = true;
        fetchBlogPost(slug)
            .then((p) => alive && (setPost(p), setState('ok')))
            .catch(() => alive && setState('error'));
        return () => {
            alive = false;
        };
    }, [slug]);

    useEffect(() => {
        if (!post) return;
        document.title = `${post.title} | صفقة`;
        const ld = document.createElement('script');
        ld.type = 'application/ld+json';
        ld.text = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            image: post.coverImage || undefined,
            datePublished: post.publishedAt,
            author: {
                '@type': 'Person',
                fName: post.authorName.first,
                lName: post.authorName.last,
            },
        });
        document.head.appendChild(ld);
        return () => {
            document.head.removeChild(ld);
        };
    }, [post]);

    const html = useMemo(
        () =>
            post?.content
                ? DOMPurify.sanitize(
                      marked.parse(post.content, { async: false }) as string,
                  )
                : '',
        [post],
    );

    if (state === 'loading')
        return (
            <Container maxWidth='md' sx={{ py: 4 }}>
                <Skeleton variant='rounded' height={400} />
            </Container>
        );

    if (state === 'error' || !post)
        return (
            <Container maxWidth='md' sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant='h6'>المقال غير موجود</Typography>
                <Typography component={RouterLink} to='/blog' color='primary'>
                    العودة للمدونة
                </Typography>
            </Container>
        );

    return (
        <Container maxWidth='md' sx={{ py: 4 }} component='article'>
            <Button
                component={RouterLink}
                to={`/blog/edit/${post._id}`}
                size='small'
                sx={{ mb: 2 }}
                variant='contained'
            >
                تعديل
            </Button>
            {post.coverImage && (
                <Box
                    component='img'
                    src={post.coverImage}
                    alt={post.title}
                    sx={{ width: '100%', borderRadius: 2, mb: 3 }}
                />
            )}
            <Typography
                variant='h3'
                component='h1'
                fontWeight={800}
                gutterBottom
            >
                {post.title}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
                {post.authorName.first} {post.authorName.last}
                {post.publishedAt &&
                    ` · ${new Date(post.publishedAt).toLocaleDateString()}`}
            </Typography>

            <Box
                sx={{
                    mt: 3,
                    lineHeight: 2,
                    '& img': { maxWidth: '100%', borderRadius: 1 },
                    '& h2, & h3': { mt: 3, mb: 1, fontWeight: 700 },
                    '& a': { color: 'primary.main' },
                }}
                dangerouslySetInnerHTML={{ __html: html }}
            />

            <Box display='flex' gap={1} flexWrap='wrap' mt={4}>
                {post.tags.map((t) => (
                    <Chip
                        key={t}
                        label={`#${t}`}
                        component={RouterLink}
                        to={`/blog?tag=${encodeURIComponent(t)}`}
                        clickable
                    />
                ))}
            </Box>
        </Container>
    );
};

export default BlogPostPage;
