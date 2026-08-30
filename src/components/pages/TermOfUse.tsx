import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { path } from '../../routes/routes';
import {
    Container,
    Typography,
    Box,
    Divider,
    Link as MuiLink,
    Button,
    Stack,
} from '@mui/material';
import { ArrowBack, Block, VerifiedRounded } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import handleRTL from '../../locales/handleRTL';

const INK = '#12161C';
const GOLD = '#B8860B';
const BROWN = '#8B4513';
const BRAND_GRADIENT = `linear-gradient(135deg, ${GOLD} 0%, ${BROWN} 100%)`;
const PARCHMENT = '#FAF7F0';

/** A circular "wax seal" badge — the page's signature element */
const Seal: FunctionComponent<{ size?: number; children: React.ReactNode }> = ({
    size = 44,
    children,
}) => (
    <Box
        sx={{
            width: size,
            height: size,
            minWidth: size,
            borderRadius: '50%',
            background: BRAND_GRADIENT,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: size * 0.4,
            position: 'relative',
            boxShadow: `0 0 0 3px ${PARCHMENT}, 0 0 0 4px ${GOLD}55`,
        }}
    >
        {children}
    </Box>
);

/** One numbered clause ("بند"), styled like an article in a signed contract */
const Clause: FunctionComponent<{
    number: number;
    title: string;
    children: React.ReactNode;
}> = ({ number, title, children }) => (
    <Box sx={{ display: 'flex', gap: 2.5, mb: 4 }}>
        <Box sx={{ flexShrink: 0, pt: 0.5 }}>
            <Seal size={40}>{number}</Seal>
        </Box>

        <Box
            sx={{
                flex: 1,
                minWidth: 0,
                pb: 4,
                borderBottom: `1px dashed ${INK}22`,
            }}
        >
            <Typography
                sx={{
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    color: INK,
                    mb: 1,
                }}
            >
                {title}
            </Typography>
            {children}
        </Box>
    </Box>
);

