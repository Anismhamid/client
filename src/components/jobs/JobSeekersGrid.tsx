import { FunctionComponent, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
    alpha,
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';

import {
    AccessTimeOutlined,
    CloseRounded,
    LanguageOutlined,
    LocationOnOutlined,
    PaymentsOutlined,
    PersonSearchOutlined,
    PhoneOutlined,
    TranslateOutlined,
    WhatsApp,
    Link as LinkIcon
} from '@mui/icons-material';

import { JobSeeker } from '../../interfaces/jobs.types';
import {
    BRAND_BROWN,
    BRAND_GOLD,
    BRAND_GRADIENT,
} from '../pages/Jobs/jobsBrand';
import { CategoryIcon } from '../pages/Jobs/jobsIcons';

import {
    ArrowFab,
    EmptyState,
    isRecent,
    NewBadge,
    Reveal,
    SalaryTag,
    Ticket,
    TicketBand,
    TICKETS_GRID_SX,
} from './ticketParts';
import {
    AVAILABILITIES,
    HEBREW_LEVELS,
    JOB_CATEGORIES,
    JOB_REGIONS,
    labelOf,
    SEEKER_LANGUAGES,
    timeAgo,
    whatsappLink,
} from '../pages/Jobs/Jobsoptions';
import { DISPLAY_FONT, INK } from '../pages/Jobs/jobBrand';

// ─── Shared info ───────────────────────────────────────────

const AVAILABILITY_COLOR: Record<string, string> = {
    immediate: '#2E9E5B',
    two_weeks: BRAND_GOLD,
    month: '#8A8F98',
    flexible: '#8A8F98',
};

const useSeekerInfo = (s: JobSeeker) => {
    const { t, i18n } = useTranslation();

    const salaryText = s.expectedSalary
        ? s.expectedSalary.toLocaleString(i18n.language)
        : null;

    return {
        t,
        salaryText,
        period: s.salaryPeriod
            ? t(`pages.jobs.salaryPeriods.${s.salaryPeriod}`)
            : undefined,
        place: [labelOf(t, 'regions', JOB_REGIONS, s.region), s.location]
            .filter(Boolean)
            .join('، '),
        category: labelOf(t, 'categories', JOB_CATEGORIES, s.category),
        hebrew: labelOf(t, 'hebrewLevels', HEBREW_LEVELS, s.hebrewLevel),
        availability: labelOf(
            t,
            'availabilities',
            AVAILABILITIES,
            s.availability,
        ),
        languages: s.languages
            .map((l) => labelOf(t, 'languages', SEEKER_LANGUAGES, l))
            .join('، '),
        posted: timeAgo(s.createdAt, i18n.language),
        name: s.user?.name?.first ?? '',
    };
};

const InfoRow: FunctionComponent<{ icon: ReactNode; children: ReactNode }> = ({
    icon,
    children,
}) => (
    <Stack
        direction='row'
        spacing={1}
        alignItems='center'
        sx={{ color: 'text.secondary' }}
    >
        {icon}
        <Typography variant='body2' component='span'>
            {children}
        </Typography>
    </Stack>
);

// ─── Dialog ────────────────────────────────────────────────

const SeekerDialogContent: FunctionComponent<{
    seeker: JobSeeker;
    onClose: () => void;
}> = ({ seeker: s, onClose }) => {
    const info = useSeekerInfo(s);
    const { t } = info;
    const phone = s.showPhone ? s.user?.phone?.phone_1 : undefined;

    return (
        <Dialog
            open
            onClose={onClose}
            fullWidth
            maxWidth='sm'
            scroll='paper'
            PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
        >
            {/* Ink header */}
            <Box
                sx={{
                    position: 'relative',
                    bgcolor: INK,
                    color: '#fff',
                    px: 3,
                    pt: 3,
                    pb: 4,
                }}
            >
                <IconButton
                    aria-label={t('common.close', 'إغلاق')}
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        insetInlineEnd: 8,
                        top: 8,
                        color: '#fff',
                    }}
                >
                    <CloseRounded />
                </IconButton>

                <Stack
                    direction='row'
                    spacing={1}
                    alignItems='center'
                    sx={{ color: BRAND_GOLD, mb: 1 }}
                >
                    <Box sx={{ display: 'grid', fontSize: 20 }}>
                        <CategoryIcon category={s.category} />
                    </Box>
                    <Typography variant='body2' fontWeight={700}>
                        {info.category}
                    </Typography>
                </Stack>

                <Typography
                    component='h2'
                    sx={{
                        fontFamily: DISPLAY_FONT,
                        fontWeight: 800,
                        fontSize: '1.5rem',
                        lineHeight: 1.35,
                        pe: 4,
                    }}
                >
                    {s.title}
                </Typography>

                <Stack
                    direction='row'
                    spacing={1.25}
                    alignItems='center'
                    sx={{ mt: 2 }}
                >
                    <Avatar
                        src={s.user?.image?.url}
                        alt={info.name}
                        sx={{
                            width: 40,
                            height: 40,
                            border: `2px solid ${BRAND_GOLD}`,
                        }}
                    />
                    <Box>
                        <Typography fontWeight={700} lineHeight={1.2}>
                            {info.name}
                        </Typography>
                        {info.posted && (
                            <Typography variant='caption' sx={{ opacity: 0.7 }}>
                                {info.posted}
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </Box>

            <DialogContent sx={{ pt: 3 }}>
                <Stack spacing={2.25}>
                    <Stack direction='row' flexWrap='wrap' gap={0.75}>
                        {s.types.map((v) => (
                            <Chip
                                key={v}
                                size='small'
                                variant='outlined'
                                label={t(`pages.jobs.types.${v}`)}
                            />
                        ))}
                        {s.experienceLevel && (
                            <Chip
                                size='small'
                                variant='outlined'
                                label={t(
                                    `pages.jobs.experienceLevels.${s.experienceLevel}`,
                                )}
                            />
                        )}
                        {s.remote && (
                            <Chip
                                size='small'
                                variant='outlined'
                                label={t('pages.jobs.remote')}
                                sx={{ borderColor: BRAND_GOLD }}
                            />
                        )}
                    </Stack>

                    <Stack spacing={1}>
                        {info.place && (
                            <InfoRow
                                icon={<LocationOnOutlined fontSize='small' />}
                            >
                                {info.place}
                            </InfoRow>
                        )}
                        {info.salaryText && (
                            <InfoRow
                                icon={
                                    <PaymentsOutlined
                                        fontSize='small'
                                        sx={{ color: BRAND_BROWN }}
                                    />
                                }
                            >
                                <b>
                                    <bdi>{info.salaryText}</bdi> ₪
                                </b>
                                {info.period ? ` / ${info.period}` : ''}
                            </InfoRow>
                        )}
                        <InfoRow icon={<AccessTimeOutlined fontSize='small' />}>
                            {t(
                                'pages.jobs.seekers.availableLabel',
                                'جاهز للبدء',
                            )}
                            : {info.availability}
                        </InfoRow>
                        <InfoRow icon={<TranslateOutlined fontSize='small' />}>
                            {t('pages.jobs.seekers.hebrewLabel', 'العبرية')}:{' '}
                            {info.hebrew}
                        </InfoRow>
                        {info.languages && (
                            <InfoRow
                                icon={<LanguageOutlined fontSize='small' />}
                            >
                                {info.languages}
                            </InfoRow>
                        )}
                    </Stack>

                    {s.about && (
                        <Typography
                            sx={{ whiteSpace: 'pre-line', lineHeight: 1.9 }}
                        >
                            {s.about}
                        </Typography>
                    )}

                    {s.skills.length > 0 && (
                        <Stack direction='row' flexWrap='wrap' gap={0.75}>
                            {s.skills.map((k) => (
                                <Chip
                                    key={k}
                                    size='small'
                                    label={k}
                                    sx={{
                                        bgcolor: alpha(BRAND_GOLD, 0.14),
                                        color: 'text.primary',
                                    }}
                                />
                            ))}
                        </Stack>
                    )}

                    {s.portfolioUrl && (
                        <Button
                            component='a'
                            href={s.portfolioUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            startIcon={<LinkIcon />} // استخدم أيقونة مناسبة
                            sx={{ color: BRAND_GOLD }}
                        >
                            {t(
                                'pages.jobs.seekers.viewPortfolio',
                                'عرض معرض الأعمال',
                            )}
                        </Button>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions
                sx={{ p: 2, pt: 0, gap: 1, justifyContent: 'flex-start' }}
            >
                {phone ? (
                    <>
                        <Button
                            component='a'
                            href={`tel:${phone}`}
                            disableElevation
                            startIcon={<PhoneOutlined />}
                            sx={{
                                px: 2.5,
                                fontWeight: 700,
                                color: '#fff',
                                background: BRAND_GRADIENT,
                            }}
                        >
                            {t('pages.jobs.seekers.call', 'اتصل')}
                        </Button>
                        <Button
                            component='a'
                            href={whatsappLink(phone)}
                            target='_blank'
                            rel='noopener noreferrer'
                            variant='outlined'
                            startIcon={<WhatsApp />}
                            sx={{
                                px: 2.5,
                                fontWeight: 700,
                                color: '#1FA855',
                                borderColor: '#1FA855',
                            }}
                        >
                            {t('pages.jobs.seekers.whatsapp', 'واتساب')}
                        </Button>
                    </>
                ) : (
                    <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ px: 1 }}
                    >
                        {t(
                            'pages.jobs.seekers.noPhone',
                            'صاحب البوست ما نشر رقمه',
                        )}
                    </Typography>
                )}
            </DialogActions>
        </Dialog>
    );
};

// ─── Ticket ────────────────────────────────────────────────

interface SeekerCardProps {
    seeker: JobSeeker;
    onOpen: (s: JobSeeker) => void;
    onToggle?: (s: JobSeeker) => void;
    onDelete?: (s: JobSeeker) => void;
}

const SeekerTicket: FunctionComponent<SeekerCardProps> = ({
    seeker: s,
    onOpen,
    onToggle,
    onDelete,
}) => {
    const info = useSeekerInfo(s);
    const { t } = info;
    const dot = AVAILABILITY_COLOR[s.availability] ?? '#8A8F98';

    const open = () => onOpen(s);

    return (
        <Stack sx={{ height: '100%' }}>
            <Box sx={{ flex: 1 }}>
                <Ticket
                    tone='seeker'
                    muted={!s.active}
                    paperProps={{
                        role: 'button',
                        tabIndex: 0,
                        onClick: open,
                        onKeyDown: (e: React.KeyboardEvent) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                open();
                            }
                        },
                    }}
                    band={
                        <TicketBand
                            tone='seeker'
                            icon={<CategoryIcon category={s.category} />}
                            label={info.category}
                            trailing={t(
                                'pages.jobs.seekers.badge',
                                'بدور على شغل',
                            )}
                        />
                    }
                    footer={
                        <Stack
                            direction='row'
                            alignItems='center'
                            justifyContent='space-between'
                            spacing={1}
                        >
                            <Box sx={{ minWidth: 0 }}>
                                <SalaryTag
                                    amount={info.salaryText}
                                    period={info.period}
                                />
                                <Stack
                                    direction='row'
                                    spacing={0.75}
                                    alignItems='center'
                                    sx={{ mt: 0.25 }}
                                >
                                    <Box
                                        aria-hidden
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            bgcolor: dot,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <Typography
                                        variant='caption'
                                        color='text.secondary'
                                        noWrap
                                    >
                                        {info.availability}
                                    </Typography>
                                    {isRecent(s.createdAt) && <NewBadge />}
                                </Stack>
                            </Box>
                            <ArrowFab />
                        </Stack>
                    }
                >
                    <Stack
                        direction='row'
                        spacing={1.75}
                        alignItems='flex-start'
                    >
                        <Avatar
                            src={s.user?.image?.url}
                            alt={info.name}
                            sx={{
                                width: 52,
                                height: 52,
                                flexShrink: 0,
                                fontFamily: DISPLAY_FONT,
                                fontWeight: 800,
                                color: BRAND_BROWN,
                                bgcolor: alpha(BRAND_GOLD, 0.14),
                                border: `2px solid ${BRAND_GOLD}`,
                            }}
                        >
                            {info.name.charAt(0).toUpperCase()}
                        </Avatar>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                component='h3'
                                sx={{
                                    fontFamily: DISPLAY_FONT,
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    lineHeight: 1.4,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }}
                            >
                                {s.title}
                            </Typography>
                            <Typography
                                color='text.secondary'
                                variant='body2'
                                noWrap
                                sx={{ mt: 0.25 }}
                            >
                                {info.name}
                            </Typography>
                            {info.place && (
                                <Stack
                                    direction='row'
                                    spacing={0.5}
                                    alignItems='center'
                                    sx={{ mt: 0.25, color: 'text.secondary' }}
                                >
                                    <LocationOnOutlined sx={{ fontSize: 17 }} />
                                    <Typography variant='body2' noWrap>
                                        {info.place}
                                    </Typography>
                                </Stack>
                            )}
                        </Box>
                    </Stack>

                    <Stack
                        direction='row'
                        flexWrap='wrap'
                        gap={0.75}
                        sx={{ mt: 2 }}
                    >
                        {s.types.slice(0, 2).map((v) => (
                            <Chip
                                key={v}
                                size='small'
                                variant='outlined'
                                label={t(`pages.jobs.types.${v}`)}
                            />
                        ))}
                        <Chip
                            size='small'
                            variant='outlined'
                            label={`${t('pages.jobs.seekers.hebrewLabel', 'العبرية')}: ${info.hebrew}`}
                            sx={{ borderColor: BRAND_GOLD }}
                        />
                    </Stack>

                    {s.skills.length > 0 && (
                        <Typography
                            variant='body2'
                            color='text.secondary'
                            noWrap
                            sx={{ mt: 1.5 }}
                        >
                            {s.skills.slice(0, 4).join(' • ')}
                        </Typography>
                    )}
                </Ticket>
            </Box>

            {(onToggle || onDelete) && (
                <Stack direction='row' spacing={1} sx={{ mt: 1 }}>
                    {onToggle && (
                        <Button
                            size='small'
                            variant='outlined'
                            onClick={() => onToggle(s)}
                            sx={{ color: BRAND_BROWN, borderColor: 'divider' }}
                        >
                            {s.active
                                ? t('pages.jobs.seekers.deactivate', 'تعطيل')
                                : t('pages.jobs.seekers.activate', 'تفعيل')}
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            size='small'
                            color='error'
                            onClick={() => onDelete(s)}
                        >
                            {t('pages.jobs.seekers.delete', 'حذف')}
                        </Button>
                    )}
                </Stack>
            )}
        </Stack>
    );
};

