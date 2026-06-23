import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    Divider,
    Drawer,
    // Drawer,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    Bookmark,
    BookmarkBorder,
    Comment,
    MoreHoriz,
    Share as ShareIcon,
    LocationOn,
    Report,
    VisibilityRounded,
} from '@mui/icons-material';
import {
    Dispatch,
    FunctionComponent,
    memo,
    SetStateAction,
    useState,
    useRef,
} from 'react';
import { generatePath, Link, useNavigate } from 'react-router-dom';
import { Posts } from '../../../interfaces/Posts';
import { formatPrice } from '../../../helpers/dateAndPriceFormat';
import { generateSingleProductJsonLd } from '../../../../utils/structuredData';
import JsonLd from '../../../../utils/JsonLd';
import { useTranslation } from 'react-i18next';
import handleRTL from '../../../locales/handleRTL';
import { showError, showSuccess } from '../../../atoms/toasts/ReactToast';
import LikeButton from '../../../atoms/like/LikeButton';
import { path, productsPathes } from '../../../routes/routes';
import { formatTimeAgo } from './helpers/helperFunctions';
// import ChatBoxWrapper from '../chatBox/ChatBoxWrapper';
import { useUser } from '../../../context/useUSer';
import ChatModal from '../chatBox/ChatModal';

interface PostCardProps {
    post: Posts;
    discountedPrice: number;
    canEdit?: boolean;
    featured?: boolean;
    setPostIdToUpdate: Dispatch<SetStateAction<string>>;
    onShowUpdateProductModal: () => void;
    openDeleteModal: (name: string) => void;
    setLoadedImages?: React.Dispatch<
        React.SetStateAction<Record<string, boolean>>
    >;
    loadedImages?: Record<string, boolean>;
    category: string;
    onLikeToggle?: (postId: string, liked: boolean) => void;
    updateProductInList?: (updatedPost: Posts) => void;
}

export interface ChatUser {
    _id: string;
    name: {
        first?: string;
        last?: string;
    };
}

