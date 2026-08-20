import React, { FunctionComponent } from 'react';
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
    useTheme,
    alpha,
} from '@mui/material';

import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import handleRTL from '../../locales/handleRTL';

const DeleteAccount: FunctionComponent = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { t } = useTranslation();

    const direction = handleRTL();
    const isRTL = direction === 'rtl';

    const steps = [
        {
            number: '1',
            title: t('pages.deleteAccount.steps.step1.title'),
            text: t('pages.deleteAccount.steps.step1.text'),
            icon: <PersonOutlineIcon />,
        },
        {
            number: '2',
            title: t('pages.deleteAccount.steps.step2.title'),
            text: t('pages.deleteAccount.steps.step2.text'),
            icon: <PersonOutlineIcon />,
        },
        {
            number: '3',
            title: t('pages.deleteAccount.steps.step3.title'),
            text: t('pages.deleteAccount.steps.step3.text'),
            icon: <DeleteForeverOutlinedIcon />,
        },
        {
            number: '4',
            title: t('pages.deleteAccount.steps.step4.title'),
            text: t('pages.deleteAccount.steps.step4.text'),
            icon: <CheckCircleOutlineIcon />,
        },
    ];

    const dataToDelete = [
        {
            text: t('pages.deleteAccount.data.account'),
            icon: <PersonOutlineIcon />,
        },
        {
            text: t('pages.deleteAccount.data.listings'),
            icon: <ArticleOutlinedIcon />,
        },
        {
            text: t('pages.deleteAccount.data.images'),
            icon: <ImageOutlinedIcon />,
        },
        {
            text: t('pages.deleteAccount.data.messages'),
            icon: <ChatOutlinedIcon />,
        },
    ];

    const handleLogin = () => {
        navigate('/login?redirect=/profile');
    };

    return (
        <Box
            dir={direction}
            sx={{
                minHeight: '100vh',
                bgcolor: theme.palette.background.default,
                py: { xs: 4, md: 7 },
            }}
        >
            <Container maxWidth='md'>
                {/* Header */}
                <Stack
                    spacing={2}
                    alignItems='center'
                    textAlign='center'
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
                            bgcolor: alpha(theme.palette.error.main, 0.08),
                            border: `2px solid ${theme.palette.error.main}`,
                        }}
                    >
                        <DeleteForeverOutlinedIcon
                            sx={{
                                fontSize: 42,
                                color: theme.palette.error.main,
                            }}
                        />
                    </Box>

                    <Typography
                        component='h1'
                        sx={{
                            fontWeight: 800,
                            fontSize: {
                                xs: '1.9rem',
                                sm: '2.3rem',
                            },
                            color: theme.palette.text.primary,
                        }}
                    >
                        {t('pages.deleteAccount.title')}
                    </Typography>

                    <Typography
                        sx={{
                            maxWidth: 650,
                            color: theme.palette.text.secondary,
                            lineHeight: 1.8,
                            fontSize: '1rem',
                        }}
                    >
                        {t('pages.deleteAccount.subtitle')}
                    </Typography>
                </Stack>

                {/* Main intro */}
                <Card
                    elevation={0}
                    sx={{
                        mb: 3,
                        borderRadius: 4,
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: theme.palette.background.paper,
                    }}
                >
                    <CardContent
                        sx={{
                            p: { xs: 2.5, md: 4 },
                        }}
                    >
                        <Typography
                            variant='h5'
                            sx={{
                                fontWeight: 800,
                                mb: 1.5,
                                color: theme.palette.text.primary,
                            }}
                        >
                            {t('pages.deleteAccount.intro.title')}
                        </Typography>

                        <Typography
                            sx={{
                                color: theme.palette.text.secondary,
                                lineHeight: 1.9,
                            }}
                        >
                            {t('pages.deleteAccount.intro.text')}
                        </Typography>

                        <Button
                            variant='contained'
                            onClick={handleLogin}
                            startIcon={
                                !isRTL ? (
                                    <DeleteForeverOutlinedIcon />
                                ) : undefined
                            }
                            endIcon={
                                isRTL ? (
                                    <DeleteForeverOutlinedIcon />
                                ) : undefined
                            }
                            sx={{
                                mt: 3,
                                borderRadius: 3,
                                px: 3.5,
                                py: 1.2,
                                fontWeight: 700,
                                bgcolor: theme.palette.error.main,

                                '&:hover': {
                                    bgcolor: theme.palette.error.dark,
                                    boxShadow: `0 4px 20px ${alpha(
                                        theme.palette.error.main,
                                        0.4,
                                    )}`,
                                },
                            }}
                        >
                            {t('pages.deleteAccount.intro.loginButton')}
                        </Button>
                    </CardContent>
                </Card>

                {/* Steps */}
                <Card
                    elevation={0}
                    sx={{
                        mb: 3,
                        borderRadius: 4,
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: theme.palette.background.paper,
                    }}
                >
                    <CardContent
                        sx={{
                            p: { xs: 2.5, md: 4 },
                        }}
                    >
                        <Typography
                            variant='h5'
                            sx={{
                                fontWeight: 800,
                                mb: 3,
                                color: theme.palette.text.primary,
                            }}
                        >
                            {t('pages.deleteAccount.steps.title')}
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
                                            bgcolor: alpha(
                                                theme.palette.primary.main,
                                                0.08,
                                            ),
                                            border: `1px solid ${theme.palette.primary.main}`,
                                            color: theme.palette.primary.main,
                                        }}
                                    >
                                        {step.icon}
                                    </Box>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            sx={{
                                                fontWeight: 800,
                                                mb: 0.5,
                                                color: theme.palette.text
                                                    .primary,
                                            }}
                                        >
                                            {step.number}. {step.title}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: theme.palette.text
                                                    .secondary,
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
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: theme.palette.background.paper,
                    }}
                >
                    <CardContent
                        sx={{
                            p: { xs: 2.5, md: 4 },
                        }}
                    >
                        <Typography
                            variant='h5'
                            sx={{
                                fontWeight: 800,
                                mb: 1.5,
                                color: theme.palette.text.primary,
                            }}
                        >
                            {t('pages.deleteAccount.data.title')}
                        </Typography>

                        <Typography
                            sx={{
                                color: theme.palette.text.secondary,
                                lineHeight: 1.8,
                                mb: 2,
                            }}
                        >
                            {t('pages.deleteAccount.data.intro')}
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
                                                color: theme.palette.primary
                                                    .main,
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
                                                    color: theme.palette.text
                                                        .secondary,
                                                },
                                            }}
                                        />
                                    </ListItem>

                                    {index < dataToDelete.length - 1 && (
                                        <Divider
                                            sx={{
                                                borderColor:
                                                    theme.palette.divider,
                                            }}
                                        />
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
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: theme.palette.background.paper,
                    }}
                >
                    <Stack
                        direction={isRTL ? 'row-reverse' : 'row'}
                        spacing={2}
                        alignItems='flex-start'
                    >
                        <SecurityOutlinedIcon
                            sx={{
                                color: theme.palette.info.main,
                                fontSize: 32,
                                flexShrink: 0,
                            }}
                        />

                        <Box>
                            <Typography
                                variant='h6'
                                sx={{
                                    fontWeight: 800,
                                    mb: 1,
                                    color: theme.palette.text.primary,
                                }}
                            >
                                {t('pages.deleteAccount.retention.title')}
                            </Typography>

                            <Typography
                                sx={{
                                    color: theme.palette.text.secondary,
                                    lineHeight: 1.8,
                                }}
                            >
                                {t('pages.deleteAccount.retention.text')}
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
                        border: `2px solid ${theme.palette.error.main}`,
                        bgcolor: alpha(theme.palette.error.main, 0.03),
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 800,
                            color: theme.palette.error.main,
                            mb: 1,
                        }}
                    >
                        ⚠️ {t('pages.deleteAccount.warning.title')}
                    </Typography>

                    <Typography
                        sx={{
                            color: theme.palette.text.secondary,
                            lineHeight: 1.8,
                        }}
                    >
                        {t('pages.deleteAccount.warning.text')}
                    </Typography>
                </Paper>

                {/* Support */}
                <Card
                    elevation={0}
                    sx={{
                        mb: 4,
                        borderRadius: 4,
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: theme.palette.background.paper,
                    }}
                >
                    <CardContent
                        sx={{
                            p: { xs: 2.5, md: 4 },
                        }}
                    >
                        <Typography
                            variant='h6'
                            sx={{
                                fontWeight: 800,
                                mb: 1,
                                color: theme.palette.text.primary,
                            }}
                        >
                            {t('pages.deleteAccount.support.title')}
                        </Typography>

                        <Typography
                            sx={{
                                color: theme.palette.text.secondary,
                                lineHeight: 1.8,
                            }}
                        >
                            {t('pages.deleteAccount.support.text')}
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
                            color: theme.palette.text.secondary,
                            mb: 1,
                        }}
                    />

                    <Typography
                        sx={{
                            fontWeight: 700,
                            mb: 0.7,
                            color: theme.palette.text.primary,
                        }}
                    >
                        {t('pages.deleteAccount.privacy.title')}
                    </Typography>

                    <Typography
                        sx={{
                            color: theme.palette.text.secondary,
                            fontSize: '0.9rem',
                            lineHeight: 1.7,
                            maxWidth: 650,
                            mx: 'auto',
                        }}
                    >
                        {t('pages.deleteAccount.privacy.text')}
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
                        variant='outlined'
                        onClick={() => navigate(-1)}
                        startIcon={
                            !isRTL ? (
                                <ArrowBackIosNewIcon fontSize='small' />
                            ) : undefined
                        }
                        endIcon={
                            isRTL ? (
                                <ArrowBackIosNewIcon fontSize='small' />
                            ) : undefined
                        }
                        sx={{
                            borderRadius: 3,
                            px: 3,
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,

                            '&:hover': {
                                borderColor: theme.palette.primary.dark,
                                bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.04,
                                ),
                            },
                        }}
                    >
                        {t('pages.deleteAccount.back')}
                    </Button>
                </Box>

                {/* Footer */}
                <Typography
                    align='center'
                    sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.85rem',
                        opacity: 0.7,
                    }}
                >
                    {t('pages.deleteAccount.footer')}
                </Typography>
            </Container>
        </Box>
    );
};

export default DeleteAccount;
