import { FunctionComponent } from 'react';

import { Box, Typography } from '@mui/material';

import { useTranslation } from 'react-i18next';

interface Props {
    totalUsers: number;
}

const UsersManagementHeader: FunctionComponent<Props> = ({ totalUsers }) => {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: 2,
                flexWrap: 'wrap',
            }}
        >
            <Box>
                <Typography
                    component='h1'
                    variant='h4'
                    fontWeight={800}
                    letterSpacing={-0.5}
                >
                    {t('pages.usersManagement.title')}
                </Typography>

                <Typography color='text.secondary' sx={{ mt: 0.5 }}>
                    {t('pages.usersManagement.subtitle')}
                </Typography>
            </Box>

            <Typography variant='body2' color='text.secondary'>
                {totalUsers} {t('pages.usersManagement.stats.total')}
            </Typography>
        </Box>
    );
};

export default UsersManagementHeader;