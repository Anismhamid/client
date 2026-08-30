import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Container,
    Typography,
    Divider,
    List,
    ListItem,
    Stack,
    useMediaQuery,
    useTheme,
} from '@mui/material';

import handleRTL from '../../locales/handleRTL';
import PrivacyPolicyJsonLd from '../../../utils/PrivacyPolicyJsonLd';

const INK = '#12161C';
const BRAND_GRADIENT = 'linear-gradient(135deg, #B8860B 0%, #8B4513 100%)';

/**
 * Safqa Privacy Policy page
 */
const PrivacyAdnPolicy: FunctionComponent = () => {
    const { t } = useTranslation();
    const direction = handleRTL();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [activeId, setActiveId] = useState<string>('intro');

    const currentUrl = 'https://client-qqq1.vercel.app/privacy-and-policy';

    const sections = [
        { id: 'intro', label: t('pages.privacy.intro.title') },
        { id: 'collectedInfo', label: t('pages.privacy.collectedInfo.title') },
        { id: 'usage', label: t('pages.privacy.usage.title') },
        { id: 'consent', label: t('pages.privacy.consent.title') },
        { id: 'sharing', label: t('pages.privacy.sharing.title') },
        { id: 'external', label: t('pages.privacy.external.title') },
        { id: 'messages', label: t('pages.privacy.messages.title') },
        { id: 'retention', label: t('pages.privacy.retention.title') },
        { id: 'protection', label: t('pages.privacy.protection.title') },
        { id: 'updates', label: t('pages.privacy.updates.title') },
        { id: 'rights', label: t('pages.privacy.rights.title') },
        { id: 'userConsent', label: t('pages.privacy.userConsent.title') },
        { id: 'contact', label: t('pages.privacy.contact.title') },
    ];

    const scrollTo = (id: string) => {
        setActiveId(id);
        document
            .getElementById(id)
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <>
            <title>{t('pages.privacy.title')}</title>

            <meta
                name='description'
                content='تعرف على سياسة الخصوصية في منصة صفقة، وكيفية جمع واستخدام وحماية بيانات المستخدمين وحقوقهم المتعلقة بالخصوصية.'
            />

            <meta
                name='keywords'
                content='سياسة الخصوصية, صفقة, Safqa, بيانات المستخدم, حماية البيانات, الخصوصية'
            />

            <link rel='canonical' href={currentUrl} />

            <Box
                component='main'
                dir={direction}
                sx={{ minHeight: '100vh', bgcolor: 'background.default' }}
            >
                {/* Header band */}
                <Box sx={{ background: BRAND_GRADIENT, py: { xs: 5, md: 7 } }}>
                    <Container maxWidth='md'>
                        <Typography
                            variant='h1'
                            sx={{
                                fontSize: { xs: '1.9rem', md: '2.5rem' },
                                fontWeight: 700,
                                color: '#fff',
                                mb: 1,
                            }}
                        >
                            {t('pages.privacy.title')}
                        </Typography>

                        <Typography sx={{ color: 'rgba(255,255,255,0.85)' }}>
                            {t('pages.privacy.lastUpdated', {
                                date: '30/08/2026',
                            })}
                        </Typography>
                    </Container>
                </Box>

                <Container maxWidth='lg' sx={{ py: { xs: 4, md: 6 } }}>
                    <Stack
                        direction={isMobile ? 'column' : 'row'}
                        spacing={{ xs: 4, md: 6 }}
                        alignItems='flex-start'
                    >
                        {/* Table of contents */}
                        {!isMobile && (
                            <Box
                                sx={{
                                    position: 'sticky',
                                    top: 24,
                                    width: 260,
                                    flexShrink: 0,
                                    borderInlineStart: `2px solid ${theme.palette.divider}`,
                                    ps: 2,
                                }}
                            >
                                <Typography
                                    variant='overline'
                                    sx={{ color: 'text.secondary', letterSpacing: 1 }}
                                >
                                    {t('pages.privacy.tocLabel', 'المحتويات')}
                                </Typography>

                                <List dense disablePadding sx={{ mt: 1 }}>
                                    {sections.map((s) => (
                                        <ListItem
                                            key={s.id}
                                            disablePadding
                                            onClick={() => scrollTo(s.id)}
                                            sx={{
                                                py: 0.5,
                                                cursor: 'pointer',
                                                color:
                                                    activeId === s.id
                                                        ? '#B8860B'
                                                        : 'text.secondary',
                                                fontWeight:
                                                    activeId === s.id ? 700 : 400,
                                                fontSize: '0.9rem',
                                                transition: 'color .15s ease',
                                                '&:hover': { color: '#B8860B' },
                                            }}
                                        >
                                            {s.label}
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}

                        {/* Body */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Section id='intro' index={1} title={t('pages.privacy.intro.title')}>
                                <Typography sx={{ color: INK, lineHeight: 1.9 }}>
                                    {t('pages.privacy.intro.text')}
                                </Typography>
                            </Section>

                            <Section
                                id='collectedInfo'
                                index={2}
                                title={t('pages.privacy.collectedInfo.title')}
                            >
                                <Typography sx={{ color: INK, lineHeight: 1.9, mb: 2 }}>
                                    {t('pages.privacy.collectedInfo.text')}
                                </Typography>
                                <BulletList
                                    items={[
                                        t('pages.privacy.collectedInfo.info.name'),
                                        t('pages.privacy.collectedInfo.info.email'),
                                        t('pages.privacy.collectedInfo.info.image'),
                                        t('pages.privacy.collectedInfo.technical'),
                                    ]}
                                />
                            </Section>

                            <Section id='usage' index={3} title={t('pages.privacy.usage.title')}>
                                <BulletList
                                    items={[
                                        t('pages.privacy.usage.points.p1'),
                                        t('pages.privacy.usage.points.p2'),
                                        t('pages.privacy.usage.points.p3'),
                                        t('pages.privacy.usage.points.p4'),
                                    ]}
                                />
                            </Section>

                            <Section id='consent' index={4} title={t('pages.privacy.consent.title')}>
                                <Typography sx={{ color: INK, lineHeight: 1.9 }}>
                                    {t('pages.privacy.consent.text')}
                                </Typography>
                            </Section>

                            <Section id='sharing' index={5} title={t('pages.privacy.sharing.title')}>
                                <BulletList items={[t('pages.privacy.sharing.points.law')]} />
                            </Section>

                            <Section id='external' index={6} title={t('pages.privacy.external.title')}>
                                <Typography sx={{ color: INK, lineHeight: 1.9 }}>
                                    {t('pages.privacy.external.text')}
                                </Typography>
                            </Section>

                            <Section id='messages' index={7} title={t('pages.privacy.messages.title')}>
                                <Typography sx={{ color: INK, lineHeight: 1.9 }}>
                                    {t('pages.privacy.messages.text')}
                                </Typography>
                            </Section>

                            <Section id='retention' index={8} title={t('pages.privacy.retention.title')}>
                                <Typography sx={{ color: INK, lineHeight: 1.9 }}>
                                    {t('pages.privacy.retention.text')}
                                </Typography>
                            </Section>

                            <Section
                                id='protection'
                                index={9}
                                title={t('pages.privacy.protection.title')}
                            >
                                <Typography sx={{ color: INK, lineHeight: 1.9 }}>
                                    {t('pages.privacy.protection.text')}
                                </Typography>
                            </Section>

                            <Section id='updates' index={10} title={t('pages.privacy.updates.title')}>
                                <Typography sx={{ color: INK, lineHeight: 1.9 }}>
                                    {t('pages.privacy.updates.text')}
                                </Typography>
                            </Section>

                            <Section id='rights' index={11} title={t('pages.privacy.rights.title')}>
                                <BulletList
                                    items={[
                                        t('pages.privacy.rights.points.p1'),
                                        t('pages.privacy.rights.points.p2'),
                                        t('pages.privacy.rights.points.p3'),
                                        t('pages.privacy.rights.points.p4'),
                                    ]}
                                />
                            </Section>

                            <Section
                                id='userConsent'
                                index={12}
                                title={t('pages.privacy.userConsent.title')}
                            >
                                <Typography sx={{ color: INK, lineHeight: 1.9 }}>
                                    {t('pages.privacy.userConsent.text')}
                                </Typography>
                            </Section>

                            <Section id='contact' index={13} title={t('pages.privacy.contact.title')} last>
                                <BulletList
                                    items={[
                                        t('pages.privacy.contact.text'),
                                        t('pages.privacy.contact.phone'),
                                    ]}
                                />
                            </Section>
                        </Box>
                    </Stack>
                </Container>

                <noscript>
                    <div style={{ padding: 32 }}>
                        <h1 style={{ color: INK }}>سياسة الخصوصية | صفقة</h1>
                        <p>آخر تحديث: 30/08/2026</p>
                        <p>
                            في منصة صفقة، نحن نهتم بخصوصيتك ونلتزم بحماية
                            بياناتك الشخصية. توضح هذه السياسة كيفية جمع
                            المعلومات واستخدامها وحمايتها والحفاظ على سريتها.
                        </p>
                    </div>
                </noscript>

                <PrivacyPolicyJsonLd />
            </Box>
        </>
    );
};

/** One numbered policy section, with the gradient-accented index badge */
const Section: FunctionComponent<{
    id: string;
    index: number;
    title: string;
    last?: boolean;
    children: React.ReactNode;
}> = ({ id, index, title, last, children }) => (
    <Box id={id} component='section' sx={{ mb: 5, scrollMarginTop: 96 }}>
        <Stack direction='row' spacing={2} alignItems='center' sx={{ mb: 2 }}>
            <Box
                sx={{
                    width: 32,
                    height: 32,
                    minWidth: 32,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: BRAND_GRADIENT,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                }}
            >
                {index}
            </Box>
            <Typography variant='h2' sx={{ fontSize: '1.25rem', fontWeight: 700, color: INK }}>
                {title}
            </Typography>
        </Stack>

        <Box sx={{ ps: { xs: 0, sm: 6 } }}>{children}</Box>

        {!last && <Divider sx={{ mt: 4 }} />}
    </Box>
);

/** Bullet list styled with the brand accent instead of default markers */
const BulletList: FunctionComponent<{ items: string[] }> = ({ items }) => (
    <List disablePadding>
        {items.map((item, i) => (
            <ListItem
                key={i}
                disablePadding
                sx={{
                    display: 'list-item',
                    color: INK,
                    lineHeight: 1.9,
                    mb: 1,
                    ps: 1,
                    '&::marker': { color: '#B8860B' },
                }}
            >
                {item}
            </ListItem>
        ))}
    </List>
);

export default PrivacyAdnPolicy;