const TermOfUse: FunctionComponent = () => {
    const { t } = useTranslation();
    const direction = handleRTL();
    const isRTL = direction === 'rtl';

    const currentUrl = 'https://client-qqq1.vercel.app/term-of-use';

    const getStringArray = (key: string): string[] => {
        const value = t(key, { returnObjects: true });
        return Array.isArray(value)
            ? value.filter((item): item is string => typeof item === 'string')
            : [];
    };

    const userConductPoints = getStringArray(
        'pages.terms.sections.userConduct.points',
    );
    const prohibitedItemsPoints = getStringArray(
        'pages.terms.prohibitedItems.points',
    );

    return (
        <>
            <link rel='canonical' href={currentUrl} />
            <title>{t('pages.terms.title')} | صفقة</title>
            <meta name='description' content={t('pages.terms.description')} />

            <Box
                dir={direction}
                sx={{
                    minHeight: '100vh',
                    bgcolor: '#EFEAE0',
                    py: { xs: 4, md: 8 },
                }}
            >
                <Container maxWidth='md'>
                    {/* The "document" */}
                    <Box
                        sx={{
                            bgcolor: PARCHMENT,
                            borderRadius: 2,
                            boxShadow: '0 20px 50px rgba(18,22,28,0.15)',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Perforated top edge */}
                        <Box
                            sx={{
                                height: 10,
                                backgroundImage: `radial-gradient(circle, #EFEAE0 3px, transparent 3.5px)`,
                                backgroundSize: '18px 18px',
                                backgroundPosition: 'top center',
                            }}
                        />

                        <Box
                            sx={{
                                px: { xs: 3, md: 7 },
                                pt: { xs: 4, md: 5 },
                                pb: { xs: 4, md: 6 },
                            }}
                        >
                            {/* Seal of authenticity */}
                            <Stack
                                alignItems='center'
                                spacing={2}
                                sx={{ mb: 5, textAlign: 'center' }}
                            >
                                <Box sx={{ position: 'relative' }}>
                                    <Seal size={72}>
                                        <VerifiedRounded
                                            sx={{ fontSize: 34 }}
                                        />
                                    </Seal>
                                </Box>

                                <Typography
                                    sx={{
                                        fontSize: {
                                            xs: '1.6rem',
                                            md: '2.1rem',
                                        },
                                        fontWeight: 800,
                                        color: INK,
                                        letterSpacing: '-0.01em',
                                    }}
                                >
                                    {t('pages.terms.title')}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                        maxWidth: 480,
                                    }}
                                >
                                    {t('pages.terms.subtitle')}
                                </Typography>

                                <Box
                                    component='span'
                                    sx={{
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        color: GOLD,
                                        border: `1px solid ${GOLD}55`,
                                        borderRadius: 5,
                                        px: 1.8,
                                        py: 0.4,
                                    }}
                                >
                                    {t('pages.terms.lastUpdated', {
                                        date: '30/08/2026',
                                    })}
                                </Box>
                            </Stack>

                            <Divider sx={{ mb: 5, borderColor: `${INK}18` }} />

                            {/* Clauses */}
                            <Clause
                                number={1}
                                title={t(
                                    'pages.terms.sections.eligibility.title',
                                )}
                            >
                                <Typography
                                    sx={{ color: INK, lineHeight: 1.9 }}
                                >
                                    {t('pages.terms.sections.eligibility.text')}
                                </Typography>
                            </Clause>

                            <Clause
                                number={2}
                                title={t(
                                    'pages.terms.sections.registration.title',
                                )}
                            >
                                <Typography
                                    sx={{ color: INK, lineHeight: 1.9 }}
                                >
                                    {t(
                                        'pages.terms.sections.registration.text',
                                    )}{' '}
                                    <MuiLink
                                        component={Link}
                                        to={path.PrivacyAndPolicy}
                                        sx={{ color: GOLD, fontWeight: 600 }}
                                    >
                                        {t(
                                            'pages.terms.sections.registration.privacyPolicy',
                                        )}
                                    </MuiLink>
                                </Typography>
                            </Clause>

                            <Clause
                                number={3}
                                title={t('pages.terms.sections.products.title')}
                            >
                                <Typography
                                    sx={{ color: INK, lineHeight: 1.9 }}
                                >
                                    {t('pages.terms.sections.products.text')}
                                </Typography>
                            </Clause>

                            <Clause
                                number={4}
                                title={t('pages.terms.prohibitedItems.title')}
                            >
                                <Typography
                                    sx={{ color: INK, lineHeight: 1.9, mb: 2 }}
                                >
                                    {t('pages.terms.prohibitedItems.text')}
                                </Typography>

                                <Stack spacing={1}>
                                    {prohibitedItemsPoints.map((item, i) => (
                                        <Stack
                                            key={i}
                                            direction='row'
                                            spacing={1.2}
                                            alignItems='flex-start'
                                        >
                                            <Block
                                                sx={{
                                                    fontSize: 16,
                                                    color: '#B0413E',
                                                    mt: 0.4,
                                                }}
                                            />
                                            <Typography
                                                variant='body2'
                                                sx={{ color: INK }}
                                            >
                                                {item}
                                            </Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Clause>

                            <Clause
                                number={5}
                                title={t(
                                    'pages.terms.sections.responsibility.title',
                                )}
                            >
                                <Typography
                                    sx={{
                                        color: INK,
                                        lineHeight: 1.9,
                                        fontWeight: 600,
                                        mb: 0.5,
                                    }}
                                >
                                    {t(
                                        'pages.terms.sections.responsibility.platform.title',
                                    )}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                        lineHeight: 1.9,
                                        mb: 2,
                                    }}
                                >
                                    {t(
                                        'pages.terms.sections.responsibility.platform.text',
                                    )}
                                </Typography>

                                <Typography
                                    sx={{
                                        color: INK,
                                        lineHeight: 1.9,
                                        fontWeight: 600,
                                        mb: 0.5,
                                    }}
                                >
                                    {t(
                                        'pages.terms.sections.responsibility.legalAddress.title',
                                    )}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                        lineHeight: 1.9,
                                    }}
                                >
                                    <strong>
                                        {t(
                                            'pages.terms.sections.responsibility.legalAddress.addressLabel',
                                        )}
                                    </strong>{' '}
                                    {t(
                                        'pages.terms.sections.responsibility.legalAddress.address',
                                    )}
                                    <br />
                                    <strong>
                                        {t(
                                            'pages.terms.sections.responsibility.legalAddress.noteLabel',
                                        )}
                                    </strong>{' '}
                                    {t(
                                        'pages.terms.sections.responsibility.legalAddress.note',
                                    )}
                                </Typography>
                            </Clause>

                            <Box sx={{ display: 'flex', gap: 2.5, mb: 2 }}>
                                <Box sx={{ flexShrink: 0, pt: 0.5 }}>
                                    <Seal size={40}>6</Seal>
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: '1.05rem',
                                            color: INK,
                                            mb: 1,
                                        }}
                                    >
                                        {t(
                                            'pages.terms.sections.userConduct.title',
                                        )}
                                    </Typography>

                                    <Stack spacing={1} sx={{ mb: 2 }}>
                                        {userConductPoints.map((item, i) => (
                                            <Stack
                                                key={i}
                                                direction='row'
                                                spacing={1.2}
                                                alignItems='flex-start'
                                            >
                                                <Box
                                                    sx={{
                                                        color: GOLD,
                                                        fontWeight: 700,
                                                        mt: 0.1,
                                                    }}
                                                >
                                                    —
                                                </Box>
                                                <Typography
                                                    sx={{
                                                        color: INK,
                                                        lineHeight: 1.8,
                                                    }}
                                                >
                                                    {item}
                                                </Typography>
                                            </Stack>
                                        ))}
                                    </Stack>

                                    <Typography
                                        sx={{
                                            color: 'text.secondary',
                                            fontStyle: 'italic',
                                        }}
                                    >
                                        {t(
                                            'pages.terms.sections.userConduct.warning',
                                        )}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Signature line */}
                            <Box
                                sx={{
                                    mt: 6,
                                    pt: 4,
                                    borderTop: `2px solid ${INK}`,
                                }}
                            >
                                <Typography
                                    sx={{
                                        textAlign: 'center',
                                        color: INK,
                                        fontWeight: 700,
                                        mb: 3,
                                    }}
                                >
                                    {t('pages.terms.actions.title')}
                                </Typography>

                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={2}
                                    justifyContent='center'
                                >
                                    <Button
                                        variant='contained'
                                        size='large'
                                        component={Link}
                                        to={path.Register}
                                        sx={{
                                            minWidth: 200,
                                            background: BRAND_GRADIENT,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {t('pages.terms.actions.register')}
                                    </Button>

                                    <Button
                                        variant='outlined'
                                        size='large'
                                        component={Link}
                                        to={path.Login}
                                        startIcon={
                                            isRTL ? undefined : <ArrowBack />
                                        }
                                        endIcon={
                                            isRTL ? <ArrowBack /> : undefined
                                        }
                                        sx={{
                                            minWidth: 200,
                                            borderColor: INK,
                                            color: INK,
                                        }}
                                    >
                                        {t('pages.terms.actions.login')}
                                    </Button>
                                </Stack>
                            </Box>
                        </Box>

                        {/* Perforated bottom edge */}
                        <Box
                            sx={{
                                height: 10,
                                backgroundImage: `radial-gradient(circle, #EFEAE0 3px, transparent 3.5px)`,
                                backgroundSize: '18px 18px',
                                backgroundPosition: 'bottom center',
                            }}
                        />
                    </Box>

                    {/* Quick links, outside the "document" */}
                    <Stack
                        direction='row'
                        spacing={3}
                        justifyContent='center'
                        sx={{ mt: 4, flexWrap: 'wrap' }}
                    >
                        <MuiLink
                            component={Link}
                            to={path.PrivacyAndPolicy}
                            sx={{ color: INK, fontSize: '0.9rem' }}
                        >
                            {t('pages.terms.sidebar.privacy')}
                        </MuiLink>
                        <MuiLink
                            component={Link}
                            to={path.SafetyHelp}
                            sx={{ color: INK, fontSize: '0.9rem' }}
                        >
                            {t('pages.terms.sidebar.safety')}
                        </MuiLink>
                        <MuiLink
                            component={Link}
                            to={path.Contact}
                            sx={{ color: INK, fontSize: '0.9rem' }}
                        >
                            {t('pages.terms.sidebar.contact')}
                        </MuiLink>
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

export default TermOfUse;
