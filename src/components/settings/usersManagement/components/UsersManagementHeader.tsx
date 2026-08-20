import { FunctionComponent } from 'react';

import {
    Box,
    Typography,
    useTheme,
} from '@mui/material';

import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';

import { useTranslation } from 'react-i18next';

interface Props {
    totalUsers: number;
}

const UsersManagementHeader: FunctionComponent<Props> = ({
    totalUsers,
}) => {
    const theme = useTheme();
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: {
                    xs: 'flex-start',
                    md: 'center',
                },
                justifyContent: 'space-between',
                gap: 2,
                mb: 4,
                flexDirection: {
                    xs: 'column',
                    md: 'row',
                },
            }}
        >
            <Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        mb: 1,
                    }}
                >
                    <PeopleOutlineIcon
                        color="primary"
                        sx={{
                            fontSize: 34,
                        }}
                    />

                    <Typography
                        component="h1"
                        variant="h4"
                        fontWeight={800}
                    >
                        {t(
                            'pages.usersManagement.title',
                        )}
                    </Typography>
                </Box>

                <Typography
                    color="text.secondary"
                >
                    {t(
                        'pages.usersManagement.subtitle',
                    )}
                </Typography>
            </Box>

            <Typography
                variant="body2"
                sx={{
                    color: theme.palette.text
                        .secondary,
                }}
            >
                {totalUsers}{' '}
                {t(
                    'pages.usersManagement.totalUsers',
                )}
            </Typography>
        </Box>
    );
};

export default UsersManagementHeader;