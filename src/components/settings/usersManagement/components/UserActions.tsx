import { FunctionComponent } from 'react';

import {
    Box,
    Button,
} from '@mui/material';


import { useTranslation } from 'react-i18next';
import { fontAwesomeIcon } from '../../../../FontAwesome/Icons';

interface Props {
    userId: string;

    onEdit: (
        userId: string,
    ) => void;

    onDelete: (
        userId: string,
    ) => void;
}

const UserActions: FunctionComponent<Props> = ({
    userId,
    onEdit,
    onDelete,
}) => {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent:
                    'center',
                gap: 1,
            }}
        >
            <Button
                variant="outlined"
                color="warning"
                onClick={() =>
                    onEdit(userId)
                }
                aria-label={t(
                    'pages.usersManagement.actions.edit',
                )}
                sx={{
                    borderRadius: 2,
                    minWidth: 42,
                }}
            >
                {fontAwesomeIcon.edit}
            </Button>

            <Button
                variant="outlined"
                color="error"
                onClick={() =>
                    onDelete(userId)
                }
                aria-label={t(
                    'pages.usersManagement.actions.delete',
                )}
                sx={{
                    borderRadius: 2,
                    minWidth: 42,
                }}
            >
                {fontAwesomeIcon.trash}
            </Button>
        </Box>
    );
};

export default UserActions;