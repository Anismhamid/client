import {
    alpha,
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    Rating,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
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
} from '@mui/icons-material';
import { NavigateFunction } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, UserMessage } from '../../../interfaces/chat/usersMessages';
import { Stats } from './types/states';
import { Posts } from '../../../interfaces/Posts';
import { useUser } from '../../../hooks/useUSer';
import RoleType from '../../../interfaces/UserType';
import { showError } from '../../../atoms/toasts/ReactToast';

// نفس هوية صفقة اللونية المستخدمة في التنبيه وصفحة المنتج
const BRAND_GOLD = '#B8860B';
const BRAND_BROWN = '#8B4513';
const BRAND_GRADIENT = `linear-gradient(90deg, ${BRAND_GOLD}, ${BRAND_BROWN})`;

interface CustomerProfileHeaderProps {
    handleShareProfile: () => void;
    navigate: NavigateFunction;
    user: User;
    slug: string;
    stats: Stats;
    posts: Posts[];
    handleContactSeller: () => void;
    handleWhatsApp: () => void;
    dir: 'ltr' | 'rtl';
}
import { useChatWindow } from '../../../context/ChatWindowContext';

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

    const handleOpenChat = () => {
        if (!auth?._id) {
            navigate('/login');
            return;
        }
        if (!user?._id) {
            showError('لا يمكن فتح المحادثة، المستخدم غير متوفر');
            return;
        }
        openChat(user as UserMessage);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card
                sx={{
                    mb: 4,
                    borderRadius: 4,
                    boxShadow: theme.shadows[2],
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 70%, ${BRAND_GOLD}10 100%)`,
                    position: 'relative',
                    overflow: 'visible',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 6,
                        background: BRAND_GRADIENT,
                        borderRadius: '4px 4px 0 0',
                    },
                }}
            >
                {/* شريط الرجوع */}
                <Box
                    sx={{ p: 2, display: 'flex', justifyContent: 'flex-start' }}
                >
                    <Button
                        size='small'
                        variant='text'
                        startIcon={isRtl ? <ArrowRight /> : <ArrowLeft />}
                        onClick={() => navigate(-1)}
                        aria-label={t('common.back')}
                        sx={{
                            fontWeight: '600',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                transform: isRtl
                                    ? 'translateX(4px)'
                                    : 'translateX(-4px)',
                                backgroundColor: 'transparent',
                                color: BRAND_BROWN,
                            },
                        }}
                    >
                        {t('common.back')}
                    </Button>
                </Box>

                <CardContent
                    sx={{ px: { xs: 3, md: 4 }, pb: { xs: 4, md: 4 }, pt: 0 }}
                >
                    <Grid
                        container
                        spacing={{ xs: 4, md: 2 }}
                        alignItems='center'
                    >
                        {/* الصورة الشخصية */}
                        <Grid
                            size={{ xs: 12, md: 'auto' }}
                            sx={{ display: 'flex', justifyContent: 'center' }}
                        >
                            <Box position='relative'>
                                <Badge
                                    overlap='circular'
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: isRtl ? 'right' : 'left',
                                    }}
                                    badgeContent={
                                        <VerifiedUser
                                            sx={{
                                                color: BRAND_GOLD,
                                                fontSize: 32,
                                                bgcolor: 'background.paper',
                                                borderRadius: '50%',
                                                p: 0.5,
                                                boxShadow: 2,
                                            }}
                                        />
                                    }
                                >
                                    <Avatar
                                        src={user.image?.url}
                                        sx={{
                                            width: { xs: 130, md: 160 },
                                            height: { xs: 130, md: 160 },
                                            border: `4px solid ${theme.palette.background.paper}`,
                                            boxShadow: theme.shadows[4],
                                            background: BRAND_GRADIENT,
                                            fontSize: '2rem',
                                            fontWeight: 'bold',
                                            transition: 'all 0.3s ease-in-out',
                                            '&:hover': {
                                                transform: 'scale(1.04)',
                                                boxShadow: `0 0 20px ${BRAND_GOLD}30`,
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

                        {/* بيانات الملف الشخصي */}
                        <Grid
                            size={{ xs: 12, md: 6 }}
                            sx={{ textAlign: { xs: 'center', md: 'left' } }}
                        >
                            <Typography
                                variant='h4'
                                fontWeight='800'
                                sx={{ mb: 1, letterSpacing: '-0.5px' }}
                            >
                                {`${user.name?.first || ''} ${user.name?.last || ''}`.trim() ||
                                    t('unknownUser')}
                            </Typography>

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
                                sx={{ mb: 2 }}
                            >
                                <Typography
                                    variant='subtitle2'
                                    color='text.secondary'
                                    fontWeight='600'
                                >
                                    {t('common.businessName')}
                                </Typography>
                                <Typography
                                    variant='subtitle2'
                                    fontWeight='700'
                                    sx={{ color: BRAND_BROWN }}
                                >
                                    @{slug}
                                </Typography>
                                <Chip
                                    icon={
                                        <Storefront style={{ fontSize: 16 }} />
                                    }
                                    label='بائع معتمد'
                                    size='small'
                                    sx={{
                                        fontWeight: 'bold',
                                        borderRadius: 1.5,
                                        background: BRAND_GRADIENT,
                                        color: '#fff',
                                        '& .MuiChip-icon': { color: '#fff' },
                                    }}
                                />
                                {user.role === RoleType.Admin && (
                                    <Chip
                                        label='مدير'
                                        size='small'
                                        color='warning'
                                        sx={{
                                            fontWeight: 'bold',
                                            borderRadius: 1.5,
                                        }}
                                    />
                                )}
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
                                sx={{ mb: 2.5 }}
                            >
                                <Rating
                                    value={stats.rating}
                                    precision={0.5}
                                    readOnly
                                    size='small'
                                    sx={{ color: BRAND_GOLD }}
                                />
                                <Typography
                                    variant='caption'
                                    color='text.secondary'
                                    fontWeight='600'
                                >
                                    ({stats.rating} {t('common.outOf')} 5)
                                </Typography>
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
                                {user.phone?.phone_1 && (
                                    <Chip
                                        icon={
                                            <Phone style={{ fontSize: 14 }} />
                                        }
                                        label={user.phone.phone_1}
                                        variant='outlined'
                                        size='small'
                                        sx={{
                                            borderRadius: 1.5,
                                            borderColor: 'divider',
                                        }}
                                    />
                                )}
                                {user.address?.city && (
                                    <Chip
                                        icon={
                                            <LocationOn
                                                style={{ fontSize: 14 }}
                                            />
                                        }
                                        label={user.address.city}
                                        variant='outlined'
                                        size='small'
                                        sx={{
                                            borderRadius: 1.5,
                                            borderColor: 'divider',
                                        }}
                                    />
                                )}
                            </Stack>
                        </Grid>

                        {/* أزرار التواصل */}
                        <Grid size={{ xs: 12, md: 3 }}>
                            <Stack
                                spacing={1}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Button
                                    variant='outlined'
                                    size='small'
                                    disableElevation
                                    startIcon={<ChatBubble />}
                                    fullWidth
                                    onClick={handleOpenChat}
                                    sx={{
                                        fontWeight: 'bold',
                                        borderRadius: 1.5,
                                        py: 1.2,
                                        gap: 1,
                                        // background: BRAND_GRADIENT,
                                        '&:hover': {
                                            opacity: 0.95,
                                        },
                                    }}
                                >
                                    تواصل عبر المنصة
                                </Button>

                                <Button
                                    variant='outlined'
                                    size='small'
                                    fullWidth
                                    color='success'
                                    startIcon={<WhatsApp />}
                                    onClick={handleWhatsApp}
                                    sx={{
                                        fontWeight: 'bold',
                                        py: 1.2,
                                        borderWidth: 1.5,
                                        gap: 1,
                                    }}
                                >
                                    واتساب
                                </Button>

                                {/* <Button
                                    variant='outlined'
                                    size='small'
                                    fullWidth
                                    color='inherit'
                                    startIcon={<Share />}
                                    onClick={handleShareProfile}
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'text.secondary',
                                        borderWidth: 1.5,
                                        gap: 1,
                                    }}
                                >
                                    مشاركة الملف
                                </Button> */}
                                <Button
                                    variant='text'
                                    size='small'
                                    fullWidth
                                    startIcon={<Share sx={{ fontSize: 18 }} />}
                                    onClick={handleShareProfile}
                                    sx={{
                                        fontWeight: 600,
                                        color: 'text.secondary',
                                        py: 1,
                                        borderRadius: 2,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            color: BRAND_BROWN,
                                            bgcolor: alpha(BRAND_GOLD, 0.04),
                                        },
                                    }}
                                >
                                    مشاركة الملف الشخصي
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default CustomerProfileHeader;
