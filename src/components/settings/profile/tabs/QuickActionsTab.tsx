import { FunctionComponent, ReactNode } from 'react';
import {
    Box,
    Card,
    Chip,
    List,
    ListItemButton,
    Typography,
    alpha,
} from '@mui/material';
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Edit,
    Email,
    Lock,
    QrCode,
    Security,
    SupportAgent,
    Tune,
    Visibility,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import handleRTL from '../../../../locales/handleRTL';
import { path } from '../../../../routes/routes';
import { AMBER, AMBER_DEEP, SectionHeader } from '../ProfileShared';
import { User } from '../../../../interfaces/chat/usersMessages';

interface QuickActionsTabProps {
    user: User;
    onEditProfile?: () => void;
    editOpen?: boolean;
}

interface ActionRow {
    key: string;
    icon: ReactNode;
    title: string;
    description: string;
    onClick?: () => void;
    expanded?: boolean;
}

const IconTile: FunctionComponent<{ children: ReactNode; muted?: boolean }> = ({
    children,
    muted,
}) => (
    <Box
        aria-hidden='true'
        sx={(theme) => ({
            width: 40,
            height: 40,
            flexShrink: 0,
            borderRadius: '12px',
            display: 'grid',
            placeItems: 'center',
            bgcolor: muted
                ? alpha(theme.palette.text.secondary, 0.08)
                : alpha(AMBER, 0.14),
            color: muted
                ? 'text.secondary'
                : theme.palette.mode === 'dark'
                  ? AMBER
                  : AMBER_DEEP,
        })}
    >
        {children}
    </Box>
);

const QuickActionsTab: FunctionComponent<QuickActionsTabProps> = ({
    user,
    onEditProfile,
    editOpen = false,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dir = handleRTL();
    const Chevron = dir === 'rtl' ? ChevronLeft : ChevronRight;

    const active: ActionRow[] = [
        ...(onEditProfile
            ? [
                  {
                      key: 'edit',
                      icon: <Edit />,
                      title: editOpen
                          ? t('profile.hideEditProfile')
                          : t('profile.showEditProfile'),
                      description: t('profile.actions.editDesc', {
                          defaultValue:
                              'الاسم، الهاتف، العنوان والصورة الشخصية',
                      }),
                      onClick: onEditProfile,
                      expanded: editOpen,
                  },
              ]
            : []),
        {
            key: 'business',
            icon: <QrCode />,
            title: t('profile.myBusinessPages'),
            description: t('profile.actions.businessDesc', {
                defaultValue: 'صفحتك العامة كما يراها المشترون',
            }),
            onClick: () => navigate(`/users/customer/${user?.slug}`),
        },
        {
            key: 'support',
            icon: <SupportAgent />,
            title: t('profile.technicalSupport'),
            description: t('profile.actions.supportDesc', {
                defaultValue: 'تواصل معنا إذا واجهت أي مشكلة',
            }),
            onClick: () => navigate(path.Contact),
        },
    ];

    const soon: Omit<ActionRow, 'onClick'>[] = [
        {
            key: 'password',
            icon: <Security />,
            title: t('profile.changePassword'),
            description: '',
        },
        {
            key: 'privacy',
            icon: <Lock />,
            title: t('profile.accountPrivacy'),
            description: '',
        },
        {
            key: 'mail',
            icon: <Email />,
            title: t('profile.mailNotifications'),
            description: '',
        },
        {
            key: 'appearance',
            icon: <Visibility />,
            title: t('profile.appearanceSettings'),
            description: '',
        },
        {
            key: 'export',
            icon: <Download />,
            title: t('profile.dataExport'),
            description: '',
        },
    ];

    return (
        <Card variant='outlined' sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <SectionHeader
                icon={<Tune />}
                title={t('profile.quickProcedures')}
            />

            <List disablePadding>
                {active.map((row, i) => (
                    <ListItemButton
                        key={row.key}
                        onClick={row.onClick}
                        divider={i < active.length - 1}
                        aria-expanded={row.expanded}
                        sx={{ px: 3, py: 1.75, gap: 2 }}
                    >
                        <IconTile>{row.icon}</IconTile>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography fontWeight={700}>
                                {row.title}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                                {row.description}
                            </Typography>
                        </Box>
                        <Chevron
                            aria-hidden='true'
                            sx={{
                                color: 'text.disabled',
                                transform: row.expanded
                                    ? 'rotate(90deg)'
                                    : 'none',
                                transition: 'transform .2s',
                            }}
                        />
                    </ListItemButton>
                ))}
            </List>

            <Box
                sx={(theme) => ({
                    px: 3,
                    py: 1.25,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    bgcolor: alpha(theme.palette.text.primary, 0.03),
                })}
            >
                <Typography
                    variant='caption'
                    fontWeight={700}
                    color='text.secondary'
                >
                    {t('profile.comingSoon', { defaultValue: 'قريباً' })}
                </Typography>
            </Box>

            <List disablePadding>
                {soon.map((row, i) => (
                    <Box
                        key={row.key}
                        sx={(theme) => ({
                            px: 3,
                            py: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            opacity: 0.65,
                            borderBottom:
                                i < soon.length - 1
                                    ? `1px solid ${theme.palette.divider}`
                                    : 'none',
                        })}
                    >
                        <IconTile muted>{row.icon}</IconTile>
                        <Typography sx={{ flex: 1 }} fontWeight={600}>
                            {row.title}
                        </Typography>
                        <Chip
                            size='small'
                            variant='outlined'
                            label={t('profile.comingSoon', {
                                defaultValue: 'قريباً',
                            })}
                        />
                    </Box>
                ))}
            </List>
        </Card>
    );
};

export default QuickActionsTab;
