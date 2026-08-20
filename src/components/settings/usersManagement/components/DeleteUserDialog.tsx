import { FunctionComponent } from 'react';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';

import { useTranslation } from 'react-i18next';

interface Props {
    open: boolean;
    userName?: string;

    onClose: () => void;
    onConfirm: () => void;
}

const DeleteUserDialog: FunctionComponent<Props> = ({
    open,
    userName,
    onClose,
    onConfirm,
}) => {
    const { t } = useTranslation();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle
                align="center"
                fontWeight={800}
            >
                {t(
                    'pages.usersManagement.delete.title',
                )}
            </DialogTitle>

            <DialogContent>
                <Typography
                    align="center"
                    color="text.secondary"
                >
                    {t(
                        'pages.usersManagement.delete.message',
                        {
                            name:
                                userName ||
                                '',
                        },
                    )}
                </Typography>
            </DialogContent>

            <DialogActions
                sx={{
                    justifyContent:
                        'center',
                    gap: 1,
                    pb: 3,
                }}
            >
                <Button
                    variant="outlined"
                    onClick={onClose}
                >
                    {t(
                        'pages.usersManagement.delete.cancel',
                    )}
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={onConfirm}
                >
                    {t(
                        'pages.usersManagement.delete.confirmButton',
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteUserDialog;