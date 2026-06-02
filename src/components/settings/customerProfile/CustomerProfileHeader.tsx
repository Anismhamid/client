import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Drawer,
    Grid,
    Rating,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { FunctionComponent, useState } from 'react';
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
import { User } from '../../../interfaces/chat/usersMessages';
import { Stats } from './types/states';
import { Posts } from '../../../interfaces/Posts';
import ChatBoxWrapper from '../../pages/chatBox/ChatBoxWrapper';
import { useUser } from '../../../context/useUSer';
import RoleType from '../../../interfaces/UserType';

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
    const [openChat, setOpenChat] = useState<boolean>(false);
    const { auth } = useUser();

    const isRtl = dir === 'rtl';

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
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 70%, ${theme.palette.primary.light}10 100%)`,
                    position: 'relative',
                    overflow: 'visible', // Prevents inner-content shadows from clipping
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 6,
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        borderRadius: '4px 4px 0 0',
                    },
                }}
            >
                {/* Back Action Bar */}
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
                                color: 'primary.main',
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
                        {/* Profile Photo Display */}
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
                                                color: 'success.main',
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
                                            bgcolor: theme.palette.primary.main,
                                            fontSize: '2rem',
                                            fontWeight: 'bold',
                                            transition: 'all 0.3s ease-in-out',
                                            '&:hover': {
                                                transform: 'scale(1.04)',
                                                boxShadow: `0 0 20px ${theme.palette.primary.main}30`,
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

                        {/* Middle Profile Meta Metadata Data Stack */}
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
                                    color='primary.main'
                                    fontWeight='700'
                                >
                                    @{slug}
                                </Typography>
                                <Chip
                                    icon={
                                        <Storefront style={{ fontSize: 16 }} />
                                    }
                                    label='بائع معتمد'
                                    size='small'
                                    color='primary'
                                    variant='filled' // Custom design variants logic supported if styled
                                    sx={{
                                        fontWeight: 'bold',
                                        borderRadius: 1.5,
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

                            {/* Ratings Block */}
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
                                />
                                <Typography
                                    variant='caption'
                                    color='text.secondary'
                                    fontWeight='600'
                                >
                                    ({stats.rating} {t('common.outOf')} 5)
                                </Typography>
                            </Stack>

                            {/* Quick Context Details */}
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

                        {/* Interactive Engagement Drawer Controls */}
                        <Grid size={{ xs: 12, md: 3.5 }}>
                            <Stack spacing={1.5} sx={{ w: '100%' }}>
                                <Button
                                    variant='contained'
                                    size='large'
                                    disableElevation
                                    startIcon={<ChatBubble />}
                                    fullWidth
                                    onClick={() => setOpenChat(!openChat)}
                                    sx={{
                                        fontWeight: 'bold',
                                        borderRadius: 2.5,
                                        py: 1.2,
                                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        '&:hover': {
                                            opacity: 0.95,
                                        },
                                    }}
                                >
                                    تواصل عبر المنصة
                                </Button>

                                <Button
                                    variant='outlined'
                                    size='large'
                                    fullWidth
                                    color='success'
                                    startIcon={<WhatsApp />}
                                    onClick={handleWhatsApp}
                                    sx={{
                                        fontWeight: 'bold',
                                        borderRadius: 2.5,
                                        py: 1.2,
                                        borderWidth: 1.5,
                                    }}
                                >
                                    واتساب
                                </Button>

                                <Button
                                    variant='text'
                                    size='medium'
                                    fullWidth
                                    color='inherit'
                                    startIcon={<Share />}
                                    onClick={handleShareProfile}
                                    sx={{
                                        fontWeight: '600',
                                        color: 'text.secondary',
                                    }}
                                >
                                    مشاركة الملف
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Platform Messaging Context Overlay Component */}
            <Drawer
                anchor={isRtl ? 'left' : 'right'}
                open={openChat}
                onClose={() => setOpenChat(false)}
                PaperProps={{
                    sx: { width: { xs: '100%', sm: 400, md: 450 } },
                }}
            >
                {auth && openChat && (
                    <ChatBoxWrapper
                        user={{
                            _id: user._id,
                            first: user.name.first,
                            last: user.name.last,
                            from: {
                                _id: user._id,
                                first: user.name.first,
                                last: user.name.last,
                                email: user.email,
                                role: user.role,
                            },
                            to: {
                                _id: auth._id,
                                first: auth.name.first,
                                last: auth.name.last,
                                email: auth.email,
                                role: auth.role,
                            },
                            message: '',
                            messageStatus: 'sent',
                            createdAt: new Date().getTime().toString(),
                            updatedAt: new Date().getTime().toString(),
                        }}
                    />
                )}
            </Drawer>
        </motion.div>
    );
};

export default CustomerProfileHeader;
