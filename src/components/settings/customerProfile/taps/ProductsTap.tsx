import {
    Grid,
    CardContent,
    CardMedia,
    Stack,
    IconButton,
    Box,
    Card,
    Chip,
    Typography,
    Rating,
} from '@mui/material';
import { FunctionComponent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LocalOffer,
    Favorite,
    FavoriteBorder,
    Share,
    Storefront,
} from '@mui/icons-material';
import { Posts } from '../../../../interfaces/Posts';
import { User } from '../../../../interfaces/chat/usersMessages';
import { productsPathes } from '../../../../routes/routes';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../../../helpers/dateAndPriceFormat';
import LikeButton from '../../../../atoms/like/LikeButton';
import { showSuccess } from '../../../../atoms/toasts/ReactToast';
import { getAverageRating } from '../../../pages/products/helpers/helperFunctions';

// هوية صفقة اللونية الموحدة
const BRAND_GOLD = '#B8860B';
const BRAND_BROWN = '#8B4513';
const BRAND_GRADIENT = `linear-gradient(90deg, ${BRAND_GOLD}, ${BRAND_BROWN})`;

interface ProductsTabProps {
    tabValue: number;
    products: Posts[];
    user: User;
    wishlist: Set<string>;
    toggleWishlist: (id: string) => void;
}

