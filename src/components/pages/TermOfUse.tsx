import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { path } from '../../routes/routes';
import {
    Container,
    Typography,
    Box,
    Paper,
    Divider,
    Link as MuiLink,
    Card,
    CardContent,
    useTheme,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    Chip,
    Avatar,
    Grid,
} from '@mui/material';
import {
    Gavel,
    Security,
    PrivacyTip,
    ContactSupport,
    ArrowBack,
    CheckCircle,
    Warning,
    Info,
    Business,
    LocationOn,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import handleRTL from '../../locales/handleRTL';

const TermOfUse: FunctionComponent = () => {
    const { t } = useTranslation();
    const theme = useTheme();
    const direction = handleRTL();
    const isRTL = direction === 'rtl';

    const currentUrl = 'https://client-qqq1.vercel.app/term-of-use';

    const importantPoints = [
        {
            icon: <CheckCircle color='success' />,
            text: t(
                'pages.terms.importantPoints.age',
                'يجب أن تكون 18+ لاستخدام المنصة',
            ),
            color: theme.palette.success.light,
        },
        {
            icon: <Security color='primary' />,
            text: t(
                'pages.terms.importantPoints.registration',
                'التسجيل مطلوب لنشر الإعلانات',
            ),
            color: theme.palette.primary.light,
        },
        {
            icon: <Warning color='warning' />,
            text: t(
                'pages.terms.importantPoints.c2c',
                'منصة C2C - المستخدمون مسؤولون عن المعاملات',
            ),
            color: theme.palette.warning.light,
        },
        {
            icon: <Info color='info' />,
            text: t(
                'pages.terms.importantPoints.legalAddress',
                'المقر القانوني: السخنين/أم الفحم',
            ),
            color: theme.palette.info.light,
        },
    ];

    const userConductPoints = [
        t(
            'pages.terms.sections.userConduct.points.0',
            'لا تستخدم المنصة لأغراض غير قانونية.',
        ),
        t(
            'pages.terms.sections.userConduct.points.1',
            'لا تنتحل شخصية شخص آخر أو تقدم معلومات كاذبة.',
        ),
        t(
            'pages.terms.sections.userConduct.points.2',
            'لا تقم بتحميل أي أكواد ضارة أو تتداخل مع تشغيل المنصة.',
        ),
        t(
            'pages.terms.sections.userConduct.points.3',
            'لا تحاول الوصول إلى الأنظمة التي لا تملك تصريحاً لاستخدامها.',
        ),
    ];

    return (
        <>
            <link rel='canonical' href={currentUrl} />

            <title>{t('pages.terms.title', 'شروط الاستخدام')} | صفقة</title>

            <meta
                name='description'
                content={t(
                    'pages.terms.description',
                    'شروط وأحكام استخدام منصة صفقة',
                )}
            />

            <Container
                maxWidth='lg'
                sx={{
                    py: 6,
                    direction,
                }}
            >
                {/* Header */}
                <Box textAlign='center' mb={6}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 3,
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                bgcolor: 'primary.main',
                                mb: 2,
                            }}
                        >
                            <Gavel sx={{ fontSize: 40 }} />
                        </Avatar>
                    </Box>

                    <Typography
                        variant='h2'
                        component='h1'
                        gutterBottom
                        color='primary.main'
                        fontWeight='bold'
                        sx={{
                            background:
                                'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        {t('pages.terms.title', 'شروط الاستخدام')}
                    </Typography>

                    <Typography
                        variant='h5'
                        color='text.secondary'
                        paragraph
                        sx={{
                            maxWidth: 700,
                            mx: 'auto',
                        }}
                    >
                        {t(
                            'pages.terms.subtitle',
                            'اقرأ هذه الشروط بعناية قبل استخدام منصة صفقة',
                        )}
                    </Typography>

                    {/* Last Update */}
                    <Box sx={{ mt: 4, mb: 2 }}>
                        <Chip
                            label={t(
                                'pages.terms.lastUpdated',
                                'آخر تحديث: 15/04/2025',
                            )}
                            color='primary'
                            variant='outlined'
                            sx={{
                                fontWeight: 'bold',
                                mb: 2,
                            }}
                        />
                    </Box>

                    {/* Important Points */}
                    <Box
                        display='flex'
                        justifyContent='center'
                        flexWrap='wrap'
                        gap={2}
                        mt={3}
                    >
                        {importantPoints.map((point, index) => (
                            <Card
                                key={index}
                                variant='outlined'
                                sx={{
                                    minWidth: 250,
                                    maxWidth: 300,
                                    borderInlineStart: `4px solid ${point.color}`,
                                    borderRadius: 2,
                                }}
                            >
                                <CardContent
                                    sx={{
                                        py: 2,
                                        px: 3,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                        }}
                                    >
                                        {point.icon}

                                        <Typography
                                            variant='body1'
                                            fontWeight={500}
                                        >
                                            {point.text}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Box>

                <Divider sx={{ mb: 6 }} />

                <Grid container spacing={4}>
                    {/* Main Content */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 4,
                                borderRadius: 3,
                            }}
                        >
                            {/* Section 1 */}
                            <Box mb={5}>
                                <Typography
                                    variant='h4'
                                    gutterBottom
                                    color='primary'
                                    fontWeight='bold'
                                >
                                    <span
                                        style={{
                                            color: theme.palette.primary.main,
                                        }}
                                    >
                                        1.
                                    </span>{' '}
                                    {t(
                                        'pages.terms.sections.eligibility.text',
                                        'You must be 12 years old or older to use the platform. By using the platform, you acknowledge and confirm that you meet these requirements.',
                                    )}
                                </Typography>

                                <Typography
                                    variant='body1'
                                    paragraph
                                    color='text.secondary'
                                    sx={{ lineHeight: 1.8 }}
                                >
                                    {t(
                                        'pages.terms.sections.eligibility.text',
                                        'يجب أن تكون قد بلغت الثامنة عشرة من عمرك لاستخدام المنصة. باستخدامك المنصة، فإنك تُقر وتضمن امتثالك لهذه المتطلبات.',
                                    )}
                                </Typography>
                            </Box>

                            {/* Section 2 */}
                            <Box mb={5}>
                                <Typography
                                    variant='h4'
                                    gutterBottom
                                    color='primary'
                                    fontWeight='bold'
                                >
                                    <span
                                        style={{
                                            color: theme.palette.primary.main,
                                        }}
                                    >
                                        2.
                                    </span>{' '}
                                    {t(
                                        'pages.terms.sections.registration.title',
                                        'التسجيل وإنشاء حساب',
                                    )}
                                </Typography>

                                <Typography
                                    variant='body1'
                                    paragraph
                                    color='text.secondary'
                                    sx={{ lineHeight: 1.8 }}
                                >
                                    {t(
                                        'pages.terms.sections.registration.text',
                                        'يُطلب منك إنشاء حساب لتتمكن من نشر الإعلانات والمنشورات على المنصة. أنت مسؤول عن تزويدنا بمعلومات دقيقة ومحدثة، والحفاظ على سرية كلمة مرورك. نحتفظ بالحق في تعليق أو حذف أي حساب في حال وجود أي نشاط مشبوه أو انتهاك سياسة الخصوصية.',
                                    )}{' '}
                                    <MuiLink
                                        component={Link}
                                        to={path.PrivacyAndPolicy}
                                        color='primary'
                                        underline='hover'
                                        sx={{
                                            mx: 1,
                                            fontWeight: 500,
                                        }}
                                    >
                                        {t(
                                            'pages.terms.sections.registration.privacyPolicy',
                                            'سياسة الخصوصية',
                                        )}
                                    </MuiLink>
                                </Typography>
                            </Box>

                            {/* Section 3 */}
                            <Box mb={5}>
                                <Typography
                                    variant='h4'
                                    gutterBottom
                                    color='primary'
                                    fontWeight='bold'
                                >
                                    <span
                                        style={{
                                            color: theme.palette.primary.main,
                                        }}
                                    >
                                        3.
                                    </span>{' '}
                                    {t(
                                        'pages.terms.sections.products.title',
                                        'المنتجات والإعلانات',
                                    )}
                                </Typography>

                                <Typography
                                    variant='body1'
                                    paragraph
                                    color='text.secondary'
                                    sx={{ lineHeight: 1.8 }}
                                >
                                    {t(
                                        'pages.terms.sections.products.text',
                                        'الأسعار، وتوافر المنتجات، وأوصافها قابلة للتغيير في أي وقت. نحن نعمل كمنصة وسيطة ولا نضمن دقة المعلومات المقدمة في الإعلانات.',
                                    )}
                                </Typography>
                            </Box>

                            {/* Section 4 */}
                            <Box mb={5}>
                                <Typography
                                    variant='h4'
                                    gutterBottom
                                    color='primary'
                                    fontWeight='bold'
                                >
                                    <span
                                        style={{
                                            color: theme.palette.primary.main,
                                        }}
                                    >
                                        4.
                                    </span>{' '}
                                    {t(
                                        'pages.terms.sections.responsibility.title',
                                        'المسؤولية والضمانات',
                                    )}
                                </Typography>

                                <Card
                                    variant='outlined'
                                    sx={{
                                        mb: 3,
                                        mt: 2,
                                    }}
                                >
                                    <CardContent>
                                        <Box
                                            display='flex'
                                            alignItems='center'
                                            mb={2}
                                        >
                                            <Business
                                                color='primary'
                                                sx={{
                                                    mr: isRTL ? 0 : 2,
                                                    ml: isRTL ? 2 : 0,
                                                }}
                                            />

                                            <Typography
                                                variant='h6'
                                                fontWeight='bold'
                                            >
                                                {t(
                                                    'pages.terms.sections.responsibility.platform.title',
                                                    'موقع وطبيعة المنصة',
                                                )}
                                            </Typography>
                                        </Box>

                                        <Typography
                                            variant='body2'
                                            color='text.secondary'
                                        >
                                            {t(
                                                'pages.terms.sections.responsibility.platform.text',
                                                'صفقة هي منصة C2C (من مستخدم إلى مستخدم) تتيح للمستخدمين عرض وشراء المنتجات فيما بينهم مباشرة. نحن لا نخزن أي منتجات ولا نقدم خدمات توصيل أو استلام.',
                                            )}
                                        </Typography>
                                    </CardContent>
                                </Card>

                                <Card variant='outlined' sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Box
                                            display='flex'
                                            alignItems='center'
                                            mb={2}
                                        >
                                            <LocationOn
                                                color='secondary'
                                                sx={{
                                                    mr: isRTL ? 0 : 2,
                                                    ml: isRTL ? 2 : 0,
                                                }}
                                            />

                                            <Typography
                                                variant='h6'
                                                fontWeight='bold'
                                            >
                                                {t(
                                                    'pages.terms.sections.responsibility.legalAddress.title',
                                                    'المقر القانوني',
                                                )}
                                            </Typography>
                                        </Box>

                                        <Typography
                                            variant='body2'
                                            color='text.secondary'
                                        >
                                            <strong>
                                                {t(
                                                    'pages.terms.sections.responsibility.legalAddress.addressLabel',
                                                    'العنوان:',
                                                )}
                                            </strong>{' '}
                                            {t(
                                                'pages.terms.sections.responsibility.legalAddress.address',
                                                'شارع السلام، السخنين/أم الفحم، المنطقة الشمالية، إسرائيل.',
                                            )}
                                            <br />
                                            <strong>
                                                {t(
                                                    'pages.terms.sections.responsibility.legalAddress.noteLabel',
                                                    'ملاحظة:',
                                                )}
                                            </strong>{' '}
                                            {t(
                                                'pages.terms.sections.responsibility.legalAddress.note',
                                                'يُعتبر هذا العنوان العنوان القانوني الرسمي لجميع الإشعارات والمراسلات القانونية.',
                                            )}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>

                            {/* Section 5 */}
                            <Box mb={5}>
                                <Typography
                                    variant='h4'
                                    gutterBottom
                                    color='primary'
                                    fontWeight='bold'
                                >
                                    <span
                                        style={{
                                            color: theme.palette.primary.main,
                                        }}
                                    >
                                        5.
                                    </span>{' '}
                                    {t(
                                        'pages.terms.sections.userConduct.title',
                                        'سلوك المستخدم',
                                    )}
                                </Typography>

                                <Box sx={{ mt: 2 }}>
                                    {userConductPoints.map((item, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                mb: 1.5,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    color: 'error.main',
                                                    mr: isRTL ? 0 : 1,
                                                    ml: isRTL ? 1 : 0,
                                                    mt: 0.5,
                                                }}
                                            >
                                                •
                                            </Box>

                                            <Typography
                                                variant='body1'
                                                color='text.secondary'
                                            >
                                                {item}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>

                                <Typography
                                    variant='body1'
                                    color='text.secondary'
                                    sx={{
                                        mt: 3,
                                        fontStyle: 'italic',
                                    }}
                                >
                                    {t(
                                        'pages.terms.sections.userConduct.warning',
                                        'قد يؤدي انتهاك هذه الشروط إلى الحظر أو اتخاذ إجراء قانوني',
                                    )}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Sidebar */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 4,
                                borderRadius: 3,
                                height: '100%',
                            }}
                        >
                            <Typography
                                variant='h5'
                                gutterBottom
                                fontWeight='bold'
                                color='primary'
                            >
                                {t('pages.terms.sidebar.title', 'روابط مهمة')}
                            </Typography>

                            <List sx={{ mt: 3 }}>
                                <ListItem
                                    component={Link}
                                    to={path.PrivacyAndPolicy}
                                    sx={{
                                        borderRadius: 2,
                                        mb: 1,
                                        '&:hover': {
                                            bgcolor: 'primary.light',
                                            color: 'primary.main',
                                        },
                                    }}
                                >
                                    <ListItemIcon>
                                        <PrivacyTip color='primary' />
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant='h6'
                                                fontWeight='medium'
                                            >
                                                {t(
                                                    'pages.terms.sidebar.privacy',
                                                    'سياسة الخصوصية',
                                                )}
                                            </Typography>
                                        }
                                    />
                                </ListItem>

                                <ListItem
                                    component={Link}
                                    to={path.Contact}
                                    sx={{
                                        borderRadius: 2,
                                        mb: 1,
                                        '&:hover': {
                                            bgcolor: 'primary.light',
                                            color: 'primary.main',
                                        },
                                    }}
                                >
                                    <ListItemIcon>
                                        <ContactSupport color='primary' />
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant='h6'
                                                fontWeight='medium'
                                            >
                                                {t(
                                                    'pages.terms.sidebar.contact',
                                                    'اتصل بنا',
                                                )}
                                            </Typography>
                                        }
                                    />
                                </ListItem>

                                <ListItem
                                    component={Link}
                                    to={path.SafetyHelp}
                                    sx={{
                                        borderRadius: 2,
                                        mb: 1,
                                        '&:hover': {
                                            bgcolor: 'primary.light',
                                            color: 'primary.main',
                                        },
                                    }}
                                >
                                    <ListItemIcon>
                                        <Security color='primary' />
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant='h6'
                                                fontWeight='medium'
                                            >
                                                {t(
                                                    'pages.terms.sidebar.safety',
                                                    'نصائح الأمان',
                                                )}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </List>

                            {/* Questions */}
                            <Box
                                sx={{
                                    mt: 4,
                                    p: 3,
                                    bgcolor: 'grey.50',
                                    borderRadius: 2,
                                }}
                            >
                                <Typography
                                    variant='h6'
                                    gutterBottom
                                    fontWeight='bold'
                                >
                                    {t(
                                        'pages.terms.sidebar.questions.title',
                                        'هل لديك أسئلة؟',
                                    )}
                                </Typography>

                                <Typography
                                    variant='body2'
                                    color='text.secondary'
                                    paragraph
                                >
                                    {t(
                                        'pages.terms.sidebar.questions.text',
                                        'إذا كان لديك أي استفسارات حول شروط الاستخدام، لا تتردد في التواصل معنا.',
                                    )}
                                </Typography>

                                <Button
                                    variant='contained'
                                    fullWidth
                                    component={Link}
                                    to={path.Contact}
                                    startIcon={
                                        isRTL ? undefined : <ContactSupport />
                                    }
                                    endIcon={
                                        isRTL ? <ContactSupport /> : undefined
                                    }
                                >
                                    {t(
                                        'pages.terms.sidebar.questions.button',
                                        'تواصل معنا',
                                    )}
                                </Button>
                            </Box>

                            {/* Back Home */}
                            <Box
                                sx={{
                                    mt: 3,
                                    textAlign: 'center',
                                }}
                            >
                                <Button
                                    variant='outlined'
                                    component={Link}
                                    to='/'
                                    fullWidth
                                    startIcon={
                                        isRTL ? undefined : <ArrowBack />
                                    }
                                    endIcon={isRTL ? <ArrowBack /> : undefined}
                                >
                                    {t(
                                        'pages.terms.sidebar.home',
                                        'العودة للرئيسية',
                                    )}
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Quick Actions */}
                    <Grid size={{ xs: 12 }}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 4,
                                mt: 4,
                                borderRadius: 3,
                            }}
                        >
                            <Typography
                                variant='h5'
                                gutterBottom
                                fontWeight='bold'
                                textAlign='center'
                            >
                                {t(
                                    'pages.terms.actions.title',
                                    'موافق على الشروط؟',
                                )}
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: 3,
                                    mt: 3,
                                    flexWrap: 'wrap',
                                }}
                            >
                                <Button
                                    variant='contained'
                                    size='large'
                                    component={Link}
                                    to={path.Register}
                                    sx={{ minWidth: 200 }}
                                >
                                    {t(
                                        'pages.terms.actions.register',
                                        'إنشاء حساب جديد',
                                    )}
                                </Button>

                                <Button
                                    variant='outlined'
                                    size='large'
                                    component={Link}
                                    to={path.Login}
                                    sx={{ minWidth: 200 }}
                                >
                                    {t(
                                        'pages.terms.actions.login',
                                        'تسجيل الدخول',
                                    )}
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default TermOfUse;
