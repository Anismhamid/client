import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import {
    alpha,
    Avatar,
    Box,
    Button,
    Card,
    CardMedia,
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
    ChatBubbleOutline,
    MoreHoriz,
    Share as ShareIcon,
    LocationOn,
    VisibilityRounded,
    AccessTimeRounded,
} from '@mui/icons-material';
import { FunctionComponent, Dispatch, SetStateAction, useState } from 'react';
import { generatePath, Link, useNavigate } from 'react-router-dom';
import { Posts } from '../../../interfaces/Posts';
import { formatPrice } from '../../../helpers/dateAndPriceFormat';
import { generateSingleProductJsonLd } from '../../../../utils/structuredData';
import JsonLd from '../../../../utils/JsonLd';
import { useTranslation } from 'react-i18next';
import handleRTL from '../../../locales/handleRTL';
import { showError, showSuccess } from '../../../atoms/toasts/ReactToast';
import LikeButton from '../../../atoms/like/LikeButton';
import { path } from '../../../routes/routes';
import { formatTimeAgo } from './helpers/helperFunctions';
import { useUser } from '../../../hooks/useUSer';
import SealBadge from '../home/SealBadge';
import { useChatWindow } from '../../../context/ChatWindowContext';
import { UserMessage } from '../../../interfaces/chat/usersMessages';
import ReportButton from '../../reports/ReportButton';
import { getPostUrl } from './helpers/postUrl';

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
const INK = '#12161C';

const glassBtn = {
    width: 32,
    height: 32,
    color: '#fff',
    bgcolor: alpha(INK, 0.75),
    backdropFilter: 'blur(6px)',
    '&:hover': { bgcolor: alpha(INK, 0.75) },
} as const;

const pill = {
    position: 'absolute',
    color: '#fff',
    fontSize: '0.6875rem',
    fontWeight: 700,
    px: 1,
    py: '3px',
    borderRadius: '999px',
    lineHeight: 1.6,
    backdropFilter: 'blur(6px)',
} as const;

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
    const { auth, isLoggedIn } = useUser();
    const { openChat } = useChatWindow();
    const navigate = useNavigate();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const jsonLdData = generateSingleProductJsonLd(post);

    const productUrl = getPostUrl({ _id: post._id, postName: post.product_name });

    const isOutOfStock = post.in_stock === false;
    const isOwnPost = auth._id === post.seller?._id;
    const sellerName = post.seller?.name?.first || post.seller?.slug || 'بائع';
    const rated =
        post.reviews?.filter((r) => typeof r.rating === 'number') ?? [];
    const postRatingsCount = rated.length;
    const postRating = rated.length
        ? rated.reduce((sum, r) => sum + (r.rating ?? 0), 0) / rated.length
        : 0;
    const finalPrice = post.sale ? discountedPrice : post.price;
    const commentsCount = post.reviews?.length || 0;

    const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
        setMenuAnchor(e.currentTarget);
    const handleMenuClose = () => setMenuAnchor(null);

    const handleShare = () => {
        const shareUrl = `${window.location.origin}${productUrl}`;
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
                .then(() => showSuccess(t('postCard.shareSuccess')))
                .catch((error) => {
                    // إلغاء نافذة المشاركة مش خطأ
                    if (error?.name !== 'AbortError') {
                        showError(t('postCard.shareFailed'));
                    }
                });
        } else if (navigator.clipboard) {
            navigator.clipboard
                .writeText(shareUrl)
                .then(() => showSuccess(t('postCard.copySuccess')))
                .catch(() => showError(t('postCard.copyFailed')));
        } else {
            showError(t('postCard.copyFailed'));
        }

        handleMenuClose();
    };

    const setProduct = updateProductInList
        ? (updater: (prev: Posts) => Posts) => {
              updateProductInList(updater(post));
          }
        : undefined;

    /** Opens the seller chat via the global chat context — FloatingChats
     * (mounted once in App.tsx) renders it; PostCard never renders a chat. */
    const handleContactClick = () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        const seller = post.seller;

        if (typeof seller === 'string' || !seller?._id) {
            showError(t('postCard.sellerUnavailable'));
            return;
        }

        openChat(seller as UserMessage);
    };

    return (
        <Card
            dir={dir}
            elevation={0}
            sx={{
                height: '100%',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: '18px',
                border: '1px solid',
                borderColor: featured ? 'transparent' : 'divider',
                bgcolor: 'background.paper',
                cursor: isOutOfStock ? 'not-allowed' : 'default',
                filter: isOutOfStock ? 'grayscale(0.5)' : 'none',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: isOutOfStock ? 'none' : 'translateY(-4px)',
                    boxShadow: isOutOfStock
                        ? 'none'
                        : featured
                          ? '0 14px 34px rgba(184,134,11,0.25)'
                          : '0 10px 28px rgba(0,0,0,0.10)',
                },
                ...(featured && {
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        padding: '2px',
                        borderRadius: '18px',
                        background: GRADIENT,
                        WebkitMask:
                            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        pointerEvents: 'none',
                        zIndex: 3,
                    },
                }),
            }}
            itemScope
            itemType='https://schema.org/Product'
            role='article'
            aria-label={`${t('postCard.listing')}: ${post.product_name}`}
        >
            <JsonLd data={jsonLdData} />

            {/* ── FEATURED STRIP ── */}
            {featured && (
                <Box
                    sx={{
                        background: GRADIENT,
                        color: '#fff',
                        py: '5px',
                        textAlign: 'center',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        letterSpacing: 0.3,
                    }}
                >
                    ⭐ {t('ads.financed')}
                </Box>
            )}

            {/* ── IMAGE ── */}
            {/* ── IMAGE ── */}
            <Box
                sx={{
                    position: 'relative',
                    aspectRatio: '4 / 3',
                    overflow: 'hidden',
                    flexShrink: 0,
                }}
            >
                <Link
                    to={productUrl}
                    onClick={(e) => {
                        if (isOutOfStock) {
                            e.preventDefault();
                            showError(t('postCard.outOfStockError'));
                        }
                    }}
                    style={{ position: 'absolute', inset: 0, display: 'block' }}
                >
                    <CardMedia
                        component='img'
                        image={post.image.url}
                        alt={post.product_name}
                        loading='lazy'
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            bgcolor: 'action.hover',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: isOutOfStock
                                    ? 'none'
                                    : 'scale(1.04)',
                            },
                        }}
                    />
                </Link>

                {/* scrim */}
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                        background: `linear-gradient(to top, ${alpha(INK, 0.55)} 0%, ${alpha(INK, 0)} 45%)`,
                    }}
                />

                {/* discount */}
                {post.sale && (
                    <Box
                        sx={{
                            ...pill,
                            top: 10,
                            insetInlineStart: 10,
                            bgcolor: 'error.main',
                        }}
                    >
                        -{post.discount}%
                    </Box>
                )}

                {/* menu */}
                <IconButton
                    size='small'
                    onClick={handleMenuOpen}
                    aria-label={t('postCard.share')}
                    sx={{
                        ...glassBtn,
                        position: 'absolute',
                        top: 10,
                        insetInlineEnd: 10,
                    }}
                >
                    <MoreHoriz sx={{ fontSize: 18 }} />
                </IconButton>

                {/* condition */}
                {post.isNew !== undefined && (
                    <Box
                        sx={{
                            ...pill,
                            bottom: 10,
                            insetInlineStart: 10,
                            bgcolor: post.isNew
                                ? 'rgba(46,125,50,0.85)'
                                : alpha(INK, 0.6),
                        }}
                    >
                        {post.isNew
                            ? `🆕 ${t('postCard.new')}`
                            : `🔄 ${t('postCard.used')}`}
                    </Box>
                )}

                {/* out of stock */}
                {isOutOfStock && (
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'grid',
                            placeItems: 'center',
                            bgcolor: alpha(INK, 0.45),
                            pointerEvents: 'none',
                        }}
                    >
                        <Box
                            sx={{
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '0.8125rem',
                                px: 1.75,
                                py: 0.5,
                                border: '1.5px solid #fff',
                                borderRadius: '8px',
                                letterSpacing: 0.5,
                            }}
                        >
                            {t('postCard.outOfStock')}
                        </Box>
                    </Box>
                )}

                {/* featured seal */}
                {featured && (
                    <Tooltip title={t('postCard.featured')}>
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 8,
                                insetInlineEnd: 8,
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

            {/* ── BODY ── */}
            <Box sx={{ px: 2, pt: 1.5, pb: 1.25, flexGrow: 1 }}>
                {/* category / brand */}
                <Stack
                    direction='row'
                    alignItems='center'
                    spacing={0.75}
                    sx={{ mb: 0.5 }}
                >
                    <Link
                        to={`/category/${post.category}`}
                        style={{ textDecoration: 'none' }}
                    >
                        <Typography
                            sx={{
                                fontSize: '0.6875rem',
                                fontWeight: 700,
                                letterSpacing: 0.4,
                                background: GRADIENT,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            {t(`categories.${post.category}.label`)}
                        </Typography>
                    </Link>
                    {post.subcategory && (
                        <>
                            <Typography
                                sx={{
                                    color: 'text.disabled',
                                    fontSize: '0.6875rem',
                                }}
                            >
                                /
                            </Typography>
                            <Link
                                to={`/category/${post.category}/${post.subcategory}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: '0.6875rem',
                                        '&:hover': {
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    {t(
                                        `categories.${post.category}.subCategories.${post.subcategory}`,
                                    )}
                                </Typography>
                            </Link>
                        </>
                    )}
                    {post.brand && (
                        <Typography
                            sx={{
                                color: 'text.disabled',
                                fontSize: '0.6875rem',
                                marginInlineStart: 'auto !important',
                            }}
                        >
                            {post.brand}
                        </Typography>
                    )}
                </Stack>

                {/* title */}
                <Link to={productUrl} style={{ textDecoration: 'none' }}>
                    <Typography
                        itemProp='name'
                        sx={{
                            fontSize: '0.9688rem',
                            fontWeight: 700,
                            lineHeight: 1.45,
                            color: 'text.primary',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            '&:hover': { textDecoration: 'underline' },
                        }}
                    >
                        {post.product_name}
                    </Typography>
                </Link>

                {/* price */}
                <Stack
                    direction='row'
                    alignItems='baseline'
                    spacing={1}
                    sx={{ mt: 1 }}
                    itemProp='offers'
                    itemScope
                    itemType='https://schema.org/Offer'
                >
                    <Typography
                        component='span'
                        sx={{
                            fontSize: '1.375rem',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            color: 'text.primary',
                        }}
                    >
                        {formatPrice(finalPrice)}
                    </Typography>
                    {post.sale && (
                        <Typography
                            component='span'
                            sx={{
                                color: 'text.disabled',
                                textDecoration: 'line-through',
                                fontSize: '0.8125rem',
                            }}
                        >
                            {formatPrice(post.price)}
                        </Typography>
                    )}
                    <meta itemProp='price' content={String(finalPrice)} />
                    <meta itemProp='priceCurrency' content='ILS' />
                    <meta
                        itemProp='availability'
                        content={
                            isOutOfStock
                                ? 'https://schema.org/OutOfStock'
                                : 'https://schema.org/InStock'
                        }
                    />
                </Stack>

                {/* description */}
                {post.description && (
                    <Typography
                        variant='body2'
                        sx={{
                            mt: 0.75,
                            fontSize: '0.8125rem',
                            color: 'text.secondary',
                            lineHeight: 1.6,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {post.description}
                    </Typography>
                )}

                {/* meta row */}
                <Stack
                    direction='row'
                    alignItems='center'
                    flexWrap='wrap'
                    columnGap={1.5}
                    rowGap={0.25}
                    sx={{ mt: 1, color: 'text.disabled' }}
                >
                    {post.location && (
                        <Stack
                            direction='row'
                            alignItems='center'
                            spacing={0.25}
                        >
                            <LocationOn sx={{ fontSize: 14 }} />
                            <Typography
                                variant='caption'
                                sx={{ fontSize: '0.72rem' }}
                            >
                                {post.location}
                            </Typography>
                        </Stack>
                    )}
                    <Stack direction='row' alignItems='center' spacing={0.25}>
                        <AccessTimeRounded sx={{ fontSize: 13 }} />
                        <Typography
                            variant='caption'
                            sx={{ fontSize: '0.72rem' }}
                        >
                            {formatTimeAgo(String(post.createdAt), t) || ''}
                        </Typography>
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={0.25}>
                        <VisibilityRounded sx={{ fontSize: 13 }} />
                        <Typography
                            variant='caption'
                            sx={{ fontSize: '0.72rem' }}
                        >
                            {post.views || 0}
                        </Typography>
                    </Stack>
                </Stack>
            </Box>

            {/* ── SELLER ── */}
            <Box
                sx={{
                    px: 2,
                    py: 1.25,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    borderTop: '1px dashed',
                    borderColor: 'divider',
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
                        gap: 8,
                        minWidth: 0,
                        flex: 1,
                    }}
                >
                    <Avatar
                        src={post.seller?.image?.url}
                        alt={sellerName}
                        imgProps={{
                            referrerPolicy: 'no-referrer',
                            onError: (e) => {
                                e.currentTarget.src = '/default-avatar.png';
                            },
                        }}
                        sx={{
                            width: 34,
                            height: 34,
                            border: '2px solid',
                            borderColor: '#B8860B',
                        }}
                    />

                    <Typography
                        noWrap
                        sx={{
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            color: 'text.primary',
                            '&:hover': { textDecoration: 'underline' },
                        }}
                    >
                        {sellerName}
                    </Typography>
                    <Box sx={{ minWidth: 0 }}>
                        <Stack
                            direction='row'
                            alignItems='center'
                            spacing={0.25}
                        >
                            <StarRoundedIcon
                                sx={{
                                    fontSize: 14,
                                    color:
                                        postRatingsCount > 0
                                            ? '#B8860B'
                                            : 'text.disabled',
                                }}
                            />
                            <Typography
                                variant='caption'
                                sx={{
                                    fontSize: '0.72rem',
                                    fontWeight: 600,
                                    color: 'text.secondary',
                                }}
                            >
                                {postRatingsCount > 0
                                    ? postRating.toFixed(1)
                                    : '—'}
                            </Typography>
                            {postRatingsCount > 0 && (
                                <Typography
                                    variant='caption'
                                    sx={{
                                        fontSize: '0.68rem',
                                        color: 'text.disabled',
                                    }}
                                >
                                    ({postRatingsCount})
                                </Typography>
                            )}
                        </Stack>
                    </Box>
                </Link>

                {!isOwnPost && (
                    <Tooltip title={t('postCard.waze')}>
                        <IconButton
                            component='a'
                            href={`https://waze.com/ul?q=${encodeURIComponent(post.location || '')}&navigate=yes`}
                            target='_blank'
                            rel='noopener noreferrer'
                            aria-label={t('postCard.waze')}
                            sx={{
                                width: 34,
                                height: 34,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: '10px',
                            }}
                        >
                            <img src='/waze.png' width={16} alt='waze' />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* ── CONTACT ── */}
            {!isOwnPost && (
                <Box sx={{ px: 2, pb: 1.5 }}>
                    <Button
                        fullWidth
                        disableElevation
                        startIcon={
                            <ChatBubbleOutline
                                sx={{ fontSize: '16px !important' }}
                            />
                        }
                        onClick={handleContactClick}
                        sx={{
                            height: 38,
                            borderRadius: '10px',
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            color: '#fff',
                            background: GRADIENT,
                            '&:hover': {
                                background: GRADIENT,
                                filter: 'brightness(1.1)',
                            },
                        }}
                    >
                        {t('common.contact')}
                    </Button>
                </Box>
            )}

            {/* ── ACTIONS ── */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'stretch',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Box
                    sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}
                >
                    <LikeButton
                        product={post}
                        setProduct={setProduct}
                        onLikeToggle={onLikeToggle}
                    />
                </Box>

                <Divider orientation='vertical' flexItem />

                <Button
                    fullWidth
                    onClick={() => navigate(productUrl)}
                    startIcon={
                        <ChatBubbleOutline
                            sx={{ fontSize: '16px !important' }}
                        />
                    }
                    sx={{
                        flex: 1,
                        py: 1,
                        gap: 0.5,
                        borderRadius: 0,
                        textTransform: 'none',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        color: 'text.secondary',
                        '&:hover': {
                            bgcolor: 'action.hover',
                            color: 'text.primary',
                        },
                    }}
                >
                    {commentsCount > 0 ? commentsCount : t('review.comments')}
                </Button>

                <Divider orientation='vertical' flexItem />

                <Button
                    fullWidth
                    onClick={() => setIsBookmarked((v) => !v)}
                    aria-pressed={isBookmarked}
                    startIcon={
                        isBookmarked ? (
                            <Bookmark sx={{ fontSize: '16px !important' }} />
                        ) : (
                            <BookmarkBorder
                                sx={{ fontSize: '16px !important' }}
                            />
                        )
                    }
                    sx={{
                        flex: 1,
                        py: 1,
                        gap: 0.5,
                        borderRadius: 0,
                        textTransform: 'none',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        color: isBookmarked ? 'primary.main' : 'text.secondary',
                        '&:hover': { bgcolor: 'action.hover' },
                    }}
                >
                    {t('postCard.save')}
                </Button>
            </Box>

            {/* ── MENU ── */}
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
                slotProps={{
                    paper: {
                        sx: {
                            borderRadius: '12px',
                            border: '1px solid',
                            borderColor: 'divider',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            minWidth: 170,
                        },
                    },
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem
                    onClick={handleShare}
                    sx={{ fontSize: '0.8125rem', gap: 1 }}
                >
                    <ShareIcon sx={{ fontSize: 16 }} />
                    {t('postCard.share')}
                </MenuItem>

                <MenuItem sx={{ fontSize: '0.8125rem', gap: 1 }}>
                    <ReportButton
                        targetId={post._id as string}
                        type='post'
                        showLabel
                    />
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
                        <EditIcon sx={{ fontSize: 16 }} />
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
        </Card>
    );
};

export default PostCard;
