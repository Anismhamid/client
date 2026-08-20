import { FunctionComponent } from 'react';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import EditUserData from '../../../navbar/userManage/EditUserData';


interface Props {
    userId: string | null;
    open: boolean;
    direction: 'ltr' | 'rtl';

    onClose: () => void;
}

const UserDetailsDialog: FunctionComponent<Props> = ({
    userId,
    open,
    direction,
    onClose,
}) => {
    const { t } = useTranslation();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            dir={direction}
        >
            <DialogTitle align="center">
                {t(
                    'pages.usersManagement.editTitle',
                )}
            </DialogTitle>

            <DialogContent>
                {userId && (
                    <EditUserData
                        userId={userId}
                        mode="edit"
                    />
                )}
            </DialogContent>

            <DialogActions
                sx={{
                    justifyContent:
                        'center',
                    pb: 2,
                }}
            >
                <Button
                    variant="contained"
                    color="error"
                    onClick={onClose}
                    sx={{
                        borderRadius: 2,
                    }}
                >
                    {t(
                        'pages.usersManagement.close',
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserDetailsDialog;