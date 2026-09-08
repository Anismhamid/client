import { FunctionComponent } from 'react';
import ProductCategory from './PostsCategory';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import JsonLd from '../../../../utils/JsonLd';
import { generateCategoryJsonLd } from '../../../../utils/structuredData';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { usePosts } from '../../../hooks/usePosts';
import PageNotFound from '../Png';

const Posts: FunctionComponent = () => {
    const { t } = useTranslation();

    const { category, subCategory } = useParams<{
        category: string;
        subCategory?: string;
    }>();

    const { posts } = usePosts();

    // Category is required
    if (!category) {
        return <PageNotFound />;
    }

    // Normalize category
    const normalizedCategory =
        category.charAt(0).toUpperCase() + category.slice(1);

    const categoryKey = `categories.${normalizedCategory}`;

    const categoryTitle = t(`${categoryKey}.heading`);
    const categoryDescription = t(`${categoryKey}.description`);

    // اسم الـ subCategory المترجم
    const subCategoryTitle = subCategory
        ? t(`${categoryKey}.subCategories.${subCategory}`)
        : null;

    // العنوان النهائي للصفحة
    const pageTitle = subCategoryTitle
        ? `${subCategoryTitle} - ${categoryTitle}`
        : categoryTitle;

    // الوصف
    const pageDescription = subCategoryTitle
        ? `${subCategoryTitle} - ${categoryDescription}`
        : categoryDescription;

    const categoryData = generateCategoryJsonLd(category, posts);

    return (
        <>
            <JsonLd data={categoryData} />

            <title>{pageTitle}</title>

            <meta name='description' content={pageDescription} />

            <Box
                className='container-fluid'
                sx={{
                    py: { xs: 4, md: 6 },
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        zIndex: 1,
                        textAlign: 'center',
                        p: 2,
                        width: '100%',
                        maxWidth: '100%',
                        margin: '0 auto',
                    }}
                >
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 30,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.8,
                        }}
                    >
                        <Typography
                            variant='h1'
                            sx={{
                                mb: 4,
                                color: 'text.secondary',
                                maxWidth: '600px',
                                margin: '0 auto',
                                fontSize: {
                                    xs: '1rem',
                                    sm: '1.25rem',
                                    md: '1.5rem',
                                },
                            }}
                        >
                            {pageTitle}
                        </Typography>

                        <Typography
                            variant='body1'
                            sx={{
                                color: 'text.secondary',
                                maxWidth: '800px',
                                margin: '0 auto',
                                mt: 4,
                                fontSize: {
                                    xs: '1rem',
                                    sm: '1.25rem',
                                    md: '1.5rem',
                                },
                            }}
                        >
                            {pageDescription}
                        </Typography>
                    </motion.div>
                </Box>
            </Box>

            <ProductCategory category={category} subCategory={subCategory} />
        </>
    );
};

export default Posts;
