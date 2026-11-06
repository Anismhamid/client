import { FunctionComponent, ReactNode } from 'react';
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
const RED = '#B0413E';
const BRAND_GRADIENT = `linear-gradient(135deg, ${GOLD} 0%, ${BROWN} 100%)`;
const PARCHMENT = '#FAF7F0';

const LAST_UPDATED = '30/08/2026';
const CURRENT_URL = 'https://client-qqq1.vercel.app/term-of-use';

/** A circular "wax seal" badge — the page's signature element */
const Seal: FunctionComponent<{ size?: number; children: ReactNode }> = ({
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
    last?: boolean;
    children: ReactNode;
}> = ({ number, title, last = false, children }) => (
    <Box sx={{ display: 'flex', gap: 2.5, mb: last ? 2 : 4 }}>
        <Box sx={{ flexShrink: 0, pt: 0.5 }}>
            <Seal size={40}>{number}</Seal>
        </Box>

        <Box
            sx={{
                flex: 1,
                minWidth: 0,
                pb: last ? 0 : 4,
                borderBottom: last ? 'none' : `1px dashed ${INK}22`,
            }}
        >
            <Typography
                component='h2'
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

/** Plain paragraph used inside clauses */
const Body: FunctionComponent<{
    children: ReactNode;
    mb?: number;
    muted?: boolean;
}> = ({ children, mb = 0, muted = false }) => (
    <Typography
        sx={{
            color: muted ? 'text.secondary' : INK,
            lineHeight: 1.9,
            mb,
        }}
    >
        {children}
    </Typography>
);

/** List of points: "block" = red icon (prohibitions), "dash" = gold dash */
const PointList: FunctionComponent<{
    items: string[];
    variant?: 'block' | 'dash';
}> = ({ items, variant = 'dash' }) => {
    if (items.length === 0) return null;

    return (
        <Stack spacing={1}>
            {items.map((item, i) => (
                <Stack
                    key={i}
                    direction='row'
                    spacing={1.2}
                    alignItems='flex-start'
                >
                    {variant === 'block' ? (
                        <Block sx={{ fontSize: 16, color: RED, mt: 0.5 }} />
                    ) : (
                        <Box sx={{ color: GOLD, fontWeight: 700, mt: 0.1 }}>
                            —
                        </Box>
                    )}
                    <Typography sx={{ color: INK, lineHeight: 1.8 }}>
                        {item}
                    </Typography>
                </Stack>
            ))}
        </Stack>
    );
};

const PerforatedEdge: FunctionComponent<{ position: 'top' | 'bottom' }> = ({
    position,
}) => (
    <Box
        sx={{
            height: 10,
            backgroundImage: `radial-gradient(circle, #EFEAE0 3px, transparent 3.5px)`,
            backgroundSize: '18px 18px',
            backgroundPosition: `${position} center`,
        }}
    />
);

const TermOfUse: FunctionComponent = () => {
    const { t } = useTranslation();
    const direction = handleRTL();
    const isRTL = direction === 'rtl';

    const getStringArray = (key: string): string[] => {
        const value = t(key, { returnObjects: true });
        return Array.isArray(value)
            ? value.filter((item): item is string => typeof item === 'string')
            : [];
    };

    const S = 'pages.terms.sections';

    // Auto-numbering: order of calls below = order of clauses on the page
    let n = 0;
    const next = () => ++n;

    const email = t(`${S}.contact.email`);
    const phone = t(`${S}.contact.phone`);

    return (
        <>
            <link rel='canonical' href={CURRENT_URL} />
            <title>{`${t('pages.terms.title')} | صفقة`}</title>
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
                    <Box
                        sx={{
                            bgcolor: PARCHMENT,
                            borderRadius: 2,
                            boxShadow: '0 20px 50px rgba(18,22,28,0.15)',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <PerforatedEdge position='top' />

                        <Box
                            component='main'
                            sx={{
                                px: { xs: 3, md: 7 },
                                pt: { xs: 4, md: 5 },
                                pb: { xs: 4, md: 6 },
                            }}
                        >
                            {/* Header */}
                            <Stack
                                alignItems='center'
                                spacing={2}
                                sx={{ mb: 5, textAlign: 'center' }}
                            >
                                <Seal size={72}>
                                    <VerifiedRounded sx={{ fontSize: 34 }} />
                                </Seal>

                                <Typography
                                    component='h1'
                                    sx={{
                                        fontSize: { xs: '1.6rem', md: '2.1rem' },
                                        fontWeight: 800,
                                        color: INK,
                                        letterSpacing: '-0.01em',
                                    }}
                                >
                                    {t('pages.terms.title')}
                                </Typography>

                                <Typography
                                    sx={{ color: 'text.secondary', maxWidth: 480 }}
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
                                        date: LAST_UPDATED,
                                    })}
                                </Box>
                            </Stack>

                            <Divider sx={{ mb: 5, borderColor: `${INK}18` }} />

                            {/* 1. Eligibility */}
                            <Clause
                                number={next()}
                                title={t(`${S}.eligibility.title`)}
                            >
                                <Body>{t(`${S}.eligibility.text`)}</Body>
                            </Clause>

                            {/* 2. Registration */}
                            <Clause
                                number={next()}
                                title={t(`${S}.registration.title`)}
                            >
                                <Body>
                                    {t(`${S}.registration.text`)}{' '}
                                    <MuiLink
                                        component={Link}
                                        to={path.PrivacyAndPolicy}
                                        sx={{ color: GOLD, fontWeight: 600 }}
                                    >
                                        {t(`${S}.registration.privacyPolicy`)}
                                    </MuiLink>
                                </Body>
                            </Clause>

                            {/* 3. Products & listings */}
                            <Clause
                                number={next()}
                                title={t(`${S}.products.title`)}
                            >
                                <Body>{t(`${S}.products.text`)}</Body>
                            </Clause>

                            {/* 4. Seller obligations */}
                            <Clause
                                number={next()}
                                title={t(`${S}.sellerObligations.title`)}
                            >
                                <PointList
                                    items={getStringArray(
                                        `${S}.sellerObligations.points`,
                                    )}
                                />
                            </Clause>

                            {/* 5. User content */}
                            <Clause
                                number={next()}
                                title={t(`${S}.userContent.title`)}
                            >
                                <Body>{t(`${S}.userContent.text`)}</Body>
                            </Clause>

                            {/* 6. Prohibited items */}
                            <Clause
                                number={next()}
                                title={t('pages.terms.prohibitedItems.title')}
                            >
                                <Body mb={2}>
                                    {t('pages.terms.prohibitedItems.text')}
                                </Body>
                                <PointList
                                    variant='block'
                                    items={getStringArray(
                                        'pages.terms.prohibitedItems.points',
                                    )}
                                />
                            </Clause>

                            {/* 7. Responsibility: platform nature + legal address */}
                            <Clause
                                number={next()}
                                title={t(`${S}.responsibility.title`)}
                            >
                                <Typography
                                    sx={{
                                        color: INK,
                                        lineHeight: 1.9,
                                        fontWeight: 600,
                                        mb: 0.5,
                                    }}
                                >
                                    {t(`${S}.responsibility.platform.title`)}
                                </Typography>
                                <Body muted mb={2}>
                                    {t(`${S}.responsibility.platform.text`)}
                                </Body>

                                <Typography
                                    sx={{
                                        color: INK,
                                        lineHeight: 1.9,
                                        fontWeight: 600,
                                        mb: 0.5,
                                    }}
                                >
                                    {t(`${S}.responsibility.legalAddress.title`)}
                                </Typography>
                                <Body muted>
                                    <strong>
                                        {t(
                                            `${S}.responsibility.legalAddress.addressLabel`,
                                        )}
                                    </strong>{' '}
                                    {t(
                                        `${S}.responsibility.legalAddress.address`,
                                    )}
                                    <br />
                                    <strong>
                                        {t(
                                            `${S}.responsibility.legalAddress.noteLabel`,
                                        )}
                                    </strong>{' '}
                                    {t(`${S}.responsibility.legalAddress.note`)}
                                </Body>
                            </Clause>

                            {/* 8. User conduct */}
                            <Clause
                                number={next()}
                                title={t(`${S}.userConduct.title`)}
                            >
                                <Box sx={{ mb: 2 }}>
                                    <PointList
                                        items={getStringArray(
                                            `${S}.userConduct.points`,
                                        )}
                                    />
                                </Box>
                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                        fontStyle: 'italic',
                                    }}
                                >
                                    {t(`${S}.userConduct.warning`)}
                                </Typography>
                            </Clause>

                            {/* 9. Blocking */}
                            <Clause
                                number={next()}
                                title={t(`${S}.blocking.title`)}
                            >
                                <Body mb={2}>{t(`${S}.blocking.text`)}</Body>
                                <PointList
                                    variant='block'
                                    items={getStringArray(
                                        `${S}.blocking.points`,
                                    )}
                                />
                            </Clause>

                            {/* 10. Liability */}
                            <Clause
                                number={next()}
                                title={t(`${S}.liability.title`)}
                            >
                                <PointList
                                    items={getStringArray(
                                        `${S}.liability.points`,
                                    )}
                                />
                            </Clause>

                            {/* 11. Reporting */}
                            <Clause
                                number={next()}
                                title={t(`${S}.reporting.title`)}
                            >
                                <Body>{t(`${S}.reporting.text`)}</Body>
                            </Clause>

                            {/* 12. Termination */}
                            <Clause
                                number={next()}
                                title={t(`${S}.termination.title`)}
                            >
                                <Body>{t(`${S}.termination.text`)}</Body>
                            </Clause>

                            {/* 13. Changes */}
                            <Clause
                                number={next()}
                                title={t(`${S}.changes.title`)}
                            >
                                <Body>{t(`${S}.changes.text`)}</Body>
                            </Clause>

                            {/* 14. Governing law */}
                            <Clause
                                number={next()}
                                title={t(`${S}.governingLaw.title`)}
                            >
                                <Body>{t(`${S}.governingLaw.text`)}</Body>
                            </Clause>

                            {/* 15. Contact */}
                            <Clause
                                number={next()}
                                title={t(`${S}.contact.title`)}
                                last
                            >
                                <Body>
                                    <strong>
                                        {t(`${S}.contact.emailLabel`)}
                                    </strong>{' '}
                                    <MuiLink
                                        href={`mailto:${email}`}
                                        sx={{ color: GOLD, fontWeight: 600 }}
                                    >
                                        {email}
                                    </MuiLink>
                                    <br />
                                    <strong>
                                        {t(`${S}.contact.phoneLabel`)}
                                    </strong>{' '}
                                    <MuiLink
                                        href={`tel:${phone}`}
                                        dir='ltr'
                                        sx={{
                                            color: GOLD,
                                            fontWeight: 600,
                                            unicodeBidi: 'isolate',
                                        }}
                                    >
                                        {phone}
                                    </MuiLink>
                                </Body>
                            </Clause>

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

                        <PerforatedEdge position='bottom' />
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