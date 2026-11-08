import { FunctionComponent, MouseEvent, ReactNode, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Avatar,
    Box,
    Button,
    ButtonBase,
    Chip,
    IconButton,
    Stack,
    Tooltip,
    Typography,
    alpha,
} from '@mui/material';
import {
    CalendarToday,
    Edit,
    Email,
    Favorite,
    LocationOn,
    Logout,
    Phone,
    Share,
    ShoppingCart,
    Star,
    ThumbUp,
    VerifiedUser,
    WorkspacePremium,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../../helpers/dateAndPriceFormat';
import { path } from '../../../routes/routes';
import { ProfileUser, LevelResult, INK, BRAND_GRADIENT, getCompletionColor, AMBER, DANGER, INK_RAISED, SUCCESS, DISPLAY_FONT, StarRow } from './ProfileShared';


export interface HeroStats {
    posts: number;
    favorites: number;
    likes: number;
    rating: number;
    reviews: number;
}

interface ProfileHeroProps {
    user: ProfileUser;
    isOwner: boolean;
    completion: number;
    level: LevelResult;
    stats: HeroStats;
    onShare: () => void;
    onEdit: () => void;
    onLogout: () => void;
}

const RING = 140;
const STROKE = 6;
const RADIUS = (RING - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const LATTICE = [
    `linear-gradient(180deg, transparent 30%, ${INK} 100%)`,
    'repeating-linear-gradient(45deg, rgba(255,255,255,.08) 0 1px, transparent 1px 16px)',
    'repeating-linear-gradient(-45deg, rgba(255,255,255,.08) 0 1px, transparent 1px 16px)',
    BRAND_GRADIENT,
].join(', ');

const glassSx = {
    bgcolor: alpha(INK, 0.55),
    color: '#fff',
    backdropFilter: 'blur(6px)',
    border: `1px solid ${alpha('#fff', 0.22)}`,
} as const;

interface StatCell {
    key: string;
    icon: ReactNode;
    color: string;
    value: string;
    label: string;
    stars?: number;
    to?: string;
}

const ProfileHero: FunctionComponent<ProfileHeroProps> = ({
    user,
    isOwner,
    completion,
    level,
    stats,
    onShare,
    onEdit,
    onLogout,
}) => {
    const { t } = useTranslation();
    const heroRef = useRef<HTMLDivElement>(null);

    // نحدّث CSS variables مباشرة بدون setState → ما في re-render لكل حركة ماوس
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const el = heroRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        el.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };

    const fullName = `${user.name.first} ${user.name.last}`.trim();
    const handle = user.slug || user.email.split('@')[0];
    const ringPct = isOwner ? completion : 100;
    const ringColor = isOwner ? getCompletionColor(completion) : AMBER;

    const roleLabel =
        user.role === 'Admin'
            ? t('accountMenu.admin')
            : user.role === 'Moderator'
              ? t('accountMenu.moderator')
              : t('accountMenu.client');

    const levelLabel = t(`profile.level.${level.current.id}`, {
        defaultValue: level.current.fallback,
    });

    const shareLabel = t('common.share') as string;
    const logoutLabel = t('logout') as string;

    const cells: StatCell[] = [
        {
            key: 'posts',
            icon: <ShoppingCart />,
            color: AMBER,
            value: String(stats.posts),
            label: t('profile.myPosts'),
            to: user.slug ? `/users/customer/${user.slug}` : undefined,
        },
        ...(isOwner
            ? [
                  {
                      key: 'favorites',
                      icon: <Favorite />,
                      color: DANGER,
                      value: String(stats.favorites),
                      label: t('profile.myFavorites'),
                      to: path.Favorite,
                  } as StatCell,
              ]
            : []),
        {
            key: 'likes',
            icon: <ThumbUp />,
            color: '#60a5fa',
            value: String(stats.likes),
            label: t('profile.likesReceived', {
                defaultValue: 'إعجابات الإعلانات',
            }),
        },
        {
            key: 'rating',
            icon: <Star />,
            color: AMBER,
            value: stats.reviews ? stats.rating.toFixed(1) : '—',
            label: stats.reviews
                ? `${stats.reviews} ${t('profile.reviewsCount', { defaultValue: 'تقييم' })}`
                : t('profile.noReviewsYet', { defaultValue: 'لا تقييمات بعد' }),
            stars: stats.reviews ? stats.rating : undefined,
        },
    ];

    const contacts = [
        user.email && { key: 'email', icon: <Email />, text: user.email },
        user.phone?.phone_1 && {
            key: 'phone',
            icon: <Phone />,
            text: user.phone.phone_1,
        },
        user.address?.city && {
            key: 'address',
            icon: <LocationOn />,
            text: `${user.address.street ? `${user.address.street}، ` : ''}${user.address.city}${
                user.address.houseNumber
                    ? `، ${t('profile.houseNumber', { defaultValue: 'رقم' })} ${user.address.houseNumber}`
                    : ''
            }`,
        },
        user.createdAt && {
            key: 'since',
            icon: <CalendarToday />,
            text: `${t('profile.memberSince')}: ${formatDate(user.createdAt)}`,
        },
    ].filter(Boolean) as { key: string; icon: ReactNode; text: string }[];

    const cellSx = {
        bgcolor: INK_RAISED,
        px: 2,
        py: 2.5,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.75,
        textAlign: 'center',
        color: '#fff',
    } as const;

    return (
        <Box
            ref={heroRef}
            component='section'
            aria-label={fullName || t('profile.title')}
            onMouseMove={handleMouseMove}
            sx={{
                '--mx': '-999px',
                '--my': '-999px',
                position: 'relative',
                borderRadius: '28px',
                bgcolor: INK,
                color: '#fff',
                overflow: 'hidden',
                boxShadow: '0 24px 48px -28px rgba(0,0,0,.65)',
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 'inherit',
                    pointerEvents: 'none',
                    zIndex: 3,
                    border: '1px solid transparent',
                    background:
                        'radial-gradient(220px circle at var(--mx) var(--my), rgb(255,167,38), transparent 80%) border-box',
                    WebkitMask:
                        'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    opacity: 0,
                    transition: 'opacity .25s',
                },
                '&:hover::after': { opacity: 1 },
            }}
        >
            {/* Cover */}
            <Box
                aria-hidden='true'
                sx={{ height: { xs: 112, md: 140 }, background: LATTICE }}
            />

            {/* Top controls */}
            <Chip
                icon={<WorkspacePremium />}
                label={t('profile.membershipCard')}
                size='small'
                sx={{
                    ...glassSx,
                    position: 'absolute',
                    top: 16,
                    insetInlineStart: 16,
                    zIndex: 2,
                    fontWeight: 700,
                    '& .MuiChip-icon': { color: AMBER },
                }}
            />
            <Stack
                direction='row'
                gap={1}
                sx={{ position: 'absolute', top: 12, insetInlineEnd: 16, zIndex: 2 }}
            >
                <Tooltip title={shareLabel}>
                    <IconButton
                        onClick={onShare}
                        size='small'
                        aria-label={shareLabel}
                        sx={{ ...glassSx, '&:hover': { ...glassSx, borderColor: AMBER } }}
                    >
                        <Share fontSize='small' />
                    </IconButton>
                </Tooltip>
                {isOwner && (
                    <Tooltip title={logoutLabel}>
                        <IconButton
                            onClick={onLogout}
                            size='small'
                            aria-label={logoutLabel}
                            sx={{
                                ...glassSx,
                                '&:hover': {
                                    ...glassSx,
                                    borderColor: DANGER,
                                    color: '#fca5a5',
                                },
                            }}
                        >
                            <Logout fontSize='small' />
                        </IconButton>
                    </Tooltip>
                )}
            </Stack>

            {/* Identity */}
            <Box
                sx={{
                    position: 'relative',
                    px: { xs: 3, md: 5 },
                    pb: 3.5,
                    mt: { xs: '-62px', md: '-78px' },
                }}
            >
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'center', sm: 'flex-end' }}
                    gap={{ xs: 2, sm: 3 }}
                >
                    {/* Avatar + completion ring */}
                    <Box
                        sx={{
                            position: 'relative',
                            width: { xs: 124, md: RING },
                            height: { xs: 124, md: RING },
                            flexShrink: 0,
                        }}
                    >
                        <svg
                            viewBox={`0 0 ${RING} ${RING}`}
                            aria-hidden='true'
                            style={{
                                position: 'absolute',
                                inset: 0,
                                width: '100%',
                                height: '100%',
                                transform: 'rotate(-90deg)',
                            }}
                        >
                            <circle
                                cx={RING / 2}
                                cy={RING / 2}
                                r={RADIUS}
                                fill={INK}
                                stroke={alpha('#fff', 0.12)}
                                strokeWidth={STROKE}
                            />
                            <circle
                                cx={RING / 2}
                                cy={RING / 2}
                                r={RADIUS}
                                fill='none'
                                stroke={ringColor}
                                strokeWidth={STROKE}
                                strokeLinecap='round'
                                strokeDasharray={CIRCUMFERENCE}
                                strokeDashoffset={CIRCUMFERENCE * (1 - ringPct / 100)}
                            />
                        </svg>

                        <Box sx={{ position: 'absolute', inset: '7%' }}>
                            <Avatar
                                src={
                                    user.image?.url ||
                                    'https://i.ibb.co/5GzXkwq/user.png'
                                }
                                alt={user.image?.alt || `${user.name.first}'s avatar`}
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    fontSize: 44,
                                    fontWeight: 800,
                                    bgcolor: AMBER,
                                    color: INK,
                                }}
                            >
                                {user.name?.first?.charAt(0).toUpperCase()}
                            </Avatar>
                        </Box>

                        {user.status && (
                            <Tooltip title={t('profile.verifiedAccount')}>
                                <Box
                                    role='img'
                                    aria-label={t('profile.verifiedAccount')}
                                    sx={{
                                        position: 'absolute',
                                        bottom: 6,
                                        insetInlineEnd: 6,
                                        width: 34,
                                        height: 34,
                                        borderRadius: '50%',
                                        display: 'grid',
                                        placeItems: 'center',
                                        bgcolor: SUCCESS,
                                        border: `3px solid ${INK}`,
                                    }}
                                >
                                    <VerifiedUser sx={{ fontSize: 17, color: '#fff' }} />
                                </Box>
                            </Tooltip>
                        )}

                        {isOwner && (
                            <Box
                                aria-label={`${t('profile.complete')}: ${completion}%`}
                                sx={{
                                    position: 'absolute',
                                    bottom: -12,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    px: 1.25,
                                    py: 0.25,
                                    borderRadius: 999,
                                    bgcolor: INK,
                                    border: `1.5px solid ${ringColor}`,
                                    color: ringColor,
                                    fontSize: 12,
                                    fontWeight: 800,
                                    fontVariantNumeric: 'tabular-nums',
                                    lineHeight: 1.6,
                                }}
                            >
                                {completion}%
                            </Box>
                        )}
                    </Box>

                    {/* Name + chips + contact */}
                    <Box
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            pt: { xs: 1, sm: 0 },
                            width: { xs: '100%', sm: 'auto' },
                        }}
                    >
                        <Typography
                            variant='h4'
                            component='h1'
                            sx={{
                                fontFamily: DISPLAY_FONT,
                                fontWeight: 800,
                                lineHeight: 1.2,
                                fontSize: { xs: '1.65rem', md: '2.1rem' },
                                textAlign: { xs: 'center', sm: 'start' },
                                wordBreak: 'break-word',
                            }}
                        >
                            {fullName}
                        </Typography>

                        <Stack
                            direction='row'
                            alignItems='center'
                            flexWrap='wrap'
                            useFlexGap
                            gap={1}
                            sx={{
                                mt: 1,
                                justifyContent: { xs: 'center', sm: 'flex-start' },
                            }}
                        >
                            <Typography
                                variant='body2'
                                sx={{ opacity: 0.8, unicodeBidi: 'isolate' }}
                            >
                                @{handle}
                            </Typography>
                            <Chip
                                label={roleLabel}
                                size='small'
                                sx={{
                                    bgcolor: alpha('#fff', 0.12),
                                    color: 'inherit',
                                    fontWeight: 600,
                                }}
                            />
                            <Chip
                                label={
                                    user.status
                                        ? t('status.active')
                                        : t('status.inActive')
                                }
                                size='small'
                                sx={{
                                    fontWeight: 600,
                                    bgcolor: user.status
                                        ? alpha(SUCCESS, 0.18)
                                        : alpha('#fff', 0.1),
                                    color: user.status ? '#4ade80' : alpha('#fff', 0.8),
                                }}
                            />
                            <Chip
                                icon={<WorkspacePremium />}
                                label={levelLabel}
                                size='small'
                                sx={{
                                    fontWeight: 700,
                                    bgcolor: alpha(level.current.color, 0.16),
                                    color: level.current.color,
                                    border: `1px solid ${alpha(level.current.color, 0.45)}`,
                                    '& .MuiChip-icon': { color: level.current.color },
                                }}
                            />
                        </Stack>

                        {contacts.length > 0 && (
                            <Stack
                                direction='row'
                                flexWrap='wrap'
                                useFlexGap
                                columnGap={2.5}
                                rowGap={0.75}
                                sx={{
                                    mt: 1.75,
                                    justifyContent: { xs: 'center', sm: 'flex-start' },
                                    color: alpha('#fff', 0.78),
                                }}
                            >
                                {contacts.map((c) => (
                                    <Box
                                        key={c.key}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.75,
                                            minWidth: 0,
                                        }}
                                    >
                                        <Box
                                            aria-hidden='true'
                                            sx={{
                                                display: 'flex',
                                                '& svg': { fontSize: 17 },
                                            }}
                                        >
                                            {c.icon}
                                        </Box>
                                        <Typography
                                            variant='body2'
                                            component='bdi'
                                            sx={{ wordBreak: 'break-word' }}
                                        >
                                            {c.text}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </Box>

                    {isOwner && (
                        <Button
                            onClick={onEdit}
                            startIcon={<Edit />}
                            sx={{
                                flexShrink: 0,
                                borderRadius: 999,
                                px: 2.5,
                                py: 1,
                                fontWeight: 800,
                                bgcolor: AMBER,
                                color: INK,
                                '&:hover': { bgcolor: '#e08e00' },
                            }}
                        >
                            {t('profile.editProfile', {
                                defaultValue: 'تعديل بياناتي',
                            })}
                        </Button>
                    )}
                </Stack>
            </Box>

            {/* Stats strip */}
            <Box
                sx={{
                    display: 'grid',
                    gap: '1px',
                    gridTemplateColumns: {
                        xs: `repeat(${cells.length === 4 ? 2 : cells.length}, 1fr)`,
                        sm: `repeat(${cells.length}, 1fr)`,
                    },
                    bgcolor: alpha('#fff', 0.08),
                    borderTop: `1px solid ${alpha('#fff', 0.08)}`,
                }}
            >
                {cells.map((c) => {
                    const inner = (
                        <>
                            <Typography
                                component='p'
                                sx={{
                                    fontFamily: DISPLAY_FONT,
                                    fontWeight: 800,
                                    fontSize: '1.75rem',
                                    lineHeight: 1,
                                    fontVariantNumeric: 'tabular-nums',
                                }}
                            >
                                {c.value}
                            </Typography>
                            {c.stars !== undefined && (
                                <StarRow
                                    value={c.stars}
                                    size={14}
                                    emptyColor='rgba(255,255,255,.22)'
                                />
                            )}
                            <Stack
                                direction='row'
                                alignItems='center'
                                gap={0.75}
                                sx={{ color: alpha('#fff', 0.72) }}
                            >
                                <Box
                                    aria-hidden='true'
                                    sx={{
                                        display: 'flex',
                                        color: c.color,
                                        '& svg': { fontSize: 16 },
                                    }}
                                >
                                    {c.icon}
                                </Box>
                                <Typography variant='caption'>{c.label}</Typography>
                            </Stack>
                        </>
                    );

                    return c.to ? (
                        <ButtonBase
                            key={c.key}
                            component={Link}
                            to={c.to}
                            sx={{
                                ...cellSx,
                                transition: 'background-color .2s',
                                '&:hover': { bgcolor: alpha('#fff', 0.07) },
                            }}
                        >
                            {inner}
                        </ButtonBase>
                    ) : (
                        <Box key={c.key} sx={cellSx}>
                            {inner}
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default ProfileHero;