const PostCard: FunctionComponent<PostCardProps> = memo(
    ({
        post,
        discountedPrice,
        canEdit,
        featured = false,
        setPostIdToUpdate,
        onShowUpdateProductModal,
        openDeleteModal,
        onLikeToggle,
        updateProductInList,
    }) => {
        const { t } = useTranslation();
        const dir = handleRTL();
        // const navigate = useNavigate();
        const { auth } = useUser();
        const [isBookmarked, setIsBookmarked] = useState(false);
        const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
        const [expanded, setExpanded] = useState<boolean>(false);
        const [openChat, setOpenChat] = useState(false);
        const menuRef = useRef(null);

        const currentUser = {
            _id: auth._id as string,
            name: { first: auth.name.first, last: auth.name.last },
            email: auth.email as string,
            role: auth.role as string,
        };
        const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);

        const jsonLdData = generateSingleProductJsonLd(post);
        const navigate = useNavigate();
        const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
            setMenuAnchor(e.currentTarget);
        const handleMenuClose = () => setMenuAnchor(null);

        const handleShare = () => {
            const shareUrl = `${window.location.origin}${productsPathes.postsDetails}/${post.category}/${post.brand}/${post._id}`;
            const shareText = `${post.product_name} - ${post.price} شيكل`;

            if (navigator.share) {
                navigator
                    .share({
                        title: post.product_name,
                        text: shareText,
                        url: shareUrl,
                    })
                    .then(() => showSuccess('تمت المشاركة بنجاح'))
                    .catch(() => showError('فشل المشاركة'));
            } else {
                navigator.clipboard
                    .writeText(shareUrl)
                    .then(() => showSuccess('تم نسخ الرابط'))
                    .catch(() => showError('فشل نسخ الرابط'));
            }
            handleMenuClose();
        };

        const handleReport = () => {
            showSuccess('تم الإبلاغ عن المنتج');
            handleMenuClose();
        };

        const handleProductUpdate = (updatedProduct: Posts) => {
            if (updateProductInList) updateProductInList(updatedProduct);
        };

        const setProduct = updateProductInList
            ? (updater: (prev: Posts) => Posts) => {
                  handleProductUpdate(updater(post));
              }
            : undefined;

        const productUrl = `${productsPathes.postsDetails}/${post.category}/${post.brand}/${post._id}`;
        const isOutOfStock = post.in_stock === false;
        // const listingUrl = `${window.location.origin}${productsPathes.postsDetails}/${post.category}/${post.brand}/${post._id}`;

        return (
            <Card
                dir={dir}
                sx={{
                    borderRadius: '16px',
                    border: featured ? '2px solid' : '1.5px solid',
                    borderColor: featured ? '#FFD700' : 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    cursor: isOutOfStock ? 'not-allowed' : 'default',
                    filter: isOutOfStock ? 'grayscale(0.4)' : 'none',
                    transition:
                        'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                    position: 'relative',

                    '&:hover': {
                        borderColor: featured ? '#FFC107' : 'text.disabled',
                        transform: featured
                            ? 'translateY(-12px)'
                            : 'translateY(-3px)',
                        boxShadow: featured
                            ? '0 12px 32px rgba(255, 217, 0, 0.151)'
                            : undefined,
                    },
                }}
                itemScope
                itemType='https://schema.org/Product'
                role='article'
                aria-label={`اعلان: ${post.product_name}`}
            >
                <JsonLd data={jsonLdData} />

                {featured && (
                    <Box
                        sx={{
                            background:
                                'linear-gradient(90deg,#ffd9007a,#FFC107)',
                            color: '#000',
                            py: 0.5,
                            textAlign: 'center',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            letterSpacing: 0.3,
                        }}
                    >
                        ⭐ {t('ads.financed')}
                    </Box>
                )}

                {/* ── HEADER ── */}
                <Box
                    sx={{
                        px: 1.5,
                        pt: 1.5,
                        pb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Link
                        to={generatePath(path.CustomerProfile, {
                            slug: encodeURIComponent(post.seller?.slug ?? ''),
                        })}
                        style={{
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                        }}
                    >
                        {featured && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 400,
                                    left: post.sale ? 75 : 10,
                                    // bgcolor: '#FFD700',
                                    color: '#000',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: '6px',
                                    zIndex: 5,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                }}
                            >
                                ⭐
                            </Box>
                        )}
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                src={
                                    post.seller?.user?.image?.url || 'user.png'
                                }
                                alt={post.seller?.name || 'بائع'}
                                sx={{
                                    width: 38,
                                    height: 38,
                                    border: '1.5px solid',
                                    transition: 'border-color 0.15s',
                                }}
                            />
                        </Box>
                        <Box>
                            <Stack
                                direction='row'
                                alignItems='center'
                                spacing={0.5}
                            >
                                <Typography
                                    variant='subtitle2'
                                    fontWeight={600}
                                    sx={{
                                        fontSize: '0.875rem',
                                        color: 'text.primary',
                                        lineHeight: 1.3,
                                        '&:hover': {
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    {post.seller?.name ||
                                        post.seller?.slug ||
                                        'بائع'}
                                </Typography>
                            </Stack>
                            <Stack
                                direction='row'
                                alignItems='center'
                                spacing={0.5}
                            >
                                <Typography
                                    variant='caption'
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    {formatTimeAgo(String(post.createdAt), t) ||
                                        ''}
                                </Typography>
                                <Typography
                                    variant='caption'
                                    sx={{ color: 'text.secondary' }}
                                >
                                    ·
                                </Typography>
                                <Tooltip title='عام للجميع'>
                                    <Typography
                                        variant='caption'
                                        sx={{ fontSize: '0.75rem' }}
                                    >
                                        🌍
                                    </Typography>
                                </Tooltip>
                            </Stack>
                        </Box>
                    </Link>

                    <IconButton
                        size='small'
                        onClick={handleMenuOpen}
                        ref={menuRef}
                        sx={{
                            color: 'text.secondary',
                            '&:hover': { bgcolor: 'action.hover' },
                        }}
                    >
                        <MoreHoriz sx={{ fontSize: 20 }} />
                    </IconButton>

                    <Menu
                        anchorEl={menuAnchor}
                        open={Boolean(menuAnchor)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            sx: {
                                borderRadius: '10px',
                                border: '1px solid',
                                borderColor: 'divider',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                minWidth: 160,
                            },
                        }}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem
                            onClick={handleShare}
                            sx={{ fontSize: '0.875rem', gap: 1 }}
                        >
                            <ShareIcon sx={{ fontSize: 18 }} /> مشاركة
                        </MenuItem>
                        <MenuItem
                            onClick={handleReport}
                            sx={{ fontSize: '0.875rem', gap: 1 }}
                        >
                            <Report
                                sx={{ fontSize: 18, color: 'error.main' }}
                            />
                            <Typography color='error' variant='inherit'>
                                الإبلاغ
                            </Typography>
                        </MenuItem>
                        {canEdit && (
                            <Box>
                                <Divider />
                                <MenuItem
                                    onClick={() => {
                                        setPostIdToUpdate(post._id as string);
                                        onShowUpdateProductModal();
                                        handleMenuClose();
                                    }}
                                    sx={{ fontSize: '0.875rem', gap: 1 }}
                                >
                                    <EditIcon sx={{ fontSize: 18 }} /> تعديل
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        openDeleteModal(post._id as string);
                                        handleMenuClose();
                                    }}
                                    sx={{ fontSize: '0.875rem', gap: 1 }}
                                >
                                    <DeleteIcon
                                        sx={{
                                            fontSize: 18,
                                            color: 'error.main',
                                        }}
                                    />
                                    <Typography color='error' variant='inherit'>
                                        حذف
                                    </Typography>
                                </MenuItem>
                            </Box>
                        )}
                    </Menu>
                </Box>

                {/* ── PRODUCT NAME ── */}
                <Box sx={{ px: 1.5, pb: 1 }}>
                    <Link to={productUrl} style={{ textDecoration: 'none' }}>
                        <Typography
                            variant='subtitle1'
                            fontWeight={700}
                            sx={{
                                fontSize: '1rem',
                                color: 'text.primary',
                                lineHeight: 1.4,
                                '&:hover': { textDecoration: 'underline' },
                            }}
                            itemProp='name'
                        >
                            {post.product_name}
                        </Typography>
                    </Link>
                </Box>

                {/* ── IMAGE ── */}
                <Box sx={{ position: 'relative' }}>
                    <Link
                        to={productUrl}
                        onClick={(e) => {
                            if (isOutOfStock) {
                                e.preventDefault();
                                showError('هذا المنتج غير متوفر حالياً');
                            }
                        }}
                        style={{ display: 'block' }}
                    >
                        <CardMedia
                            component='img'
                            image={post.image.url}
                            alt={post.product_name}
                            sx={{
                                height: 210,
                                objectFit: 'cover',
                                bgcolor: 'action.hover',
                                transition: 'transform 0.3s ease',
                                '&:hover': { transform: 'scale(1.02)' },
                            }}
                        />
                    </Link>

                    {/* Discount badge */}
                    {post.sale && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 10,
                                left: 10,
                                bgcolor: 'error.main',
                                color: '#fff',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                px: 1,
                                py: 0.25,
                                borderRadius: '6px',
                                lineHeight: 1.6,
                            }}
                        >
                            -{post.discount}%
                        </Box>
                    )}

                    {/* Out of stock badge */}
                    {isOutOfStock && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                bgcolor: 'rgba(0,0,0,0.65)',
                                color: '#fff',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                px: 1,
                                py: 0.25,
                                borderRadius: '6px',
                                lineHeight: 1.6,
                            }}
                        >
                            غير متوفر
                        </Box>
                    )}

                    {/* Bookmark button */}
                    <IconButton
                        onClick={() => setIsBookmarked(!isBookmarked)}
                        size='small'
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(255,255,255,0.9)',
                            width: 30,
                            height: 30,
                            '&:hover': { bgcolor: '#fff' },
                        }}
                    >
                        {isBookmarked ? (
                            <Bookmark
                                sx={{ fontSize: 16, color: 'primary.main' }}
                            />
                        ) : (
                            <BookmarkBorder sx={{ fontSize: 16 }} />
                        )}
                    </IconButton>
                </Box>

                {/* ── CONTENT ── */}
                <CardContent
                    sx={{ p: 1.5, pt: 1.25, '&:last-child': { pb: 0 } }}
                >
                    {/* Price row */}
                    <Stack
                        direction='row'
                        alignItems='baseline'
                        spacing={1}
                        sx={{ mb: 1.25 }}
                    >
                        <Typography
                            variant='h6'
                            fontWeight={700}
                            sx={{
                                color: 'primary.main',
                                fontSize: '1.125rem',
                                lineHeight: 1,
                            }}
                            itemProp='offers'
                            itemScope
                            itemType='https://schema.org/Offer'
                        >
                            {post.sale
                                ? formatPrice(discountedPrice)
                                : formatPrice(post.price)}
                            <meta
                                itemProp='price'
                                content={
                                    post.sale
                                        ? discountedPrice.toString()
                                        : post.price.toString()
                                }
                            />
                            <meta itemProp='priceCurrency' content='ILS' />
                            <meta
                                itemProp='availability'
                                content={
                                    post.in_stock
                                        ? 'https://schema.org/InStock'
                                        : 'https://schema.org/OutOfStock'
                                }
                            />
                        </Typography>
                        {post.sale && (
                            <Typography
                                variant='caption'
                                sx={{
                                    color: 'text.secondary',
                                    textDecoration: 'line-through',
                                    fontSize: '0.8125rem',
                                }}
                            >
                                {formatPrice(post.price)}
                            </Typography>
                        )}
                    </Stack>

                    {/* Description */}
                    {post.description && (
                        <Box sx={{ mb: 1.25 }}>
                            <Typography
                                variant='body2'
                                sx={{
                                    fontSize: '0.875rem',
                                    color: 'text.secondary',
                                    lineHeight: 1.6,
                                    whiteSpace: 'pre-line',
                                    display: '-webkit-box',
                                    WebkitLineClamp: expanded ? 'none' : 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }}
                            >
                                {post.description}
                            </Typography>
                            {post.description.length > 100 && (
                                <Button
                                    size='small'
                                    onClick={() => setExpanded(!expanded)}
                                    sx={{
                                        p: 0,
                                        mt: 0.25,
                                        minWidth: 0,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: '0.8125rem',
                                        color: 'text.secondary',
                                        '&:hover': {
                                            bgcolor: 'transparent',
                                            color: 'text.primary',
                                        },
                                    }}
                                >
                                    {expanded ? 'إخفاء' : 'المزيد'}
                                </Button>
                            )}
                        </Box>
                    )}

                    {/* Tags row */}
                    <Stack
                        direction='row'
                        flexWrap='wrap'
                        gap={0.75}
                        sx={{ mb: 1.25 }}
                    >
                        <Link
                            to={`/category/${post.category}`}
                            style={{ textDecoration: 'none' }}
                        >
                            <Chip
                                label={t(`categories.${post.category}.label`)}
                                size='small'
                                sx={{
                                    height: 22,
                                    fontSize: '0.75rem',
                                    bgcolor: 'primary.50',
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    border: '1px solid',
                                    borderColor: 'primary.light',
                                    '&:hover': { bgcolor: 'primary.100' },
                                }}
                            />
                        </Link>

                        {post.subcategory && (
                            <Link
                                to={`/category/${post.category}/${post.subcategory}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <Chip
                                    label={t(
                                        `categories.${post.category}.subCategories.${post.subcategory}`,
                                    )}
                                    size='small'
                                    sx={{
                                        height: 22,
                                        fontSize: '0.75rem',
                                        bgcolor: 'primary.50',
                                        color: 'primary.main',
                                        border: '1px solid',
                                        borderColor: 'primary.light',
                                        '&:hover': { bgcolor: 'primary.100' },
                                    }}
                                />
                            </Link>
                        )}

                        {post.location && (
                            <Chip
                                icon={
                                    <LocationOn
                                        sx={{ fontSize: '12px !important' }}
                                    />
                                }
                                label={post.location}
                                size='small'
                                sx={{
                                    height: 22,
                                    fontSize: '0.75rem',
                                    color: 'text.secondary',
                                }}
                            />
                        )}

                        {post.isNew !== undefined && (
                            <Chip
                                label={post.isNew ? '🆕 جديد' : '🔄 مستعمل'}
                                size='small'
                                sx={{
                                    height: 22,
                                    fontSize: '0.75rem',
                                    bgcolor: post.isNew
                                        ? 'success.50'
                                        : 'warning.50',
                                    color: post.isNew
                                        ? 'success.main'
                                        : 'warning.main',
                                }}
                            />
                        )}

                        {post.brand && (
                            <Chip
                                label={post.brand}
                                size='small'
                                sx={{
                                    height: 22,
                                    fontSize: '0.75rem',
                                    color: 'text.secondary',
                                }}
                            />
                        )}
                    </Stack>

                    {/* Contact + Waze */}

                    <Stack
                        hidden={post.seller?.user?._id === auth?._id}
                        direction='row'
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                        }}
                        display={'flex'}
                        gap={1}
                    >
                        <Button
                            variant='outlined'
                            size='small'
                            startIcon={
                                <Comment sx={{ fontSize: '14px !important' }} />
                            }
                            onClick={() => {
                                const sellerUser = post.seller;
                                const fromId = auth?._id;

                                if (!sellerUser?.user?._id || !fromId) {
                                    return navigate('/login');
                                }

                                setSelectedUser({
                                    _id: sellerUser.user?._id as string,
                                    name: {
                                        first: sellerUser.name,
                                        last: selectedUser?.name?.last,
                                    },
                                });
                                setOpenChat(true);
                            }}
                            disableElevation
                        >
                            {t('common.contact')}
                        </Button>

                        <Link
                            to={`https://waze.com/ul?q=${encodeURIComponent(post.location || '')}&navigate=yes`}
                            target='_blank'
                            rel='noopener noreferrer'
                            style={{ textDecoration: 'none', gap: 1 }}
                        >
                            <Chip
                                icon={
                                    <img
                                        src='/waze.png'
                                        width={16}
                                        alt='waze'
                                    />
                                }
                                label='Waze'
                                size='small'
                                hidden={post.seller?.user?._id === auth?._id}
                                variant='outlined'
                                sx={{
                                    height: 30,
                                    color: 'info.main',
                                    gap: 1,
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    '& .MuiChip-icon': { mr: 0.75 },
                                }}
                            />
                        </Link>
                    </Stack>
                </CardContent>

                {/* ── STATS ── */}
                <Box
                    sx={{
                        px: 1.5,
                        py: 0.75,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Stack
                        direction='row'
                        justifyContent='space-between'
                        alignItems='center'
                    >
                        <Typography
                            variant='caption'
                            sx={{ color: 'text.secondary', fontSize: '0.8rem' }}
                        >
                            {post.likes?.length || 0} إعجاب
                        </Typography>
                        <Stack
                            direction='row'
                            alignItems='center'
                            spacing={0.5}
                        >
                            <VisibilityRounded
                                sx={{ fontSize: 14, color: 'text.secondary' }}
                            />
                            <Typography
                                variant='caption'
                                sx={{
                                    color: 'text.secondary',
                                    fontSize: '0.8rem',
                                }}
                            >
                                129
                            </Typography>
                        </Stack>
                    </Stack>
                </Box>

                {/* ── ACTIONS ── */}
                <CardActions
                    sx={{
                        p: 0,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box sx={{ width: '100%', display: 'flex' }}>
                        <Box
                            sx={{
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <LikeButton
                                product={post}
                                setProduct={setProduct}
                                onLikeToggle={onLikeToggle}
                            />
                        </Box>
                        <Divider orientation='vertical' flexItem />
                        <Box
                            sx={{
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Button
                                fullWidth
                                startIcon={
                                    <Comment
                                        sx={{ fontSize: '18px !important' }}
                                    />
                                }
                                sx={{
                                    color: 'text.secondary',
                                    py: 1,
                                    borderRadius: 0,
                                    textTransform: 'none',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    gap: 0.5,
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                        color: 'text.primary',
                                    },
                                }}
                            >
                                تعليق
                            </Button>
                        </Box>
                        <Divider orientation='vertical' flexItem />
                        <Box
                            sx={{
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Button
                                fullWidth
                                startIcon={
                                    isBookmarked ? (
                                        <Bookmark
                                            sx={{
                                                fontSize: '18px !important',
                                                color: 'primary.main',
                                            }}
                                        />
                                    ) : (
                                        <BookmarkBorder
                                            sx={{ fontSize: '18px !important' }}
                                        />
                                    )
                                }
                                onClick={() => setIsBookmarked(!isBookmarked)}
                                sx={{
                                    color: isBookmarked
                                        ? 'primary.main'
                                        : 'text.secondary',
                                    py: 1,
                                    borderRadius: 0,
                                    textTransform: 'none',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    gap: 0.5,
                                    '&:hover': { bgcolor: 'action.hover' },
                                }}
                            >
                                حفظ
                            </Button>
                        </Box>
                    </Box>
                </CardActions>
                <Drawer
                    anchor='right'
                    open={openChat}
                    onClose={() => setOpenChat(false)}
                    PaperProps={{
                        sx: { width: { xs: '100%', sm: 400, md: 450 } },
                    }}
                >
                    {openChat && selectedUser && (
                        <ChatModal
                            onClose={() => setOpenChat(false)}
                            open={openChat}
                            currentUser={currentUser}
                            otherUser={selectedUser}
                            token={localStorage.getItem('token') as string}
                        />
                    )}
                </Drawer>
            </Card>
        );
    },
);

export default PostCard;
