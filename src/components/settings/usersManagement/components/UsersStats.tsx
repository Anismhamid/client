import { FunctionComponent } from 'react';

import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    alpha,
    useTheme,
} from '@mui/material';

import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';

import { UsersStatsData } from '../types/usersManagement.types';
import { useTranslation } from 'react-i18next';

interface Props {
    stats: UsersStatsData;
}

const UsersStats: FunctionComponent<Props> = ({ stats }) => {
    const theme = useTheme();
    const { t } = useTranslation();

    const cards = [
        {
            label: t('pages.usersManagement.stats.total'),
            value: stats.total,
            icon: <PeopleOutlineIcon />,
            color: theme.palette.primary.main,
        },
        {
            label: t('pages.usersManagement.stats.active'),
            value: stats.active,
            icon: <CheckCircleOutlineIcon />,
            color: theme.palette.success.main,
        },
        {
            label: t('pages.usersManagement.stats.inactive'),
            value: stats.inactive,
            icon: <PersonOffOutlinedIcon />,
            color: theme.palette.error.main,
        },
        {
            label: t('pages.usersManagement.stats.admins'),
            value: stats.admins,
            icon: <AdminPanelSettingsOutlinedIcon />,
            color: theme.palette.warning.main,
        },
    ];

    return (
        <Grid container spacing={2} sx={{ mb: 3 }}>
            {cards.map((card) => (
                <Grid
                    size={{
                        xs: 12,
                        sm: 6,
                        lg: 3,
                    }}
                    key={card.label}
                >
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                            height: '100%',
                        }}
                    >
                        <CardContent>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Box>
                                    <Typography
                                        variant='body2'
                                        color='text.secondary'
                                    >
                                        {card.label}
                                    </Typography>

                                    <Typography variant='h4' fontWeight={800}>
                                        {card.value}
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: card.color,
                                        bgcolor: alpha(card.color, 0.1),
                                    }}
                                >
                                    {card.icon}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default UsersStats;
