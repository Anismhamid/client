import { FunctionComponent, useEffect, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Paper,
    Typography,
    alpha,
    useTheme,
} from '@mui/material';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { BaseUser } from '../../../interfaces/chat/chatUser';
import { Posts, SellerUser } from '../../../interfaces/Posts';
import { getCustomerProfileBySlug } from '../../../services/usersServices';
import { getCustomerProfilePostsBySlug } from '../../../services/postsServices';
import { getPostUrl } from '../products/helpers/postUrl';
import { path } from '../../../routes/routes';

interface ChatSidePanelProps {
    user: BaseUser;
}

const MAX_POSTS = 4;

const ChatSidePanelInner: FunctionComponent<ChatSidePanelProps> = ({
    user,
}) => {
    const { t } = useTranslation();
    const theme = useTheme();

    const slug = user.slug;

    const [profile, setProfile] = useState<SellerUser | null>(null);
    const [posts, setPosts] = useState<Posts[]>([]);
    const [loading, setLoading] = useState(Boolean(slug));

    // ======================================================
    // LOAD PROFILE + POSTS
    // (setState only inside callbacks; the component remounts
    // per user via key, so state starts fresh)
    // ======================================================

    useEffect(() => {
        if (!slug) {
            return;
        }

        let cancelled = false;

        Promise.all([
            getCustomerProfileBySlug(slug),
            getCustomerProfilePostsBySlug(slug),
        ])
            .then(([profileData, postsData]) => {
                if (cancelled) return;

                setProfile(profileData ?? null);
                setPosts(postsData ?? []);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [slug]);

    // ======================================================
    // DERIVED
    // ======================================================

    const display = profile ?? user;

    const fullName =
        `${display.name?.first ?? ''} ${display.name?.last ?? ''}`.trim() ||
        'User';

    const joinedAt = profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
          })
        : null;

    // Public view: hide pending / rejected posts
    const visiblePosts = posts.filter(
        (post) => !post.status || post.status === 'accepted',
    );

    const profileLink = slug
        ? path.CustomerProfile.replace(':slug', slug)
        : null;

    const isOnline = Boolean(user.status);

    const tips = [
        t(
            'messages.safety.tip1',
            'لا تدفع مقدماً قبل ما تشوف المنتج وتتأكد منه.',
        ),
        t('messages.safety.tip2', 'التقِ بمكان عام ومعروف.'),
        t(
            'messages.safety.tip3',
            'لا تشارك كلمات المرور أو رموز التحقق مع أي شخص.',
        ),
        t(
            'messages.safety.tip4',
            'إذا شككت بشي، استخدم خيار الإبلاغ من قائمة المحادثة.',
        ),
    ];

    // ======================================================
    // RENDER
    // ======================================================

    return (
        <Box
            sx={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                p: { xs: 1.5, md: 2.5 },
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            {/* ================================================= */}
            {/* PROFILE CARD */}
            {/* ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 1,
                }}
            >
                <Avatar
                    src={display.image?.url}
                    alt={fullName}
                    sx={{
                        width: 72,
                        height: 72,
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    }}
                >
                    {fullName.charAt(0).toUpperCase()}
                </Avatar>

                <Typography variant='h6' sx={{ fontWeight: 700 }}>
                    {fullName}
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                    }}
                >
                    <Box
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: isOnline ? 'success.main' : 'error.main',
                        }}
                    />
                    <Typography
                        variant='caption'
                        sx={{
                            color: isOnline ? 'success.main' : 'error.main',
                        }}
                    >
                        {isOnline ? t('online') : t('offline')}
                    </Typography>
                </Box>

                {joinedAt && (
                    <Typography variant='caption' color='text.secondary'>
                        {t('messages.panel.memberSince', 'عضو منذ')} {joinedAt}
                    </Typography>
                )}

                {profileLink && (
                    <Button
                        component={Link}
                        to={profileLink}
                        size='small'
                        variant='outlined'
                        sx={{ mt: 0.5, borderRadius: 2 }}
                    >
                        {t('messages.panel.viewProfile', 'عرض الملف الشخصي')}
                    </Button>
                )}
            </Paper>

            {/* ================================================= */}
            {/* SELLER POSTS */}
            {/* ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 1.5,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.75,
                        }}
                    >
                        <StorefrontOutlinedIcon
                            fontSize='small'
                            sx={{ color: 'primary.main' }}
                        />

                        <Typography
                            variant='subtitle2'
                            sx={{ fontWeight: 700 }}
                        >
                            {t('messages.panel.sellerPosts', 'إعلانات البائع')}
                        </Typography>
                    </Box>

                    {visiblePosts.length > MAX_POSTS && profileLink && (
                        <Button
                            component={Link}
                            to={profileLink}
                            size='small'
                        >
                            {t('messages.panel.viewAll', 'عرض الكل')} (
                            {visiblePosts.length})
                        </Button>
                    )}
                </Box>

                {loading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            py: 3,
                        }}
                    >
                        <CircularProgress
                            aria-label={t('common.loading', 'جاري التحميل')}
                            size={22}
                        />
                    </Box>
                ) : visiblePosts.length === 0 ? (
                    <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ py: 1 }}
                    >
                        {t(
                            'messages.panel.noPosts',
                            'لا توجد إعلانات فعّالة لهذا المستخدم.',
                        )}
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                        }}
                    >
                        {visiblePosts.slice(0, MAX_POSTS).map((post) => (
                            <Box
                                key={post._id}
                                component={Link}
                                to={getPostUrl({
                                    _id: post._id,
                                    product_name: post.product_name,
                                    category: post.category,
                                    seller: { slug },
                                })}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    p: 1,
                                    borderRadius: 2,
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    transition: 'background-color 0.15s',
                                    '&:hover': {
                                        bgcolor: alpha(
                                            theme.palette.primary.main,
                                            0.06,
                                        ),
                                    },
                                }}
                            >
                                <Avatar
                                    variant='rounded'
                                    src={post.image?.url}
                                    alt={post.product_name}
                                    sx={{ width: 56, height: 56 }}
                                >
                                    {post.product_name?.charAt(0)}
                                </Avatar>

                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                    <Typography
                                        variant='body2'
                                        noWrap
                                        sx={{ fontWeight: 600 }}
                                    >
                                        {post.product_name}
                                    </Typography>

                                    <Typography
                                        variant='caption'
                                        sx={{
                                            color: 'primary.main',
                                            fontWeight: 700,
                                        }}
                                    >
                                        {post.price?.toLocaleString()} ₪
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </Paper>

            {/* ================================================= */}
            {/* SAFETY TIPS */}
            {/* ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.4)}`,
                    bgcolor: alpha(theme.palette.warning.main, 0.06),
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.75,
                        mb: 1,
                    }}
                >
                    <ShieldOutlinedIcon
                        fontSize='small'
                        sx={{ color: 'warning.main' }}
                    />

                    <Typography variant='subtitle2' sx={{ fontWeight: 700 }}>
                        {t('messages.safety.title', 'نصائح للتعامل الآمن')}
                    </Typography>
                </Box>

                <Box
                    component='ul'
                    sx={{
                        m: 0,
                        ps: 2.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                    }}
                >
                    {tips.map((tip) => (
                        <Typography
                            key={tip}
                            component='li'
                            variant='body2'
                            color='text.secondary'
                        >
                            {tip}
                        </Typography>
                    ))}
                </Box>
            </Paper>
        </Box>
    );
};

// key remounts the panel when the other user changes,
// so state starts fresh without resetting it inside an effect.
const ChatSidePanel: FunctionComponent<ChatSidePanelProps> = (props) => (
    <ChatSidePanelInner key={props.user._id} {...props} />
);

export default ChatSidePanel;