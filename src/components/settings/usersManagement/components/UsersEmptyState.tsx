import { FunctionComponent } from 'react';
import { Box, Typography } from '@mui/material';

import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';

import { useTranslation } from 'react-i18next';

interface UsersEmptyStateProps {
    filtered?: boolean;
}

const UsersEmptyState: FunctionComponent<UsersEmptyStateProps> = ({
    filtered = false,
}) => {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                py: 8,
                px: 3,
                textAlign: 'center',
            }}
        >
            <PersonSearchOutlinedIcon
                sx={{
                    fontSize: 64,
                    color: 'text.disabled',
                    mb: 2,
                }}
            />

            <Typography variant='h6' fontWeight={700} gutterBottom>
                {filtered
                    ? t('pages.usersManagement.empty.filteredTitle')
                    : t('pages.usersManagement.empty.title')}
            </Typography>

            <Typography color='text.secondary'>
                {filtered
                    ? t('pages.usersManagement.empty.filteredText')
                    : t('pages.usersManagement.empty.text')}
            </Typography>
        </Box>
    );
};

export default UsersEmptyState;
