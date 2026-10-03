import { FunctionComponent } from 'react';

import { Box, ButtonBase, Paper, Typography, alpha, useTheme } from '@mui/material';

import { useTranslation } from 'react-i18next';

import { UsersStatsData } from '../types/usersManagement.types';

export type StatKey = 'total' | 'active' | 'inactive' | 'admins';

interface Props {
    stats: UsersStatsData;
    active: StatKey | null;
    onSelect: (key: StatKey) => void;
}

const UsersStats: FunctionComponent<Props> = ({ stats, active, onSelect }) => {
    const theme = useTheme();
    const { t } = useTranslation();

    const items: { key: StatKey; label: string; value: number; color: string }[] = [
        {
            key: 'total',
            label: t('pages.usersManagement.stats.total'),
            value: stats.total,
            color: theme.palette.primary.main,
        },
        {
            key: 'active',
            label: t('pages.usersManagement.stats.active'),
            value: stats.active,
            color: theme.palette.success.main,
        },
        {
            key: 'inactive',
            label: t('pages.usersManagement.stats.inactive'),
            value: stats.inactive,
            color: theme.palette.error.main,
        },
        {
            key: 'admins',
            label: t('pages.usersManagement.stats.admins'),
            value: stats.admins,
            color: theme.palette.warning.main,
        },
    ];

    return (
        <Paper
            elevation={0}
            sx={{
                p: 0.5,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 0.5,
            }}
        >
            {items.map((item) => {
                const selected = active === item.key;

                return (
                    <ButtonBase
                        key={item.key}
                        onClick={() => onSelect(item.key)}
                        aria-pressed={selected}
                        sx={{
                            borderRadius: 2.5,
                            px: 2.5,
                            py: 1.75,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            textAlign: 'start',
                            gap: 0.25,
                            bgcolor: selected ? alpha(item.color, 0.1) : 'transparent',
                            transition: 'background-color 0.15s ease',
                            '&:hover': {
                                bgcolor: alpha(item.color, selected ? 0.14 : 0.06),
                            },
                            '&.Mui-focusVisible': {
                                outline: `2px solid ${item.color}`,
                            },
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: item.color,
                                }}
                            />
                            <Typography variant='body2' color='text.secondary'>
                                {item.label}
                            </Typography>
                        </Box>

                        <Typography
                            variant='h4'
                            fontWeight={800}
                            sx={{ fontVariantNumeric: 'tabular-nums' }}
                        >
                            {item.value}
                        </Typography>
                    </ButtonBase>
                );
            })}
        </Paper>
    );
};

export default UsersStats;