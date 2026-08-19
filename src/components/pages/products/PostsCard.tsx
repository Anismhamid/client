import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
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
    FavoriteBorder,
} from '@mui/icons-material';
import {
    FunctionComponent,
    Dispatch,
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
import { useUser } from '../../../hooks/useUSer';
import SealBadge from '../home/SealBadge';
import { useChatWindow } from '../../../context/ChatWindowContext';
import { UserMessage } from '../../../interfaces/chat/usersMessages';

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

const GRADIENT = 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)';

const PostCard: FunctionComponent<PostCardProps> = ({
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
    const { auth } = useUser();
    const { openChat } = useChatWindow();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [expanded, setExpanded] = useState<boolean>(false);
    const menuRef = useRef(null);

    const jsonLdData = generateSingleProductJsonLd(post);
    const navigate = useNavigate();

    const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
        setMenuAnchor(e.currentTarget);
    const handleMenuClose = () => setMenuAnchor(null);

    const handleShare = () => {
        const shareUrl = `${window.location.origin}${productsPathes.postsDetails}/${post.category}/${post.brand}/${post._id}`;

        const shareText = `${post.product_name} - ${post.price} ${t(
            'postCard.priceCurrency',
        )}`;

        if (navigator.share) {
            navigator
                .share({
                    title: post.product_name,
                    text: shareText,
                    url: shareUrl,
                })
                .then(() => {
                    showSuccess(t('postCard.shareSuccess'));
                })
                .catch((error) => {
                    // إلغاء نافذة المشاركة لا يعتبر خطأ
                    if (error?.name !== 'AbortError') {
                        showError(t('postCard.shareFailed'));
                    }
                });
        } else if (navigator.clipboard) {
            navigator.clipboard
                .writeText(shareUrl)
                .then(() => {
                    showSuccess(t('postCard.copySuccess'));
                })
                .catch(() => {
                    showError(t('postCard.copyFailed'));
                });
        } else {
            showError(t('postCard.copyFailed'));
        }

        handleMenuClose();
    };

    // TODO: handle card report
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

    /** Opens the seller chat via the global chat context — FloatingChats
     * (mounted once in App.tsx) picks it up and renders it; PostCard never
     * needs to render a chat window itself. */
    const handleContactClick = () => {
        const sellerUser = post.seller;
        if (!sellerUser?._id) {
            navigate('/login');
            return;
        }
        if (!auth?._id) {
            navigate('/login');
            return;
        }
        openChat(sellerUser as UserMessage);
    };

    const productUrl = `${productsPathes.postsDetails}/${post.category}/${post.brand}/${post._id}`;
    const isOutOfStock = post.in_stock === false;
    const isOwnPost = auth._id === post.seller?._id;

    return (
        <Card
            dir={dir}
            sx={{
                borderRadius: '16px',
                border: featured ? '2px solid transparent' : '0.5px solid',
                borderColor: featured ? 'transparent' : 'divider',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                cursor: isOutOfStock ? 'not-allowed' : 'default',
                filter: isOutOfStock ? 'grayscale(0.45)' : 'none',
                transition: 'transform 0.18s, box-shadow 0.18s',
                position: 'relative',
                bgcolor: 'background.paper',
                '&:hover': {
                    transform: isOutOfStock ? 'none' : 'translateY(-4px)',
                    boxShadow: isOutOfStock
                        ? 'none'
                        : featured
                          ? '0 12px 32px rgba(184,134,11,0.22)'
                          : '0 8px 24px rgba(0,0,0,0.08)',
                },
                ...(featured && {
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        padding: '2px',
                        borderRadius: '16px',
                        background: GRADIENT,
                        WebkitMask:
                            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        pointerEvents: 'none',
                        zIndex: 2,
                    },
                }),
            }}
            itemScope
            itemType='https://schema.org/Product'
            role='article'
            aria-label={`${t('postCard.listing')}: ${post.product_name}`}
        >
            <JsonLd data={jsonLdData} />

            {/* ── FEATURED BAR ── */}
            {featured && (
                <Box
                    sx={{
                        bgcolor: 'warning.50',
                        color: 'warning.dark',
                        py: '5px',
                        textAlign: 'center',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        letterSpacing: 0.3,
                        borderBottom: '0.5px solid',
                        borderColor: 'warning.light',
                    }}
                >
                    ⭐ {t('ads.financed')}
                </Box>
            )}

            {/* ── HEADER ── */}
            <Box
                sx={{
                    px: 1.75,
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
                    <Avatar
                        src={post.seller?.image?.url}
                        alt={
                            post.seller?.name?.first || post.seller?.name?.last
                                ? `${post.seller?.name?.first || ''} ${post.seller?.name?.last || ''}`
                                : 'بائع'
                        }
                        imgProps={{
                            referrerPolicy: 'no-referrer',
                            onError: (e) => {
                                e.currentTarget.src = '/default-avatar.png';
                            },
                        }}
                        sx={{
                            width: 36,
                            height: 36,
                            border: '0.5px solid',
                            borderColor: 'divider',
                        }}
                    />
                    <Box>
                        <Typography
                            variant='subtitle2'
                            fontWeight={500}
                            sx={{
                                fontSize: '0.8125rem',
                                color: 'text.primary',
                                lineHeight: 1.3,
                                '&:hover': { textDecoration: 'underline' },
                            }}
                        >
                            {post.seller?.name?.first ||
                                post.seller?.slug ||
                                'بائع'}
                        </Typography>
                        <Stack
                            direction='row'
                            alignItems='center'
                            spacing={0.5}
                        >
                            <Typography
                                variant='caption'
                                sx={{
                                    color: 'text.disabled',
                                    fontSize: '0.7rem',
                                }}
                            >
                                {formatTimeAgo(String(post.createdAt), t) || ''}
                            </Typography>
                            <Typography
                                variant='caption'
                                sx={{ color: 'text.disabled' }}
                            >
                                ·
                            </Typography>
                            <Tooltip title={t('postCard.public')}>
                                <Typography
                                    variant='caption'
                                    sx={{ fontSize: '0.7rem' }}
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
                        color: 'text.disabled',
                        width: 30,
                        height: 30,
                        '&:hover': {
                            bgcolor: 'action.hover',
                            color: 'text.secondary',
                        },
                    }}
                >
                    <MoreHoriz sx={{ fontSize: 18 }} />
                </IconButton>

                <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={handleMenuClose}
                    PaperProps={{
                        sx: {
                            borderRadius: '10px',
                            border: '0.5px solid',
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
                        sx={{ fontSize: '0.8125rem', gap: 1 }}
                    >
                        <ShareIcon sx={{ fontSize: 16 }} />
                        {t('postCard.share')}
                    </MenuItem>
                    <MenuItem
                        onClick={handleReport}
                        sx={{ fontSize: '0.8125rem', gap: 1 }}
                    >
                        <Report sx={{ fontSize: 16, color: 'error.main' }} />
                        <Typography color='error' variant='inherit'>
                            {t('postCard.report')}
                        </Typography>
                    </MenuItem>

                    {canEdit && <Divider />}

                    {canEdit && (
                        <MenuItem
                            onClick={() => {
                                setPostIdToUpdate(post._id as string);
                                onShowUpdateProductModal();
                                handleMenuClose();
                            }}
                            sx={{ fontSize: '0.8125rem', gap: 1 }}
                        >
                            <EditIcon sx={{ fontSize: 16 }} />{' '}
                            {t('postCard.edit')}
                        </MenuItem>
                    )}

                    {canEdit && (
                        <MenuItem
                            onClick={() => {
                                openDeleteModal(post._id as string);
                                handleMenuClose();
                            }}
                            sx={{ fontSize: '0.8125rem', gap: 1 }}
                        >
                            <DeleteIcon
                                sx={{ fontSize: 16, color: 'error.main' }}
                            />
                            <Typography color='error' variant='inherit'>
                                {t('postCard.delete')}
                            </Typography>
                        </MenuItem>
                    )}
                </Menu>
            </Box>

            {/* ── PRODUCT NAME ── */}
            <Box sx={{ px: 1.75, pb: 1 }}>
                <Link to={productUrl} style={{ textDecoration: 'none' }}>
                    <Typography
                        variant='subtitle1'
                        fontWeight={500}
                        sx={{
                            fontSize: '0.9375rem',
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
                            showError(t('postCard.outOfStockError'));
                        }
                    }}
                    style={{ display: 'block' }}
                >
                    <CardMedia
                        component='img'
                        image={post.image.url}
                        alt={post.product_name}
                        sx={{
                            height: 300,
                            objectFit: 'cover',
                            bgcolor: 'action.hover',
                            transition: 'transform 0.25s ease',
                            '&:hover': {
                                transform: isOutOfStock
                                    ? 'none'
                                    : 'scale(1.025)',
                            },
                        }}
                    />
                </Link>

                {/* Discount badge */}
                {post.sale && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            bgcolor: 'error.main',
                            color: '#fff',
                            fontSize: '0.6875rem',
                            fontWeight: 500,
                            px: 1,
                            py: '3px',
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
                            left: 10,
                            bgcolor: 'rgba(0,0,0,0.55)',
                            color: '#fff',
                            fontSize: '0.6875rem',
                            fontWeight: 500,
                            px: 1,
                            py: '3px',
                            borderRadius: '6px',
                            lineHeight: 1.6,
                        }}
                    >
                        {t('postCard.outOfStock')}
                    </Box>
                )}

                {/* Featured badge on image — the seal stamp */}
                {featured && (
                    <Tooltip title={t('postCard.featured')}>
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 8,
                                right: 8,
                                zIndex: 2,
                            }}
                        >
                            <SealBadge size={40} rotate={-8}>
                                <StarRoundedIcon sx={{ fontSize: 18 }} />
                            </SealBadge>
                        </Box>
                    </Tooltip>
                )}
            </Box>

            {/* ── CONTENT ── */}
            <CardContent sx={{ p: 1.75, pt: 1.25, '&:last-child': { pb: 0 } }}>
                {/* Price row */}
                <Stack
                    direction='row'
                    alignItems='baseline'
                    spacing={1}
                    sx={{ mb: 1.25 }}
                >
                    <Typography
                        variant='h6'
                        fontWeight={500}
                        sx={{
                            color: 'primary.main',
                            fontSize: '1.125rem',
                            lineHeight: 1,
                            px: 1,
                            py: 0.5,
                            border: '1px dashed',
                            borderColor: 'primary.light',
                            borderRadius: '6px',
                            display: 'inline-block',
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
                                color: 'text.disabled',
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
                                fontSize: '0.8125rem',
                                color: 'text.secondary',
                                lineHeight: 1.65,
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
                                    fontWeight: 500,
                                    fontSize: '0.75rem',
                                    color: 'text.disabled',
                                    '&:hover': {
                                        bgcolor: 'transparent',
                                        color: 'text.primary',
                                    },
                                }}
                            >
                                {expanded ? t('postCard.hide') : t('postCard.more')}
                            </Button>
                        )}
                    </Box>
                )}

                {/* Tags row */}
                <Stack direction='row' flexWrap='wrap' gap={0.75}>
                    <Link
                        to={`/category/${post.category}`}
                        style={{ textDecoration: 'none' }}
                    >
                        <Chip
                            label={t(`categories.${post.category}.label`)}
                            size='small'
                            sx={{
                                height: 22,
                                fontSize: '0.6875rem',
                                bgcolor: 'primary.50',
                                color: 'primary.main',
                                fontWeight: 500,
                                border: '0.5px solid',
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
                                    fontSize: '0.6875rem',
                                    bgcolor: 'primary.50',
                                    color: 'primary.main',
                                    border: '0.5px solid',
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
                                    sx={{ fontSize: '11px !important' }}
                                />
                            }
                            label={post.location}
                            size='small'
                            sx={{
                                height: 22,
                                fontSize: '0.6875rem',
                                color: 'text.secondary',
                            }}
                        />
                    )}

                    {post.isNew !== undefined && (
                        <Chip
                            label={
                                post.isNew
                                    ? `🆕 ${t('postCard.new')}`
                                    : `🔄 ${t('postCard.used')}`
                            }
                            size='small'
                            sx={{
                                height: 22,
                                fontSize: '0.6875rem',
                                bgcolor: post.isNew
                                    ? 'success.50'
                                    : 'warning.50',
                                color: post.isNew
                                    ? 'success.main'
                                    : 'warning.main',
                                border: '0.5px solid',
                                borderColor: post.isNew
                                    ? 'success.light'
                                    : 'warning.light',
                            }}
                        />
                    )}

                    {post.brand && (
                        <Chip
                            label={post.brand}
                            size='small'
                            sx={{
                                height: 22,
                                fontSize: '0.6875rem',
                                color: 'text.secondary',
                            }}
                        />
                    )}
                </Stack>
            </CardContent>

            {/* ── CONTACT + WAZE (hidden for own posts) ── */}
            {!isOwnPost && (
                <Box
                    sx={{
                        px: 1.75,
                        pb: 1.25,
                        pt: 0.5,
                        display: 'flex',
                        gap: 1,
                    }}
                >
                    <Button
                        variant='outlined'
                        size='small'
                        startIcon={
                            <Comment sx={{ fontSize: '14px !important' }} />
                        }
                        onClick={handleContactClick}
                        disableElevation
                        sx={{
                            flex: 1,
                            borderRadius: '8px',
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            textTransform: 'none',
                            borderColor: 'primary.light',
                            color: 'primary.main',
                            bgcolor: 'primary.50',
                            '&:hover': {
                                bgcolor: 'primary.main',
                                color: '#fff',
                                borderColor: 'primary.main',
                            },
                        }}
                    >
                        {t('common.contact')}
                    </Button>

                    <Link
                        to={`https://waze.com/ul?q=${encodeURIComponent(post.location || '')}&navigate=yes`}
                        target='_blank'
                        rel='noopener noreferrer'
                        style={{ textDecoration: 'none' }}
                    >
                        <Chip
                            icon={<img src='/waze.png' width={14} alt='waze' />}
                            label={t('postCard.waze')}
                            size='small'
                            variant='outlined'
                            sx={{
                                height: 32,
                                borderRadius: '8px',
                                color: 'text.secondary',
                                fontWeight: 500,
                                fontSize: '0.8125rem',
                                cursor: 'pointer',
                                border: '0.5px solid',
                                borderColor: 'divider',
                                '& .MuiChip-icon': { ml: 0.75 },
                                '&:hover': { bgcolor: 'action.hover' },
                            }}
                        />
                    </Link>
                </Box>
            )}

            {/* ── STATS ── */}
            <Box
                sx={{
                    px: 1.75,
                    py: 0.75,
                    borderTop: '0.5px solid',
                    borderColor: 'divider',
                    borderTopStyle: 'dashed',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography
                    variant='caption'
                    sx={{
                        color: 'text.disabled',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                    }}
                >
                    <FavoriteBorder sx={{ fontSize: 13 }} />
                    {post.likes?.length || 0} {t('postCard.likes')}
                </Typography>
                <Typography
                    variant='caption'
                    sx={{ color: 'text.disabled', fontSize: '0.75rem' }}
                >
                    {t('postCard.comments')}
                    {post?.reviews?.[0]?.comment?.length || 0}
                </Typography>
                <Stack direction='row' alignItems='center' spacing={0.5}>
                    <VisibilityRounded
                        sx={{ fontSize: 13, color: 'text.disabled' }}
                    />

                    <Typography
                        variant='caption'
                        sx={{ color: 'text.disabled', fontSize: '0.75rem' }}
                    >
                        {post.views || 0}
                    </Typography>
                </Stack>
            </Box>

            {/* ── ACTIONS ── */}
            <CardActions
                sx={{ p: 0, borderTop: '0.5px solid', borderColor: 'divider' }}
            >
                <Box sx={{ width: '100%', display: 'flex' }}>
                    {/* Like */}
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

                    {/* Comment */}
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
                                <Comment sx={{ fontSize: '16px !important' }} />
                            }
                            onClick={() => navigate(productUrl)}
                            sx={{
                                color: 'text.secondary',
                                py: 1,
                                borderRadius: 0,
                                textTransform: 'none',
                                fontSize: '0.8125rem',
                                fontWeight: 500,
                                gap: 1,
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                    color: 'text.primary',
                                },
                            }}
                        >
                            {t('review.comments')}
                        </Button>
                    </Box>

                    <Divider orientation='vertical' flexItem />

                    {/* Bookmark */}
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
                                            fontSize: '16px !important',
                                            color: 'primary.main',
                                        }}
                                    />
                                ) : (
                                    <BookmarkBorder
                                        sx={{ fontSize: '16px !important' }}
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
                                fontSize: '0.8125rem',
                                fontWeight: 500,
                                gap: 0.5,
                                '&:hover': { bgcolor: 'action.hover' },
                            }}
                        >
                            {t('postCard.save')}
                        </Button>
                    </Box>
                </Box>
            </CardActions>
        </Card>
    );
};

export default PostCard;
