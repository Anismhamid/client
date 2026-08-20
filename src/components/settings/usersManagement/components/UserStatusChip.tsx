import { FunctionComponent } from 'react';

import { Chip } from '@mui/material';

import { useTranslation } from 'react-i18next';

interface Props {
    status?: boolean;
}

const UserStatusChip: FunctionComponent<Props> = ({
    status,
}) => {
    const { t } = useTranslation();

    return (
        <Chip
            size="small"
            label={
                status
                    ? t(
                          'pages.usersManagement.status.active',
                      )
                    : t(
                          'pages.usersManagement.status.inactive',
                      )
            }
            color={
                status
                    ? 'success'
                    : 'error'
            }
            sx={{
                borderRadius: 5,
                fontWeight: 700,
            }}
        />
    );
};

export default UserStatusChip;