// ملاحظة: التبويب (TabPanel) أصبح يُغلَّف مرة واحدة فقط من الأب CustomerProfile،
// فتم حذف الغلاف المكرر هون تجنباً لتضاعف role='tabpanel' بالـDOM.
const ProductsTab: FunctionComponent<ProductsTabProps> = ({
    products,
    user,
    toggleWishlist,
    wishlist,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Box m={4}>
            <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                m={3}
            >
                <Typography
                    variant='h5'
                    fontWeight='bold'
                    sx={{ position: 'relative' }}
                >
                    {t('shares')} {user.name?.first}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: -8,
                            left: 0,
                            width: 60,
                            height: 4,
                            background: BRAND_GRADIENT,
                            borderRadius: 2,
                        }}
                    />
                </Typography>
                <Chip
                    icon={<LocalOffer />}
                    label={`${products.length} المنشورات المتاحه`}
                    variant='outlined'
                    sx={{
                        px: 1,
                        borderColor: BRAND_GOLD,
                        color: BRAND_BROWN,
                        fontWeight: 700,
                    }}
                />
            </Box>

            {products.length > 0 ? (
                <Grid container spacing={3}>
                    {products.map((product, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product._id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.05,
                                }}
                            >
                                <Card
                                    sx={{
                                        height: '100%',
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: `0 16px 40px rgba(139,69,19,0.18)`,
                                        },
                                    }}
                                >
                                    {/* شارات المنتج */}
                                    <Box
                                        position='absolute'
                                        top={12}
                                        left={12}
                                        zIndex={1}
                                    >
                                        {product.isNew && (
                                            <Chip
                                                label='جديد'
                                                color='success'
                                                size='small'
                                                sx={{
                                                    mr: 1,
                                                    fontWeight: 'bold',
                                                }}
                                            />
                                        )}
                                        {product.sale && product.discount && (
                                            <Chip
                                                label={`-${product.discount}%`}
                                                color='error'
                                                size='small'
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        )}
                                    </Box>

                                    {/* صورة المنتج */}
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            overflow: 'hidden',
                                            height: 200,
                                            bgcolor: 'grey',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <CardMedia
                                            component='img'
                                            image={
                                                product.image?.url ||
                                                `${product.product_name} - بيع وشراء في ${product.category}`
                                            }
                                            alt={`${product.product_name} للبيع في ${user.address?.city} - متجر ${user.name?.first}`}
                                            loading='lazy'
                                            sx={{
                                                height: '100%',
                                                width: '100%',
                                                objectFit: 'cover',
                                                transition:
                                                    'transform 0.5s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.05)',
                                                },
                                            }}
                                            onClick={() =>
                                                navigate(
                                                    `${productsPathes.postsDetails}/${product.category}/${product.brand}/${product._id}`,
                                                )
                                            }
                                        />
                                    </Box>

                                    <CardContent sx={{ p: 2.5 }}>
                                        {/* اسم المنتج */}
                                        <Typography
                                            variant='subtitle1'
                                            fontWeight='bold'
                                            component={Link}
                                            gutterBottom
                                            to={`${productsPathes.postsDetails}/${product.category}/${product.brand}/${product._id}`}
                                            sx={{
                                                textDecoration: 'none',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                minHeight: 48,
                                                color: 'inherit',
                                                '&:hover': {
                                                    color: BRAND_BROWN,
                                                },
                                            }}
                                        >
                                            {product.product_name}
                                        </Typography>

                                        {/* السعر والتقييم */}
                                        <Box
                                            display='flex'
                                            justifyContent='space-between'
                                            alignItems='center'
                                            mb={2}
                                        >
                                            <Box>
                                                {product.sale ? (
                                                    <Box>
                                                        <Typography
                                                            variant='h6'
                                                            color='error'
                                                            fontWeight='bold'
                                                        >
                                                            {formatPrice(
                                                                product.price -
                                                                    (product.price *
                                                                        (product.discount ||
                                                                            0)) /
                                                                        100,
                                                            )}
                                                        </Typography>
                                                        <Typography
                                                            variant='body2'
                                                            color='text.secondary'
                                                            sx={{
                                                                textDecoration:
                                                                    'line-through',
                                                            }}
                                                        >
                                                            {formatPrice(
                                                                product.price,
                                                            )}
                                                        </Typography>
                                                    </Box>
                                                ) : (
                                                    <Typography
                                                        variant='h6'
                                                        fontWeight='bold'
                                                        sx={{ color: BRAND_BROWN }}
                                                    >
                                                        {formatPrice(
                                                            product.price,
                                                        )}
                                                    </Typography>
                                                )}
                                            </Box>

                                            <Box
                                                display='flex'
                                                alignItems='center'
                                            >
                                                <Rating
                                                    value={getAverageRating(
                                                        product,
                                                    )}
                                                    precision={1}
                                                    readOnly
                                                    size='small'
                                                    sx={{ color: BRAND_GOLD }}
                                                />
                                            </Box>
                                        </Box>

                                        {/* الإعجاب والمشاركة */}
                                        <Stack
                                            direction='row'
                                            spacing={1}
                                            alignItems='center'
                                        >
                                            <Box sx={{ flex: 1 }}>
                                                <LikeButton product={product} />
                                            </Box>
                                            <IconButton
                                                size='small'
                                                onClick={() =>
                                                    toggleWishlist(
                                                        product._id ?? '',
                                                    )
                                                }
                                            >
                                                {wishlist.has(
                                                    product._id ?? '',
                                                ) ? (
                                                    <Favorite color='error' />
                                                ) : (
                                                    <FavoriteBorder />
                                                )}
                                            </IconButton>
                                            <IconButton
                                                size='small'
                                                onClick={() => {
                                                    if (navigator.share) {
                                                        navigator.share({
                                                            title: product.product_name,
                                                            text: `شاهد ${product.product_name} على موقع صفقه`,
                                                            url: `${window.location.origin}/product-details/${product.category}/${product.brand}/${product._id}`,
                                                        });
                                                    } else {
                                                        navigator.clipboard.writeText(
                                                            `${window.location.origin}/product-details/${product.category}/${product.brand}/${product._id}`,
                                                        );
                                                        showSuccess(
                                                            'تم نسخ رابط المنتج',
                                                        );
                                                    }
                                                }}
                                            >
                                                <Share />
                                            </IconButton>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box textAlign='center' py={10}>
                    <Storefront
                        sx={{
                            fontSize: 80,
                            color: 'text.secondary',
                            mb: 2,
                        }}
                    />
                    <Typography variant='h6' color='text.secondary' gutterBottom>
                        لا توجد منتجات
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                        {user.name?.first} لم يقم بإضافة أي منتجات بعد.
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default ProductsTab;