// ─── Grid ──────────────────────────────────────────────────

interface JobSeekersGridProps {
    seekers: JobSeeker[];
    onToggle?: (s: JobSeeker) => void;
    onDelete?: (s: JobSeeker) => void;
    onCreate?: () => void;
}

const JobSeekersGrid: FunctionComponent<JobSeekersGridProps> = ({
    seekers,
    onToggle,
    onDelete,
    onCreate,
}) => {
    const { t } = useTranslation();
    const [selected, setSelected] = useState<JobSeeker | null>(null);

    if (seekers.length === 0) {
        return (
            <EmptyState
                icon={<PersonSearchOutlined fontSize='inherit' />}
                title={t('pages.jobs.seekers.empty', 'ما في بوستات هون')}
                hint={t(
                    'pages.jobs.seekers.emptyHint',
                    'جرّب قسم تاني، أو كون أول واحد بيعلن إنه بدور على شغل.',
                )}
                actionLabel={
                    onCreate
                        ? t(
                              'pages.jobs.tabs.seekerCreate',
                              'نزّل بوست: بدور على شغل',
                          )
                        : undefined
                }
                onAction={onCreate}
            />
        );
    }

    return (
        <>
            <Box sx={TICKETS_GRID_SX}>
                {seekers.map((s, i) => (
                    <Reveal key={s._id} index={i}>
                        <SeekerTicket
                            seeker={s}
                            onOpen={setSelected}
                            onToggle={onToggle}
                            onDelete={onDelete}
                        />
                    </Reveal>
                ))}
            </Box>

            {selected && (
                <SeekerDialogContent
                    seeker={selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </>
    );
};

export default JobSeekersGrid;
