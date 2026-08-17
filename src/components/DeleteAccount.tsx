import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Typography,
} from '@mui/material';

import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';


const DeleteAccount: React.FC = () => {
    const navigate = useNavigate();
    const { i18n } = useTranslation();

    const language = useMemo(() => {
        const lang = (i18n.language || 'ar').toLowerCase();

        if (lang.startsWith('he')) return 'he';
        if (lang.startsWith('en')) return 'en';

        return 'ar';
    }, [i18n.language]);

    const isRTL = language === 'ar' || language === 'he';

    const content = {
        ar: {
            title: 'حذف حساب صفقة',
            subtitle:
                'يمكنك حذف حسابك وبياناتك المرتبطة به من تطبيق صفقة في أي وقت.',

            introTitle: 'كيفية حذف حسابك',
            intro:
                'لحذف حسابك بشكل نهائي، سجّل الدخول إلى حسابك في صفقة ثم افتح صفحة الملف الشخصي واتبع خطوات حذف الحساب.',

            stepsTitle: 'خطوات حذف الحساب',

            step1Title: 'تسجيل الدخول',
            step1:
                'سجّل الدخول إلى حساب صفقة باستخدام بيانات تسجيل الدخول الخاصة بك.',

            step2Title: 'فتح الملف الشخصي',
            step2:
                'انتقل إلى صفحة الملف الشخصي الخاصة بك من داخل التطبيق.',

            step3Title: 'اختيار حذف الحساب',
            step3:
                'مرّر إلى قسم "حذف الحساب" واضغط على زر "حذف نهائي".',

            step4Title: 'تأكيد الحذف',
            step4:
                'اقرأ رسالة التأكيد ثم أكّد رغبتك في حذف الحساب نهائيًا.',

            deleteDataTitle: 'البيانات التي يتم حذفها',
            deleteDataIntro:
                'عند حذف حسابك، يتم حذف أو إزالة البيانات المرتبطة بالحساب وفقًا لسياسة صفقة، وقد يشمل ذلك:',

            accountData: 'بيانات الحساب والمعلومات الشخصية المرتبطة به.',
            listings: 'الإعلانات والبيانات المرتبطة بالإعلانات التي أنشأتها.',
            images: 'الصور والوسائط التي أضفتها إلى إعلاناتك.',
            messages:
                'البيانات المرتبطة باستخدام ميزات التواصل والمحادثة، وفقًا لسياسة الاحتفاظ بالبيانات.',

            retainedTitle: 'بيانات قد يتم الاحتفاظ بها',
            retainedText:
                'قد يتم الاحتفاظ ببعض المعلومات لفترة محدودة عندما يكون ذلك مطلوبًا أو مسموحًا به بموجب القانون، أو لأغراض أمنية، أو منع الاحتيال، أو حل النزاعات، أو الالتزام بالمتطلبات القانونية.',

            importantTitle: 'تنبيه',
            importantText:
                'حذف الحساب إجراء نهائي وقد لا يمكن التراجع عنه بعد إتمام عملية الحذف.',

            loginButton: 'تسجيل الدخول وحذف الحساب',
            backButton: 'العودة',
            privacyTitle: 'خصوصية وأمان البيانات',
            privacyText:
                'نحن نتعامل مع بيانات المستخدمين وفقًا لممارسات الخصوصية والأمان المعتمدة في صفقة.',

            supportTitle: 'لا تستطيع الدخول إلى حسابك؟',
            supportText:
                'إذا لم تتمكن من تسجيل الدخول إلى حسابك، استخدم وسيلة التواصل مع دعم صفقة المتاحة داخل التطبيق لطلب حذف حسابك وبياناتك المرتبطة به.',

            footer:
                'صفقة — منصة البيع والشراء بين المستخدمين',
        },

        he: {
            title: 'מחיקת חשבון Safqa',
            subtitle:
                'ניתן למחוק את חשבון Safqa ואת הנתונים המשויכים אליו בכל עת.',

            introTitle: 'כיצד למחוק את החשבון',
            intro:
                'כדי למחוק את החשבון לצמיתות, יש להתחבר לחשבון Safqa, לפתוח את עמוד הפרופיל ולפעול לפי השלבים למחיקת החשבון.',

            stepsTitle: 'שלבים למחיקת החשבון',

            step1Title: 'התחברות',
            step1:
                'התחברו לחשבון Safqa באמצעות פרטי ההתחברות שלכם.',

            step2Title: 'פתיחת הפרופיל',
            step2:
                'עברו לעמוד הפרופיל שלכם בתוך האפליקציה.',

            step3Title: 'בחירת מחיקת החשבון',
            step3:
                'גללו לאזור "מחיקת חשבון" ולחצו על כפתור המחיקה הסופית.',

            step4Title: 'אישור המחיקה',
            step4:
                'קראו את הודעת האישור ואשרו את מחיקת החשבון לצמיתות.',

            deleteDataTitle: 'נתונים שנמחקים',
            deleteDataIntro:
                'בעת מחיקת החשבון, הנתונים המשויכים לחשבון נמחקים או מוסרים בהתאם למדיניות Safqa, ויכללו בין היתר:',

            accountData:
                'פרטי החשבון והמידע האישי המשויך אליו.',
            listings:
                'מודעות ונתונים הקשורים למודעות שיצרתם.',
            images:
                'תמונות ומדיה שהוספתם למודעות.',
            messages:
                'נתונים הקשורים לשימוש בתכונות התקשורת והצ׳אט, בהתאם למדיניות שמירת הנתונים.',

            retainedTitle: 'נתונים שעשויים להישמר',
            retainedText:
                'מידע מסוים עשוי להישמר לתקופה מוגבלת כאשר הדבר נדרש או מותר על פי חוק, לצורכי אבטחה, מניעת הונאה, פתרון מחלוקות או עמידה בדרישות משפטיות.',

            importantTitle: 'חשוב לדעת',
            importantText:
                'מחיקת החשבון היא פעולה סופית וייתכן שלא ניתן יהיה לשחזר את החשבון לאחר השלמת המחיקה.',

            loginButton: 'התחברות ומחיקת החשבון',
            backButton: 'חזרה',
            privacyTitle: 'פרטיות ואבטחת מידע',
            privacyText:
                'אנו מטפלים בנתוני המשתמשים בהתאם לנוהלי הפרטיות והאבטחה של Safqa.',

            supportTitle: 'לא מצליחים להתחבר?',
            supportText:
                'אם אינכם מצליחים להתחבר לחשבון, השתמשו באמצעי יצירת הקשר עם התמיכה של Safqa הזמינים באפליקציה כדי לבקש את מחיקת החשבון והנתונים המשויכים אליו.',

            footer:
                'Safqa — פלטפורמה למכירה וקנייה בין משתמשים',
        },

        en: {
            title: 'Safqa Account Deletion',
            subtitle:
                'You can delete your Safqa account and associated data at any time.',

            introTitle: 'How to delete your account',
            intro:
                'To permanently delete your account, sign in to your Safqa account, open your Profile page, and follow the account deletion steps.',

            stepsTitle: 'Account deletion steps',

            step1Title: 'Sign in',
            step1:
                'Sign in to your Safqa account using your account credentials.',

            step2Title: 'Open your Profile',
            step2:
                'Open your Profile page from within the application.',

            step3Title: 'Select account deletion',
            step3:
                'Scroll to the "Delete Account" section and select the permanent deletion option.',

            step4Title: 'Confirm deletion',
            step4:
                'Review the confirmation message and confirm that you want to permanently delete your account.',

            deleteDataTitle: 'Data that is deleted',
            deleteDataIntro:
                'When your account is deleted, data associated with your account is deleted or removed according to Safqa policies. This may include:',

            accountData:
                'Account information and personal information associated with your account.',
            listings:
                'Listings and information associated with listings you created.',
            images:
                'Images and media that you uploaded to your listings.',
            messages:
                'Data associated with communication and messaging features, subject to applicable data retention requirements.',

            retainedTitle: 'Data that may be retained',
            retainedText:
                'Some information may be retained for a limited period when required or permitted by law, for security purposes, fraud prevention, dispute resolution, or legal compliance.',

            importantTitle: 'Important',
            importantText:
                'Account deletion is permanent and may not be reversible after the deletion process is completed.',

            loginButton: 'Sign in and delete account',
            backButton: 'Back',
            privacyTitle: 'Privacy and data security',
            privacyText:
                'We handle user data according to Safqa privacy and security practices.',

            supportTitle: 'Unable to access your account?',
            supportText:
                'If you cannot sign in to your account, use the Safqa support contact method available in the application to request deletion of your account and associated data.',

            footer:
                'Safqa — Marketplace for buying and selling between users',
        },
    };

    const t = content[language];

    const steps = [
        {
            number: '1',
            title: t.step1Title,
            text: t.step1,
            icon: <PersonOutlineIcon />,
        },
        {
            number: '2',
            title: t.step2Title,
            text: t.step2,
            icon: <PersonOutlineIcon />,
        },
        {
            number: '3',
            title: t.step3Title,
            text: t.step3,
            icon: <DeleteForeverOutlinedIcon />,
        },
        {
            number: '4',
            title: t.step4Title,
            text: t.step4,
            icon: <CheckCircleOutlineIcon />,
        },
    ];

    const dataToDelete = [
        {
            text: t.accountData,
            icon: <PersonOutlineIcon />,
        },
        {
            text: t.listings,
            icon: <ArticleOutlinedIcon />,
        },
        {
            text: t.images,
            icon: <ImageOutlinedIcon />,
        },
        {
            text: t.messages,
            icon: <ChatOutlinedIcon />,
        },
    ];

    const handleLogin = () => {
        navigate('/login?redirect=/profile');
    };

    return (
        <Box
            dir={isRTL ? 'rtl' : 'ltr'}
            sx={{
                minHeight: '100vh',
                backgroundColor: '#f7f7f7',
                py: { xs: 4, md: 7 },
            }}
        >
            <Container maxWidth="md">

                {/* Header */}
                <Stack
                    spacing={2}
                    alignItems="center"
                    textAlign="center"
                    sx={{ mb: 4 }}
                >
                    <Box
                        sx={{
                            width: 78,
                            height: 78,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#fff3e0',
                            border: '1px solid #ff9800',
                        }}
                    >
                        <DeleteForeverOutlinedIcon
                            sx={{
                                fontSize: 42,
                                color: '#f57c00',
                            }}
                        />
                    </Box>

                    <Typography
                        component="h1"
                        sx={{
                            fontWeight: 800,
                            fontSize: {
                                xs: '1.9rem',
                                sm: '2.3rem',
                            },
                            color: '#222',
                        }}
                    >
                        {t.title}
                    </Typography>

                    <Typography
                        sx={{
                            maxWidth: 650,
                            color: '#666',
                            lineHeight: 1.8,
                            fontSize: '1rem',
                        }}
                    >
                        {t.subtitle}
                    </Typography>
                </Stack>

                {/* Main intro */}
                <Card
                    elevation={0}
                    sx={{
                        mb: 3,
                        borderRadius: 4,
                        border: '1px solid #e5e5e5',
                        backgroundColor: '#fff',
                    }}
                >
                    <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 800,
                                mb: 1.5,
                            }}
                        >
                            {t.introTitle}
                        </Typography>

                        <Typography
                            sx={{
                                color: '#555',
                                lineHeight: 1.9,
                            }}
                        >
                            {t.intro}
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={handleLogin}
                            startIcon={
                                isRTL ? undefined : <DeleteForeverOutlinedIcon />
                            }
                            endIcon={
                                isRTL ? <DeleteForeverOutlinedIcon /> : undefined
                            }
                            sx={{
                                mt: 3,
                                borderRadius: 3,
                                px: 3.5,
                                py: 1.2,
                                fontWeight: 700,
                                backgroundColor: '#f57c00',
                                '&:hover': {
                                    backgroundColor: '#e56f00',
                                },
                            }}
                        >
                            {t.loginButton}
                        </Button>
                    </CardContent>
                </Card>

                {/* Steps */}
                <Card
                    elevation={0}
                    sx={{
                        mb: 3,
                        borderRadius: 4,
                        border: '1px solid #e5e5e5',
                        backgroundColor: '#fff',
                    }}
                >
                    <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 800,
                                mb: 3,
                            }}
                        >
                            {t.stepsTitle}
                        </Typography>

                        <Stack spacing={2.5}>
                            {steps.map((step) => (
                                <Box
                                    key={step.number}
                                    sx={{
                                        display: 'flex',
                                        gap: 2,
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            flexShrink: 0,
                                            width: 46,
                                            height: 46,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#fff7ed',
                                            border: '1px solid #ff9800',
                                            color: '#f57c00',
                                        }}
                                    >
                                        {step.icon}
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                mb: 0.5,
                                            }}
                                        >
                                            {step.number}. {step.title}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: '#666',
                                                lineHeight: 1.8,
                                            }}
                                        >
                                            {step.text}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </CardContent>
                </Card>

                {/* Data deletion */}
                <Card
                    elevation={0}
                    sx={{
                        mb: 3,
                        borderRadius: 4,
                        border: '1px solid #e5e5e5',
                        backgroundColor: '#fff',
                    }}
                >
                    <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 800,
                                mb: 1.5,
                            }}
                        >
                            {t.deleteDataTitle}
                        </Typography>

                        <Typography
                            sx={{
                                color: '#555',
                                lineHeight: 1.8,
                                mb: 2,
                            }}
                        >
                            {t.deleteDataIntro}
                        </Typography>

                        <List disablePadding>
                            {dataToDelete.map((item, index) => (
                                <React.Fragment key={index}>
                                    <ListItem
                                        disableGutters
                                        sx={{
                                            py: 1.3,
                                            alignItems: 'flex-start',
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 42,
                                                color: '#f57c00',
                                                mt: 0.3,
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>

                                        <ListItemText
                                            primary={item.text}
                                            primaryTypographyProps={{
                                                sx: {
                                                    lineHeight: 1.7,
                                                    color: '#444',
                                                },
                                            }}
                                        />
                                    </ListItem>

                                    {index < dataToDelete.length - 1 && (
                                        <Divider />
                                    )}
                                </React.Fragment>
                            ))}
                        </List>
                    </CardContent>
                </Card>

                {/* Retention */}
                <Paper
                    elevation={0}
                    sx={{
                        mb: 3,
                        p: { xs: 2.5, md: 4 },
                        borderRadius: 4,
                        border: '1px solid #e5e5e5',
                        backgroundColor: '#fff',
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="flex-start"
                    >
                        <SecurityOutlinedIcon
                            sx={{
                                color: '#f57c00',
                                fontSize: 32,
                                flexShrink: 0,
                            }}
                        />

                        <Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 800,
                                    mb: 1,
                                }}
                            >
                                {t.retainedTitle}
                            </Typography>

                            <Typography
                                sx={{
                                    color: '#555',
                                    lineHeight: 1.8,
                                }}
                            >
                                {t.retainedText}
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>

                {/* Important warning */}
                <Paper
                    elevation={0}
                    sx={{
                        mb: 3,
                        p: { xs: 2.5, md: 3 },
                        borderRadius: 4,
                        border: '1px solid #f44336',
                        backgroundColor: '#fff',
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 800,
                            color: '#d32f2f',
                            mb: 1,
                        }}
                    >
                        {t.importantTitle}
                    </Typography>

                    <Typography
                        sx={{
                            color: '#555',
                            lineHeight: 1.8,
                        }}
                    >
                        {t.importantText}
                    </Typography>
                </Paper>

                {/* Support */}
                <Card
                    elevation={0}
                    sx={{
                        mb: 4,
                        borderRadius: 4,
                        border: '1px solid #e5e5e5',
                        backgroundColor: '#fff',
                    }}
                >
                    <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                mb: 1,
                            }}
                        >
                            {t.supportTitle}
                        </Typography>

                        <Typography
                            sx={{
                                color: '#666',
                                lineHeight: 1.8,
                            }}
                        >
                            {t.supportText}
                        </Typography>
                    </CardContent>
                </Card>

                {/* Privacy */}
                <Box
                    sx={{
                        textAlign: 'center',
                        mb: 4,
                    }}
                >
                    <SecurityOutlinedIcon
                        sx={{
                            color: '#888',
                            mb: 1,
                        }}
                    />

                    <Typography
                        sx={{
                            fontWeight: 700,
                            mb: 0.7,
                        }}
                    >
                        {t.privacyTitle}
                    </Typography>

                    <Typography
                        sx={{
                            color: '#777',
                            fontSize: '0.9rem',
                            lineHeight: 1.7,
                            maxWidth: 650,
                            mx: 'auto',
                        }}
                    >
                        {t.privacyText}
                    </Typography>
                </Box>

                {/* Back */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 3,
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={() => navigate(-1)}
                        startIcon={
                            !isRTL ? <ArrowBackIosNewIcon fontSize="small" /> : undefined
                        }
                        endIcon={
                            isRTL ? <ArrowBackIosNewIcon fontSize="small" /> : undefined
                        }
                        sx={{
                            borderRadius: 3,
                            px: 3,
                            borderColor: '#ff9800',
                            color: '#f57c00',
                            '&:hover': {
                                borderColor: '#f57c00',
                                backgroundColor: '#fff8f0',
                            },
                        }}
                    >
                        {t.backButton}
                    </Button>
                </Box>

                {/* Footer */}
                <Typography
                    align="center"
                    sx={{
                        color: '#999',
                        fontSize: '0.85rem',
                    }}
                >
                    {t.footer}
                </Typography>
            </Container>
        </Box>
    );
};

export default DeleteAccount;