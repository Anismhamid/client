import { FunctionComponent } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import {
    Box,
    IconButton,
    Typography,
    Container,
    Card,
    CardContent,
    Grid,
    Paper,
    Button,
    useTheme,
    alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Groups as GroupsIcon,
    Security as SecurityIcon,
    LocationOn as LocationIcon,
    Diversity3 as DiversityIcon,
    Sell as SellIcon,
    Storefront as StorefrontIcon,
    ThumbUp as ThumbUpIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const About: FunctionComponent = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const theme = useTheme();

    // تحسين الألوان لتتناسب مع الـ theme
    const features = [
        {
            icon: <GroupsIcon sx={{ fontSize: 40 }} />,
            title: t('pages.about.what-we-are.safqa'),
            description: t('pages.about.what-we-are.subtitle'),
            color: theme.palette.primary.main,
        },
        {
            icon: <SellIcon sx={{ fontSize: 40 }} />,
            title: t('pages.about.buy-and-sell.title'),
            description: t('pages.about.buy-and-sell.subtitle'),
            color: theme.palette.success.main,
        },
        {
            icon: <StorefrontIcon sx={{ fontSize: 40 }} />,
            title: t('pages.about.what-we-have.title'),
            description: t('pages.about.what-we-have.subtitle'),
            color: theme.palette.warning.main,
        },
        {
            icon: <SecurityIcon sx={{ fontSize: 40 }} />,
            title: t('pages.about.control.title'),
            description: t('pages.about.control.subtitle'),
            color: theme.palette.secondary.main,
        },
        {
            icon: <ThumbUpIcon sx={{ fontSize: 40 }} />,
            title: t('pages.about.trust.title'),
            description: t('pages.about.trust.subtitle'),
            color: theme.palette.info.main,
        },
        {
            icon: <DiversityIcon sx={{ fontSize: 40 }} />,
            title: t('pages.about.why-register.title'),
            description: t('pages.about.why-register.subtitle'),
            color: theme.palette.error.main,
        },
        {
            icon: <LocationIcon sx={{ fontSize: 40 }} />,
            title: t('pages.about.locations.title'),
            description: t('pages.about.locations.subtitle'),
            color: theme.palette.warning.dark,
        },
    ];

    const teamMembers = [
        {
            name: t('pages.about.teamMembers.anis.name'),
            role: t('pages.about.teamMembers.anis.role'),
        },
        {
            name: t('pages.about.teamMembers.sara.name'),
            role: t('pages.about.teamMembers.sara.role'),
        },
        {
            name: t('pages.about.teamMembers.mohammed.name'),
            role: t('pages.about.teamMembers.mohammed.role'),
        },
        {
            name: t('pages.about.teamMembers.fatima.name'),
            role: t('pages.about.teamMembers.fatima.role'),
        },
    ];

    const faqItems = [
        {
            q: t('pages.about.faqItems.sell.question'),
            a: t('pages.about.faqItems.sell.answer'),
        },
        {
            q: t('pages.about.faqItems.fees.question'),
            a: t('pages.about.faqItems.fees.answer'),
        },
        {
            q: t('pages.about.faqItems.safety.question'),
            a: t('pages.about.faqItems.safety.answer'),
        },
        {
            q: t('pages.about.faqItems.return.question'),
            a: t('pages.about.faqItems.return.answer'),
        },
    ];

    const currentUrl = `${window.location.origin}/about`;
    return (
        <>
            <link rel='canonical' href={currentUrl} />
            <title>{t('pages.about.title')} | صفقة</title>
            <meta name='description' content={t('pages.about.subtitle')} />
            <meta property='og:title' content={t('pages.about.title')} />
            <meta
                property='og:description'
                content={t('pages.about.subtitle')}
            />
            <meta property='og:type' content='website' />

            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: theme.palette.background.default,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative Elements - محسنة لتتناسب مع الـ theme */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: -100,
                        right: -100,
                        width: 300,
                        height: 300,
                        borderRadius: '50%',
                        background: alpha(theme.palette.primary.main, 0.05),
                        zIndex: 0,
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -100,
                        left: -100,
                        width: 400,
                        height: 400,
                        borderRadius: '50%',
                        background: alpha(theme.palette.secondary.main, 0.05),
                        zIndex: 0,
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600,
                        height: 600,
                        borderRadius: '50%',
                        background: alpha(theme.palette.primary.main, 0.02),
                        zIndex: 0,
                    }}
                />

                <Container
                    maxWidth='lg'
                    sx={{ position: 'relative', zIndex: 1, py: 8 }}
                >
                    {/* Back Button */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <IconButton
                            onClick={() => navigate(-1)}
                            aria-label='back'
                            sx={{
                                mb: 4,
                                bgcolor: theme.palette.background.paper,
                                boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.08)}`,
                                '&:hover': {
                                    bgcolor: alpha(
                                        theme.palette.primary.main,
                                        0.04,
                                    ),
                                    transform: 'translateX(-5px)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <ArrowForwardIcon
                                sx={{ transform: 'rotate(180deg)' }}
                            />
                        </IconButton>
                    </motion.div>

                    {/* Hero Section */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 3, md: 6 },
                                mb: 8,
                                textAlign: 'center',
                                bgcolor:
                                    theme.palette.mode === 'dark'
                                        ? alpha(
                                              theme.palette.background.paper,
                                              0.7,
                                          )
                                        : alpha(
                                              theme.palette.background.paper,
                                              0.9,
                                          ),
                                backdropFilter: 'blur(10px)',
                                borderRadius: 4,
                                border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                            }}
                        >
                            <Typography
                                variant='h1'
                                sx={{
                                    fontWeight: 800,
                                    mb: 3,
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                {t('pages.about.title')}
                            </Typography>

                            <Typography
                                variant='h4'
                                sx={{
                                    mb: 4,
                                    color: theme.palette.text.secondary,
                                    fontWeight: 300,
                                    fontSize: { xs: '1.25rem', md: '1.75rem' },
                                    lineHeight: 1.6,
                                }}
                            >
                                {t('pages.about.subtitle')}
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: 2,
                                    mt: 4,
                                    flexWrap: 'wrap',
                                }}
                            >
                                <Button
                                    variant='contained'
                                    size='large'
                                    onClick={() => navigate('/contact')}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontSize: '1.1rem',
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                                        '&:hover': {
                                            boxShadow: `0 6px 28px ${alpha(theme.palette.primary.main, 0.4)}`,
                                        },
                                    }}
                                >
                                    {t('pages.about.callUs')}
                                </Button>
                                <Button
                                    variant='outlined'
                                    size='large'
                                    onClick={() => navigate('/register')}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 2,
                                        borderWidth: 2,
                                        fontSize: '1.1rem',
                                        borderColor: theme.palette.primary.main,
                                        color: theme.palette.primary.main,
                                        '&:hover': {
                                            borderWidth: 2,
                                            borderColor:
                                                theme.palette.primary.dark,
                                            bgcolor: alpha(
                                                theme.palette.primary.main,
                                                0.04,
                                            ),
                                        },
                                    }}
                                >
                                    {t('pages.about.joinUs')}
                                </Button>
                            </Box>
                        </Paper>
                    </motion.div>

                    {/* Features Grid */}
                    <Grid container spacing={4}>
                        {features.map((feature, index) => (
                            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                    }}
                                    whileHover={{
                                        y: -10,
                                        transition: { duration: 0.2 },
                                    }}
                                >
                                    <Card
                                        sx={{
                                            height: '100%',
                                            borderRadius: 3,
                                            overflow: 'hidden',
                                            position: 'relative',
                                            bgcolor:
                                                theme.palette.background.paper,
                                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.12)}`,
                                                transform: 'translateY(-5px)',
                                                borderColor: alpha(
                                                    feature.color,
                                                    0.3,
                                                ),
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                height: 8,
                                                background: `linear-gradient(90deg, ${feature.color}, ${alpha(feature.color, 0.5)})`,
                                            }}
                                        />
                                        <CardContent
                                            sx={{ p: 4, textAlign: 'center' }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 80,
                                                    height: 80,
                                                    borderRadius: '50%',
                                                    background: alpha(
                                                        feature.color,
                                                        0.08,
                                                    ),
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto 20px',
                                                    color: feature.color,
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        background: alpha(
                                                            feature.color,
                                                            0.15,
                                                        ),
                                                        transform:
                                                            'scale(1.05)',
                                                    },
                                                }}
                                            >
                                                {feature.icon}
                                            </Box>
                                            <Typography
                                                variant='h5'
                                                sx={{
                                                    fontWeight: 700,
                                                    mb: 2,
                                                    color: theme.palette.text
                                                        .primary,
                                                }}
                                            >
                                                {feature.title}
                                            </Typography>
                                            <Typography
                                                variant='body1'
                                                sx={{
                                                    color: theme.palette.text
                                                        .secondary,
                                                    lineHeight: 1.7,
                                                    fontSize: '1.05rem',
                                                }}
                                            >
                                                {feature.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Team Section */}
                    <Box sx={{ mt: 8 }}>
                        <Typography
                            variant='h3'
                            sx={{
                                mb: 4,
                                textAlign: 'center',
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                            }}
                        >
                            {t('pages.about.team')}
                        </Typography>
                        <Grid container spacing={4} justifyContent='center'>
                            {teamMembers.map((member, index) => (
                                <Grid size={{ xs: 6, md: 3 }} key={index}>
                                    <Card
                                        sx={{
                                            textAlign: 'center',
                                            p: 3,
                                            borderRadius: 3,
                                            bgcolor:
                                                theme.palette.background.paper,
                                            border: `1px solid ${alpha(
                                                theme.palette.divider,
                                                0.1,
                                            )}`,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                boxShadow: `0 12px 32px ${alpha(
                                                    theme.palette.common.black,
                                                    0.08,
                                                )}`,
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 120,
                                                height: 120,
                                                borderRadius: '50%',
                                                background: `linear-gradient(
                        135deg,
                        ${theme.palette.primary.main},
                        ${theme.palette.secondary.main}
                    )`,
                                                margin: '0 auto 20px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '3rem',
                                                color: 'white',
                                                fontWeight: 700,
                                                boxShadow: `0 4px 20px ${alpha(
                                                    theme.palette.primary.main,
                                                    0.3,
                                                )}`,
                                            }}
                                        >
                                            {member.name.charAt(0)}
                                        </Box>

                                        <Typography
                                            variant='h6'
                                            sx={{
                                                fontWeight: 700,
                                                color: theme.palette.text
                                                    .primary,
                                            }}
                                        >
                                            {member.name}
                                        </Typography>

                                        <Typography
                                            variant='body2'
                                            color='text.secondary'
                                        >
                                            {member.role}
                                        </Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* FAQ Section */}
                    <Box sx={{ mt: 8 }}>
                        <Typography
                            variant='h3'
                            sx={{
                                mb: 4,
                                textAlign: 'center',
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                            }}
                        >
                            {t('pages.about.faq')}
                        </Typography>
                        <Grid container spacing={3}>
                            {faqItems.map((item, index) => (
                                <Grid size={{ xs: 12, md: 6 }} key={index}>
                                    <Paper
                                        sx={{
                                            p: 3,
                                            borderRadius: 2,
                                            bgcolor:
                                                theme.palette.background.paper,
                                            border: `1px solid ${alpha(
                                                theme.palette.divider,
                                                0.1,
                                            )}`,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                borderColor: alpha(
                                                    theme.palette.primary.main,
                                                    0.2,
                                                ),
                                                boxShadow: `0 4px 16px ${alpha(
                                                    theme.palette.common.black,
                                                    0.04,
                                                )}`,
                                            },
                                        }}
                                    >
                                        <Typography
                                            variant='h6'
                                            sx={{
                                                mb: 2,
                                                color: theme.palette.primary
                                                    .main,
                                                fontWeight: 600,
                                            }}
                                        >
                                            ❓ {item.q}
                                        </Typography>

                                        <Typography
                                            variant='body1'
                                            color='text.secondary'
                                        >
                                            {item.a}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* Stats Section */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                mt: 8,
                                p: { xs: 3, md: 6 },
                                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                                borderRadius: 4,
                                color: 'white',
                                textAlign: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '-50%',
                                    right: '-20%',
                                    width: '60%',
                                    height: '200%',
                                    background: alpha(
                                        theme.palette.common.white,
                                        0.03,
                                    ),
                                    transform: 'rotate(15deg)',
                                    pointerEvents: 'none',
                                },
                            }}
                        >
                            <Typography
                                variant='h3'
                                sx={{
                                    mb: 4,
                                    fontWeight: 700,
                                    position: 'relative',
                                    zIndex: 1,
                                }}
                            >
                                {t('pages.about.stats.title')}
                            </Typography>
                            <Grid container spacing={4} justifyContent='center'>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Box>
                                        <Typography
                                            variant='h2'
                                            sx={{
                                                fontWeight: 800,
                                                position: 'relative',
                                                zIndex: 1,
                                            }}
                                        >
                                            10K+
                                        </Typography>
                                        <Typography
                                            variant='h6'
                                            sx={{
                                                opacity: 0.9,
                                                position: 'relative',
                                                zIndex: 1,
                                            }}
                                        >
                                            {t('pages.about.stats.users')}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Box>
                                        <Typography
                                            variant='h2'
                                            sx={{
                                                fontWeight: 800,
                                                position: 'relative',
                                                zIndex: 1,
                                            }}
                                        >
                                            50K+
                                        </Typography>
                                        <Typography
                                            variant='h6'
                                            sx={{
                                                opacity: 0.9,
                                                position: 'relative',
                                                zIndex: 1,
                                            }}
                                        >
                                            {t('pages.about.stats.products')}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Box>
                                        <Typography
                                            variant='h2'
                                            sx={{
                                                fontWeight: 800,
                                                position: 'relative',
                                                zIndex: 1,
                                            }}
                                        >
                                            95%
                                        </Typography>
                                        <Typography
                                            variant='h6'
                                            sx={{
                                                opacity: 0.9,
                                                position: 'relative',
                                                zIndex: 1,
                                            }}
                                        >
                                            {t(
                                                'pages.about.stats.satisfaction',
                                            )}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6, sm: 3 }}>
                                    <Box>
                                        <Typography
                                            variant='h2'
                                            sx={{
                                                fontWeight: 800,
                                                position: 'relative',
                                                zIndex: 1,
                                            }}
                                        >
                                            24/7
                                        </Typography>
                                        <Typography
                                            variant='h6'
                                            sx={{
                                                opacity: 0.9,
                                                position: 'relative',
                                                zIndex: 1,
                                            }}
                                        >
                                            {t('pages.about.stats.support')}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                    >
                        <Box sx={{ mt: 8, textAlign: 'center' }}>
                            <Typography
                                variant='h3'
                                sx={{
                                    mb: 3,
                                    fontWeight: 700,
                                    color: theme.palette.text.primary,
                                }}
                            >
                                {t('pages.about.cta.title')}
                            </Typography>
                            <Typography
                                variant='h6'
                                sx={{
                                    mb: 4,
                                    color: theme.palette.text.secondary,
                                    maxWidth: 600,
                                    mx: 'auto',
                                    lineHeight: 1.6,
                                }}
                            >
                                {t('pages.about.cta.subtitle')}
                            </Typography>
                            <Button
                                variant='contained'
                                size='large'
                                onClick={() => navigate('/register')}
                                sx={{
                                    px: 6,
                                    py: 2,
                                    borderRadius: 3,
                                    fontSize: '1.2rem',
                                    boxShadow: `0 8px 28px ${alpha(theme.palette.secondary.main, 0.4)}`,
                                    '&:hover': {
                                        boxShadow: `0 12px 36px ${alpha(theme.palette.secondary.main, 0.5)}`,
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {t('pages.about.startFree')}
                            </Button>
                        </Box>
                    </motion.div>
                </Container>
            </Box>
        </>
    );
};

export default About;
