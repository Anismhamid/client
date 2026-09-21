import {
    alpha,
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    IconButton,
    Rating,
    Stack,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import { m } from 'framer-motion';
import { FunctionComponent } from 'react';
import {
    Share,
    Phone,
    LocationOn,
    VerifiedUser,
    Storefront,
    WhatsApp,
    ChatBubble,
    ArrowRight,
    ArrowLeft,
    CalendarMonth,
} from '@mui/icons-material';
import { NavigateFunction } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, UserMessage } from '../../../interfaces/chat/usersMessages';
import { Stats } from './types/states';
import { useUser } from '../../../hooks/useUSer';
import RoleType from '../../../interfaces/UserType';
import { showError } from '../../../atoms/toasts/ReactToast';
import { useChatWindow } from '../../../context/ChatWindowContext';
import { formatDate } from '../../../helpers/dateAndPriceFormat';
import { path } from '../../../routes/routes';

const BRAND_GOLD = '#B8860B';
const BRAND_BROWN = '#8B4513';
const BRAND_GRADIENT = `linear-gradient(135deg, ${BRAND_GOLD} 0%, ${BRAND_BROWN} 100%)`;

interface CustomerProfileHeaderProps {
    handleShareProfile: () => void;
    handleWhatsApp: () => void;
    navigate: NavigateFunction;
    user: User;
    slug: string;
    stats: Stats;
    dir: 'ltr' | 'rtl';
}

const CustomerProfileHeader: FunctionComponent<CustomerProfileHeaderProps> = ({
    handleShareProfile,
    handleWhatsApp,
    navigate,
    user,
    slug,
    stats,
    dir,
}) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const { auth } = useUser();
    const { openChat } = useChatWindow();
    const isRtl = dir === 'rtl';

    const fullName =
        `${user.name?.first || ''} ${user.name?.last || ''}`.trim() ||
        t('unknownUser');

    const handleOpenChat = () => {
        if (!auth?._id) {
            navigate(path.Login);
            return;
        }
        if (!user?._id) {
            showError('لا يمكن فتح المحادثة، المستخدم غير متوفر');
            return;
        }
        openChat(user as UserMessage);
    };

    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card
                elevation={0}
                sx={{
                    mb: 4,
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                    bgcolor: 'background.paper',
                }}
            >
                {/* === غلاف علوي متدرج === */}
                <Box
                    sx={{
                        position: 'relative',
                        height: { xs: 120, md: 160 },
                        background: BRAND_GRADIENT,
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            background:
                                'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.18), transparent 55%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.12), transparent 50%)',
                        },
                    }}
                >
                    {/* زر الرجوع فوق الغلاف */}
                    <IconButton
                        onClick={() => navigate(-1)}
                        aria-label={t('common.back')}
                        sx={{
                            position: 'absolute',
                            top: 12,
                            insetInlineStart: 12,
                            zIndex: 2,
                            color: '#fff',
                            bgcolor: alpha('#000', 0.18),
                            backdropFilter: 'blur(6px)',
                            '&:hover': { bgcolor: alpha('#000', 0.32) },
                        }}
                    >
                        {isRtl ? <ArrowRight /> : <ArrowLeft />}
                    </IconButton>

                    {/* زر المشاركة فوق الغلاف */}
                    <Tooltip title={t('common.shareProfile')}>
                        <IconButton
                            onClick={handleShareProfile}
                            aria-label={t('common.shareProfile')}
                            sx={{
                                position: 'absolute',
                                top: 12,
                                insetInlineEnd: 12,
                                zIndex: 2,
                                color: '#fff',
                                bgcolor: alpha('#000', 0.18),
                                backdropFilter: 'blur(6px)',
                                '&:hover': { bgcolor: alpha('#000', 0.32) },
                            }}
                        >
                            <Share fontSize='small' />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* === جسم الكارد === */}
                <CardContent
                    sx={{
                        px: { xs: 2.5, md: 4 },
                        pb: { xs: 3, md: 4 },
                        pt: 0,
                        '&:last-child': { pb: { xs: 3, md: 4 } },
                    }}
                >
                    <Grid container spacing={2}>
                        {/* الصورة — تتداخل مع الغلاف */}
                        <Grid size={{ xs: 12, md: 'auto' }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: {
                                        xs: 'center',
                                        md: 'flex-start',
                                    },
                                    mt: { xs: -8, md: -9 },
                                }}
                            >
                                <Badge
                                    overlap='circular'
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: isRtl ? 'left' : 'right',
                                    }}
                                    badgeContent={
                                        <Tooltip
                                            title={t('common.verifiedSeller')}
                                        >
                                            <Box
                                                sx={{
                                                    width: 34,
                                                    height: 34,
                                                    borderRadius: '50%',
                                                    bgcolor: 'background.paper',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: 2,
                                                    border: `2px solid ${BRAND_GOLD}`,
                                                }}
                                            >
                                                <VerifiedUser
                                                    sx={{
                                                        color: BRAND_GOLD,
                                                        fontSize: 22,
                                                    }}
                                                />
                                            </Box>
                                        </Tooltip>
                                    }
                                >
                                    <Avatar
                                        src={user.image?.url}
                                        alt={fullName}
                                        sx={{
                                            width: { xs: 120, md: 150 },
                                            height: { xs: 120, md: 150 },
                                            border: `5px solid ${theme.palette.background.paper}`,
                                            boxShadow: theme.shadows[4],
                                            background: BRAND_GRADIENT,
                                            fontSize: '2.25rem',
                                            fontWeight: 800,
                                            transition: 'transform 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.03)',
                                            },
                                        }}
                                    >
                                        {user.name?.first
                                            ?.charAt(0)
                                            .toUpperCase()}
                                        {user.name?.last
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </Avatar>
                                </Badge>
                            </Box>
                        </Grid>

                        {/* المعلومات */}
                        <Grid size={{ xs: 12, md: 6 }} sx={{ minWidth: 0 }}>
                            <Box
                                sx={{
                                    mt: { xs: 1, md: 2 },
                                    textAlign: { xs: 'center', md: 'start' },
                                }}
                            >
                                <Stack
                                    direction='row'
                                    flexWrap='wrap'
                                    alignItems='center'
                                    justifyContent={{
                                        xs: 'center',
                                        md: 'flex-start',
                                    }}
                                    spacing={1}
                                    useFlexGap
                                    sx={{ mb: 0.5 }}
                                >
                                    <Typography
                                        variant='h4'
                                        fontWeight={800}
                                        sx={{
                                            letterSpacing: '-0.5px',
                                            lineHeight: 1.2,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {fullName}
                                    </Typography>
                                    {user.role === RoleType.Admin && (
                                        <Chip
                                            label={t('common.admin')}
                                            size='small'
                                            color='warning'
                                            sx={{
                                                fontWeight: 700,
                                                borderRadius: 1.5,
                                            }}
                                        />
                                    )}
                                </Stack>

                                <Stack
                                    direction='row'
                                    alignItems='center'
                                    justifyContent={{
                                        xs: 'center',
                                        md: 'flex-start',
                                    }}
                                    spacing={1}
                                    sx={{ mb: 1.5, color: 'text.secondary' }}
                                >
                                    <Storefront
                                        sx={{
                                            fontSize: 18,
                                            color: BRAND_BROWN,
                                        }}
                                    />
                                    <Typography
                                        variant='body2'
                                        fontWeight={700}
                                        sx={{ color: BRAND_BROWN }}
                                    >
                                        @{slug}
                                    </Typography>
                                </Stack>

                                {/* التقييم */}
                                <Stack
                                    direction='row'
                                    alignItems='center'
                                    justifyContent={{
                                        xs: 'center',
                                        md: 'flex-start',
                                    }}
                                    spacing={1}
                                    sx={{ mb: 2 }}
                                >
                                    <Rating
                                        value={stats.rating || 0}
                                        precision={0.5}
                                        readOnly
                                        size='small'
                                        sx={{ color: BRAND_GOLD }}
                                    />
                                    <Typography
                                        variant='body2'
                                        color='text.secondary'
                                        fontWeight={600}
                                    >
                                        {stats.rating.toFixed(1)}
                                    </Typography>
                                    {stats.reviewsCount > 0 && (
                                        <>
                                            <Divider
                                                orientation='vertical'
                                                flexItem
                                                sx={{ mx: 0.5 }}
                                            />
                                            <Typography
                                                variant='body2'
                                                color='text.secondary'
                                            >
                                                {t('common.reviewsCount', {
                                                    count: stats.reviewsCount,
                                                })}
                                            </Typography>
                                        </>
                                    )}
                                </Stack>

                                {/* معلومات سريعة */}
                                <Stack
                                    direction='row'
                                    flexWrap='wrap'
                                    spacing={1}
                                    useFlexGap
                                    justifyContent={{
                                        xs: 'center',
                                        md: 'flex-start',
                                    }}
                                >
                                    {user.address?.city && (
                                        <Chip
                                            icon={
                                                <LocationOn
                                                    style={{ fontSize: 16 }}
                                                />
                                            }
                                            label={user.address.city}
                                            variant='outlined'
                                            size='small'
                                            sx={{
                                                borderRadius: 2,
                                                borderColor: alpha(
                                                    theme.palette.divider,
                                                    0.9,
                                                ),
                                                bgcolor: alpha(
                                                    theme.palette.background
                                                        .default,
                                                    0.4,
                                                ),
                                            }}
                                        />
                                    )}
                                    {user.phone?.phone_1 && (
                                        <Chip
                                            icon={
                                                <Phone
                                                    style={{ fontSize: 16 }}
                                                />
                                            }
                                            label={user.phone.phone_1}
                                            variant='outlined'
                                            size='small'
                                            sx={{
                                                borderRadius: 2,
                                                borderColor: alpha(
                                                    theme.palette.divider,
                                                    0.9,
                                                ),
                                                bgcolor: alpha(
                                                    theme.palette.background
                                                        .default,
                                                    0.4,
                                                ),
                                            }}
                                        />
                                    )}
                                    {user.createdAt && (
                                        <Chip
                                            icon={
                                                <CalendarMonth
                                                    style={{ fontSize: 16 }}
                                                />
                                            }
                                            label={formatDate(user.createdAt)}
                                            variant='outlined'
                                            size='small'
                                            sx={{
                                                borderRadius: 2,
                                                borderColor: alpha(
                                                    theme.palette.divider,
                                                    0.9,
                                                ),
                                                bgcolor: alpha(
                                                    theme.palette.background
                                                        .default,
                                                    0.4,
                                                ),
                                            }}
                                        />
                                    )}
                                </Stack>
                            </Box>
                        </Grid>

                        {/* أزرار التواصل */}
                        <Grid size={{ xs: 12, md: 'auto' }}>
                            <Stack
                                direction={{ xs: 'row', md: 'column' }}
                                spacing={1}
                                sx={{
                                    mt: { xs: 2, md: 2 },
                                    minWidth: { md: 200 },
                                    justifyContent: 'center',
                                }}
                            >
                                <Button
                                    variant='contained'
                                    fullWidth
                                    startIcon={<ChatBubble />}
                                    onClick={handleOpenChat}
                                    sx={{
                                        fontWeight: 700,
                                        borderRadius: 2.5,
                                        py: 1.1,
                                        gap: 1,
                                        textTransform: 'none',
                                        background: BRAND_GRADIENT,
                                        boxShadow: `0 6px 16px ${alpha(BRAND_GOLD, 0.25)}`,
                                        '&:hover': {
                                            background: BRAND_GRADIENT,
                                            boxShadow: `0 8px 22px ${alpha(BRAND_GOLD, 0.35)}`,
                                        },
                                    }}
                                >
                                    {t('common.contactViaPlatform')}
                                </Button>

                                <Button
                                    variant='outlined'
                                    fullWidth
                                    color='success'
                                    startIcon={<WhatsApp />}
                                    onClick={handleWhatsApp}
                                    sx={{
                                        fontWeight: 700,
                                        borderRadius: 2.5,
                                        py: 1.1,
                                        gap: 1,
                                        textTransform: 'none',
                                        borderWidth: 1.5,
                                        '&:hover': { borderWidth: 1.5 },
                                    }}
                                >
                                    {t('common.whatsapp')}
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </m.div>
    );
};

export default CustomerProfileHeader;
